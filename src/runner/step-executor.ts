import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execa } from 'execa';
import type { ResolvedAgent } from '../agents/agent-resolver.js';
import type { PlanStep } from './plan-parser.js';
import type { TokenUsage, StepResult } from './token-tracker.js';
import type { StepStatus } from '../utils/progress-panel.js';

interface ClaudeJsonOutput {
  result?: string;
  is_error?: boolean;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

function buildCleanEnv(): Record<string, string> {
  const env = { ...process.env } as Record<string, string>;
  delete env['CLAUDECODE'];
  delete env['CLAUDE_CODE'];
  return env;
}

function buildPrompt(step: PlanStep, totalSteps: number, cwd: string): string {
  const ruleContent = readFileSync(step.filepath, 'utf-8');
  return [
    `You are executing step ${step.index + 1} of ${totalSteps} in a project audit.`,
    `Working directory: ${cwd}`,
    '',
    'Read and follow the instructions below exactly:',
    '',
    ruleContent,
  ].join('\n');
}

function buildAgentArgs(agent: ResolvedAgent): string[] {
  switch (agent.name) {
    case 'claude':
      return [
        '-p',
        '--allowedTools', 'Read,Bash,Glob,Grep,Write',
        '--output-format', 'json',
        '--model', agent.model,
        '--max-turns', '50',
      ];
    case 'cursor':
      return ['--print', '--output-format', 'json'];
    case 'gemini':
      return ['-p', '--yolo', '-o', 'json'];
  }
}

function parseTokenUsage(stdout: string, agentName: string): TokenUsage {
  const defaults: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  };

  if (agentName === 'claude') {
    try {
      const lines = stdout.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (!line.startsWith('{')) continue;
        const parsed: ClaudeJsonOutput = JSON.parse(line);
        if (parsed.usage) {
          return {
            inputTokens: parsed.usage.input_tokens || 0,
            outputTokens: parsed.usage.output_tokens || 0,
            cacheReadTokens: parsed.usage.cache_read_input_tokens || 0,
            cacheWriteTokens: parsed.usage.cache_creation_input_tokens || 0,
          };
        }
      }
    } catch {
      // fallback to defaults
    }
  }

  return defaults;
}

/**
 * Execute a single audit step by spawning the AI agent.
 */
export async function executeStep(options: {
  agent: ResolvedAgent;
  step: PlanStep;
  totalSteps: number;
  cwd: string;
}): Promise<StepResult> {
  const { agent, step, totalSteps, cwd } = options;
  const cleanEnv = buildCleanEnv();
  const prompt = buildPrompt(step, totalSteps, cwd);
  const args = buildAgentArgs(agent);

  const startTime = Date.now();
  let success = true;
  let stdout = '';

  try {
    const result = await execa(agent.binary, args, {
      cwd,
      input: prompt,
      timeout: 600_000,
      reject: false,
      env: cleanEnv,
    });

    stdout = result.stdout;
    if (result.exitCode !== 0) {
      success = false;
    }
  } catch {
    success = false;
  }

  const durationMs = Date.now() - startTime;
  const tokens = parseTokenUsage(stdout, agent.name);

  return {
    stepIndex: step.index,
    stepTitle: step.title,
    tokens,
    durationMs,
    success,
  };
}

/**
 * Try to find the score from a step's artifact file.
 * Scans reports/.artifacts/ for files matching step_XX_*.md
 * and looks for "Score: XX/100" pattern.
 */
export function findStepScore(cwd: string, stepIndex: number): number | null {
  const artifactsDir = join(cwd, 'reports', '.artifacts');
  if (!existsSync(artifactsDir)) return null;

  const padded = String(stepIndex).padStart(2, '0');

  try {
    const files = readdirSync(artifactsDir).filter(
      (f) => f.includes(`step_${padded}`) && f.endsWith('.md'),
    );

    for (const file of files) {
      const content = readFileSync(join(artifactsDir, file), 'utf-8');
      const match = content.match(/Score:\s*(\d+)\s*\/\s*100/i);
      if (match) return parseInt(match[1], 10);
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Map a score + success to a visual step status.
 */
export function scoreToStatus(score: number | null, success: boolean): StepStatus {
  if (!success) return 'error';
  if (score === null) return 'info';
  if (score >= 85) return 'strong';
  if (score >= 70) return 'fair';
  return 'weak';
}
