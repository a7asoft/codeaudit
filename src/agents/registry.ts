import type { TokenUsage } from '../runner/token-tracker.js';
import type { BaseInstaller } from './base-installer.js';
import { ClaudeInstaller } from './claude-installer.js';
import { CursorInstaller } from './cursor-installer.js';
import { GeminiInstaller } from './gemini-installer.js';

export interface AgentConfig {
  name: string;
  displayName: string;
  binaries: string[];
  models: string[];
  buildArgs: (model: string, prompt: string) => string[];
  promptVia: 'stdin' | 'arg';
  parseTokens?: (stdout: string) => TokenUsage;
  installer?: () => BaseInstaller;
}

function parseClaudeTokens(stdout: string): TokenUsage {
  const defaults: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  };

  try {
    const lines = stdout.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line.startsWith('{')) continue;
      const parsed = JSON.parse(line);
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

  return defaults;
}

export const AGENTS: AgentConfig[] = [
  {
    name: 'claude',
    displayName: 'Claude Code',
    binaries: ['claude'],
    models: ['sonnet', 'opus', 'haiku'],
    promptVia: 'stdin',
    buildArgs: (model) => [
      '-p',
      '--allowedTools', 'Read,Bash,Glob,Grep,Write',
      '--output-format', 'json',
      '--model', model,
      '--max-turns', '25',
    ],
    parseTokens: parseClaudeTokens,
    installer: () => new ClaudeInstaller(),
  },
  {
    name: 'cursor',
    displayName: 'Cursor',
    binaries: ['cursor-agent', 'cursor'],
    models: ['sonnet', 'gpt-4o', 'gemini-pro'],
    promptVia: 'stdin',
    buildArgs: () => ['--print', '--output-format', 'json'],
    installer: () => new CursorInstaller(),
  },
  {
    name: 'gemini',
    displayName: 'Gemini CLI',
    binaries: ['gemini'],
    models: ['gemini-2.5-pro', 'gemini-2.5-flash'],
    promptVia: 'stdin',
    buildArgs: () => ['-p', '--yolo', '-o', 'json'],
    installer: () => new GeminiInstaller(),
  },
  {
    name: 'codex',
    displayName: 'OpenAI Codex',
    binaries: ['codex'],
    models: ['gpt-5.2-codex', 'gpt-5-codex', 'o3', 'o4-mini'],
    promptVia: 'arg',
    buildArgs: (model, prompt) => [
      'exec', prompt, '--json', '--full-auto', '-m', model,
    ],
  },
  {
    name: 'cline',
    displayName: 'Cline',
    binaries: ['cline'],
    models: ['claude-sonnet-4-5-20250929', 'gpt-4o', 'gemini-2.5-pro'],
    promptVia: 'stdin',
    buildArgs: (model) => ['-y', '--json', '-m', model, '--timeout', '600'],
  },
  {
    name: 'goose',
    displayName: 'Goose',
    binaries: ['goose'],
    models: ['claude-sonnet-4-5', 'gpt-4o', 'gemini-2.5-pro'],
    promptVia: 'arg',
    buildArgs: (model, prompt) => [
      'run', '-t', prompt, '--output-format', 'json', '--quiet',
      '--no-session', '--model', model, '--max-turns', '25',
    ],
  },
  {
    name: 'aider',
    displayName: 'Aider',
    binaries: ['aider'],
    models: ['claude-sonnet-4-5', 'gpt-4o', 'deepseek/deepseek-chat'],
    promptVia: 'arg',
    buildArgs: (model, prompt) => [
      '--message', prompt, '--model', model, '--yes', '--no-git',
    ],
  },
  {
    name: 'copilot',
    displayName: 'GitHub Copilot',
    binaries: ['copilot'],
    models: ['claude-sonnet-4', 'gpt-5'],
    promptVia: 'arg',
    buildArgs: (model, prompt) => [
      '--prompt', prompt, '--allow-all-tools', '--model', model,
    ],
  },
  {
    name: 'qwen',
    displayName: 'Qwen Code',
    binaries: ['qwen'],
    models: ['qwen3-coder', 'qwen3-coder-next'],
    promptVia: 'stdin',
    buildArgs: (model) => ['-p', '--yolo', '-o', 'json', '--model', model],
  },
];

export function getAgent(name: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.name === name);
}

export function getAgentNames(): string[] {
  return AGENTS.map((a) => a.name);
}

export function getAgentByBinary(binary: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.binaries.includes(binary));
}
