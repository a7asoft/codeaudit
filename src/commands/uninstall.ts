import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import ora from 'ora';
import { getHomeDir } from '../utils/platform.js';
import { logger } from '../utils/logger.js';

export async function runUninstall(): Promise<void> {
  const home = getHomeDir();
  const installDir = join(home, '.codeaudit');
  const binPath = join(home, '.local', 'bin', 'codeaudit');

  logger.info('Uninstalling codeaudit...');
  logger.blank();

  // Remove installation directory
  const spinner = ora('Removing files...').start();
  let removed = false;

  if (existsSync(installDir)) {
    rmSync(installDir, { recursive: true, force: true });
    removed = true;
  }

  if (existsSync(binPath)) {
    rmSync(binPath, { force: true });
    removed = true;
  }

  if (removed) {
    spinner.succeed('Files removed');
  } else {
    spinner.info('No installation found');
  }

  // Clean PATH entry from shell config
  const cleaned = cleanShellConfig(home);
  if (cleaned) {
    logger.dim(`  Cleaned PATH entry from ${cleaned}`);
  }

  logger.blank();
  if (removed) {
    logger.success('codeaudit has been uninstalled');
  } else {
    logger.warn('Nothing to uninstall');
  }
}

function cleanShellConfig(home: string): string | null {
  const shellName = basename(process.env.SHELL || 'bash');
  let configFile: string;

  switch (shellName) {
    case 'zsh':
      configFile = join(home, '.zshrc');
      break;
    case 'fish':
      configFile = join(home, '.config', 'fish', 'config.fish');
      break;
    default:
      configFile = existsSync(join(home, '.bash_profile'))
        ? join(home, '.bash_profile')
        : join(home, '.bashrc');
  }

  if (!existsSync(configFile)) return null;

  try {
    const content = readFileSync(configFile, 'utf-8');
    // Remove the codeaudit PATH block (comment + export line + blank line before)
    const cleaned = content.replace(/\n?# codeaudit\n.*\.local\/bin.*\n?/g, '');
    if (cleaned !== content) {
      writeFileSync(configFile, cleaned);
      return configFile;
    }
  } catch {}

  return null;
}
