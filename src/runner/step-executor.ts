import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execa } from 'execa';
import type { ResolvedAgent } from '../agents/agent-resolver.js';
import type { PlanStep } from './plan-parser.js';
import type { TokenUsage, StepResult } from './token-tracker.js';
import type { StepStatus } from '../utils/progress-panel.js';

function buildCleanEnv(): Record<string, string> {
  const env = { ...process.env } as Record<string, string>;
  delete env['CLAUDECODE'];
  delete env['CLAUDE_CODE'];
  return env;
}

function collectPriorArtifacts(cwd: string, currentStepIndex: number, auditType: string): string {
  const artifactsDir = join(cwd, 'reports', '.artifacts');
  if (!existsSync(artifactsDir)) return '';

  const prefix = auditType === 'health' ? 'step_' : 'practices_step_';
  const artifacts: string[] = [];

  try {
    const files = readdirSync(artifactsDir)
      .filter((f) => f.startsWith(prefix) && f.endsWith('.md'))
      .sort();

    for (const file of files) {
      // Extract step number from filename
      const match = file.match(/step_(\d+)/);
      if (!match) continue;
      const stepNum = parseInt(match[1], 10);
      if (stepNum >= currentStepIndex) continue;

      const content = readFileSync(join(artifactsDir, file), 'utf-8');
      artifacts.push(`--- Artifact: ${file} ---\n${content}`);
    }
  } catch {
    // ignore
  }

  return artifacts.length > 0
    ? '\n\n## Context from prior steps (already completed — DO NOT re-read these files)\n\n' + artifacts.join('\n\n')
    : '';
}

function buildPrompt(step: PlanStep, totalSteps: number, cwd: string, auditType: string): string {
  const ruleContent = readFileSync(step.filepath, 'utf-8');
  const priorContext = step.index > 0 ? collectPriorArtifacts(cwd, step.index, auditType) : '';

  return [
    `You are executing step ${step.index + 1} of ${totalSteps} in a project audit.`,
    `Working directory: ${cwd}`,
    '',
    'IMPORTANT: Be concise and efficient. Minimize tool calls. Do not read files already provided in context below.',
    '',
    'Read and follow the instructions below exactly:',
    '',
    ruleContent,
    priorContext,
  ].join('\n');
}

function parseTokenUsage(stdout: string, agent: ResolvedAgent): TokenUsage {
  if (agent.config.parseTokens) {
    return agent.config.parseTokens(stdout);
  }
  return { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
}

/**
 * Execute a single audit step by spawning the AI agent.
 */
export async function executeStep(options: {
  agent: ResolvedAgent;
  step: PlanStep;
  totalSteps: number;
  cwd: string;
  auditType: string;
}): Promise<StepResult> {
  const { agent, step, totalSteps, cwd, auditType } = options;
  const cleanEnv = buildCleanEnv();
  const prompt = buildPrompt(step, totalSteps, cwd, auditType);
  const args = agent.config.buildArgs(agent.model, prompt);

  const startTime = Date.now();
  let success = true;
  let stdout = '';

  try {
    const result = await execa(agent.binary, args, {
      cwd,
      input: agent.config.promptVia === 'stdin' ? prompt : undefined,
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
  const tokens = parseTokenUsage(stdout, agent);

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
