import { execSync } from 'node:child_process';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';

export function getHomeDir(): string {
  return homedir();
}

export function getPlatform(): 'darwin' | 'linux' | 'win32' {
  return platform() as 'darwin' | 'linux' | 'win32';
}

export function which(binary: string): string | null {
  try {
    const result = execSync(`which ${binary}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return result.trim() || null;
  } catch {
    return null;
  }
}

export function getClaudeSkillsDir(): string {
  return join(getHomeDir(), '.claude', 'skills');
}

export function getCursorCommandsDir(): string {
  return join(getHomeDir(), '.cursor', 'commands');
}

export function getGeminiDir(): string {
  return join(getHomeDir(), '.gemini', 'antigravity');
}
