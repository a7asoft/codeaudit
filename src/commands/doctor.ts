import chalk from 'chalk';
import { detectAgents } from '../agents/agent-detector.js';
import { AGENTS } from '../agents/registry.js';
import { which } from '../utils/platform.js';
import { logger } from '../utils/logger.js';

interface CheckResult {
  name: string;
  status: 'ok' | 'warn' | 'fail';
  detail: string;
}

export async function runDoctor(): Promise<void> {
  logger.info('Checking environment...');
  logger.blank();

  const checks: CheckResult[] = [];

  // Node.js
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1), 10);
  checks.push({
    name: 'Node.js',
    status: nodeMajor >= 18 ? 'ok' : 'warn',
    detail: nodeVersion,
  });

  // npm
  const npmPath = which('npm');
  checks.push({
    name: 'npm',
    status: npmPath ? 'ok' : 'warn',
    detail: npmPath || 'not found',
  });

  // Git
  const gitPath = which('git');
  checks.push({
    name: 'git',
    status: gitPath ? 'ok' : 'warn',
    detail: gitPath || 'not found',
  });

  // AI Agents
  const agents = detectAgents();

  for (const config of AGENTS) {
    const found = agents.find((a) => a.name === config.name);
    checks.push({
      name: `AI Agent: ${config.displayName}`,
      status: found ? 'ok' : 'fail',
      detail: found ? found.path : 'not found',
    });
  }

  // Has at least one AI agent
  const hasAnyAgent = agents.length > 0;
  checks.push({
    name: 'Any AI agent available',
    status: hasAnyAgent ? 'ok' : 'fail',
    detail: hasAnyAgent ? `${agents.length} agent(s) detected` : 'Install at least one supported AI CLI',
  });

  // Print results
  const icons = { ok: chalk.green('✔'), warn: chalk.yellow('⚠'), fail: chalk.red('✖') };

  for (const check of checks) {
    console.log(`  ${icons[check.status]} ${chalk.bold(check.name)}: ${chalk.dim(check.detail)}`);
  }

  logger.blank();

  const failures = checks.filter((c) => c.status === 'fail');
  if (failures.length === 0) {
    logger.success('All checks passed!');
  } else {
    logger.warn(`${failures.length} check(s) failed. Address these before running audits.`);
  }
}
