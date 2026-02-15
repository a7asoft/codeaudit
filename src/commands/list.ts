import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';
import { parsePlan } from '../runner/plan-parser.js';

function getRulesDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  let dir = resolve(thisFile, '..', '..', '..', 'rules');
  if (!existsSync(dir)) {
    dir = resolve(thisFile, '..', '..', 'rules');
  }
  return dir;
}

export async function listAudits(): Promise<void> {
  const rulesDir = getRulesDir();

  if (!existsSync(rulesDir)) {
    logger.error('Rules directory not found.');
    return;
  }

  const entries = readdirSync(rulesDir, { withFileTypes: true });
  const audits = entries.filter((e) => e.isDirectory());

  if (audits.length === 0) {
    logger.warn('No audit types found.');
    return;
  }

  logger.info('Available audit types:');
  logger.blank();

  for (const audit of audits) {
    const planPath = join(rulesDir, audit.name, 'plan.md');
    if (!existsSync(planPath)) continue;

    try {
      const steps = parsePlan(planPath);
      console.log(`  ${chalk.bold.cyan(audit.name)} ${chalk.dim(`(${steps.length} steps)`)}`);
      for (const step of steps) {
        console.log(`    ${chalk.dim(`${step.index + 1}.`)} ${step.title}`);
      }
      logger.blank();
    } catch {
      console.log(`  ${chalk.bold.cyan(audit.name)} ${chalk.dim('(plan parse error)')}`);
    }
  }

  logger.dim('Run: codeaudit run <type>');
}
