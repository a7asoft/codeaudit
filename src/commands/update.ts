import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { getHomeDir } from '../utils/platform.js';
import { logger } from '../utils/logger.js';

export async function runUpdate(): Promise<void> {
  const installDir = join(getHomeDir(), '.codeaudit');

  if (!existsSync(join(installDir, '.git'))) {
    logger.error('Installation not found at ~/.codeaudit');
    logger.dim('If running from source, update manually: git pull && npm install && npm run build');
    return;
  }

  const oldVersion = readVersion(installDir);

  logger.info('Updating codeaudit...');
  logger.blank();

  // Git pull
  let spinner = ora('Pulling latest changes...').start();
  try {
    const result = await execa('git', ['pull', 'origin', 'main'], { cwd: installDir });
    if (result.stdout.includes('Already up to date')) {
      spinner.succeed('Already on the latest version');
      logger.blank();
      logger.success(`codeaudit v${oldVersion} — no updates available`);
      return;
    }
    spinner.succeed('Changes pulled');
  } catch (err: unknown) {
    spinner.fail('Failed to pull changes');
    logger.dim(err instanceof Error ? err.message : 'Unknown error');
    return;
  }

  // npm install
  spinner = ora('Installing dependencies...').start();
  try {
    await execa('npm', ['install', '--silent', '--no-fund', '--no-audit'], { cwd: installDir });
    spinner.succeed('Dependencies installed');
  } catch (err: unknown) {
    spinner.fail('Failed to install dependencies');
    logger.dim(err instanceof Error ? err.message : 'Unknown error');
    return;
  }

  // Build
  spinner = ora('Building...').start();
  try {
    await execa('npm', ['run', 'build', '--silent'], { cwd: installDir });
    spinner.succeed('Build complete');
  } catch (err: unknown) {
    spinner.fail('Failed to build');
    logger.dim(err instanceof Error ? err.message : 'Unknown error');
    return;
  }

  logger.blank();
  const newVersion = readVersion(installDir);
  if (oldVersion !== newVersion) {
    logger.success(`Updated: ${chalk.dim(oldVersion)} → ${chalk.green.bold(newVersion)}`);
  } else {
    logger.success(`Rebuilt v${newVersion}`);
  }
}

function readVersion(installDir: string): string {
  try {
    const pkg = JSON.parse(readFileSync(join(installDir, 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}
