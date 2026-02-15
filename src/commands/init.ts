import chalk from 'chalk';
import { detectAgents } from '../agents/agent-detector.js';
import { ClaudeInstaller } from '../agents/claude-installer.js';
import { CursorInstaller } from '../agents/cursor-installer.js';
import { GeminiInstaller } from '../agents/gemini-installer.js';
import { logger } from '../utils/logger.js';

const INSTALLERS = {
  claude: new ClaudeInstaller(),
  cursor: new CursorInstaller(),
  gemini: new GeminiInstaller(),
} as const;

export async function runInit(): Promise<void> {
  logger.info('Detecting AI tools...');
  logger.blank();

  const agents = detectAgents();

  if (agents.length === 0) {
    logger.error('No AI agents detected. Install at least one: claude, cursor, or gemini.');
    return;
  }

  for (const agent of agents) {
    logger.success(`Found ${chalk.bold(agent.name)} at ${chalk.dim(agent.path)}`);
  }

  logger.blank();
  logger.info('Installing audit skills...');
  logger.blank();

  const auditTypes = ['health', 'practices'];

  for (const agent of agents) {
    const installer = INSTALLERS[agent.name];

    for (const auditType of auditTypes) {
      try {
        const result = await installer.install(auditType);
        if (result.success) {
          logger.success(`${chalk.bold(agent.name)}/${auditType}: ${chalk.dim(result.installedPath)}`);
        } else {
          logger.warn(`${agent.name}/${auditType}: ${result.message}`);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`${agent.name}/${auditType}: ${message}`);
      }
    }
  }

  logger.blank();
  logger.success('Initialization complete!');
}
