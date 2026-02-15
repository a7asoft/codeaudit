import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import { getHomeDir } from './platform.js';

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const REMOTE_PKG_URL = 'https://raw.githubusercontent.com/a7asoft/codeaudit/main/package.json';
const CACHE_DIR = join(getHomeDir(), '.codeaudit');
const CACHE_FILE = join(CACHE_DIR, '.update-check.json');

interface CacheData {
  lastCheck: number;
  latestVersion: string;
}

function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

function getCurrentVersion(): string | null {
  try {
    const pkgPath = join(CACHE_DIR, 'package.json');
    if (existsSync(pkgPath)) {
      return JSON.parse(readFileSync(pkgPath, 'utf-8')).version || null;
    }
  } catch {}
  return null;
}

function readCache(): CacheData | null {
  try {
    if (existsSync(CACHE_FILE)) {
      return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch {}
  return null;
}

function writeCache(data: CacheData): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(data));
  } catch {}
}

function isNewer(remote: string, local: string): boolean {
  const r = remote.split('.').map(Number);
  const l = local.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((r[i] || 0) > (l[i] || 0)) return true;
    if ((r[i] || 0) < (l[i] || 0)) return false;
  }
  return false;
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(REMOTE_PKG_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const pkg = (await res.json()) as { version?: string };
    return pkg.version || null;
  } catch {
    return null;
  }
}

function printNotification(current: string, latest: string): void {
  const line1 = `Update available: ${chalk.dim(current)} → ${chalk.green.bold(latest)}`;
  const line2 = `Run: ${chalk.cyan('codeaudit update')}`;
  const maxLen = Math.max(stripAnsi(line1).length, stripAnsi(line2).length);
  const w = maxLen + 4;

  console.log(chalk.yellow(`  ┌${'─'.repeat(w)}┐`));
  console.log(
    chalk.yellow('  │') +
      '  ' +
      line1 +
      ' '.repeat(w - stripAnsi(line1).length - 2) +
      chalk.yellow('│'),
  );
  console.log(
    chalk.yellow('  │') +
      '  ' +
      line2 +
      ' '.repeat(w - stripAnsi(line2).length - 2) +
      chalk.yellow('│'),
  );
  console.log(chalk.yellow(`  └${'─'.repeat(w)}┘`));
  console.log();
}

/**
 * Non-blocking update check.
 *
 * - Shows a cached notification immediately if a newer version was
 *   detected on a previous run.
 * - If the cache is stale (>24h), fires a background fetch to
 *   refresh the cache for the *next* invocation.
 */
export function checkForUpdates(): void {
  const current = getCurrentVersion();
  if (!current) return; // dev mode, skip

  const cache = readCache();
  const now = Date.now();

  // Show notification from previously cached result
  if (cache?.latestVersion && isNewer(cache.latestVersion, current)) {
    printNotification(current, cache.latestVersion);
  }

  // If cache is stale, refresh in background (result shown next run)
  if (!cache || now - cache.lastCheck >= CHECK_INTERVAL_MS) {
    fetchLatestVersion()
      .then((latest) => {
        writeCache({
          lastCheck: now,
          latestVersion: latest || cache?.latestVersion || '',
        });
      })
      .catch(() => {});
  }
}
