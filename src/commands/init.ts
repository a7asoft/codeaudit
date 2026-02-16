import chalk from 'chalk';
import { detectAgents } from '../agents/agent-detector.js';
import { logger } from '../utils/logger.js';

export async function runInit(): Promise<void> {
  logger.info('Detecting AI tools...');
  logger.blank();

  const agents = detectAgents();

  if (agents.length === 0) {
    logger.error('No AI agents detected. Install at least one supported AI CLI.');
    return;
  }

  for (const agent of agents) {
    logger.success(`Found ${chalk.bold(agent.config.displayName)} at ${chalk.dim(agent.path)}`);
  }

  logger.blank();
  logger.info('Installing audit skills...');
  logger.blank();

  const auditTypes = ['health', 'practices'];

  for (const agent of agents) {
    if (!agent.config.installer) {
      logger.warn(`${chalk.bold(agent.config.displayName)}: no installer available, skipping`);
      continue;
    }

    const installer = agent.config.installer();

    for (const auditType of auditTypes) {
      try {
        const result = await installer.install(auditType);
        if (result.success) {
          logger.success(`${chalk.bold(agent.config.displayName)}/${auditType}: ${chalk.dim(result.installedPath)}`);
        } else {
          logger.warn(`${agent.config.displayName}/${auditType}: ${result.message}`);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`${agent.config.displayName}/${auditType}: ${message}`);
      }
    }
  }

  logger.blank();
  logger.success('Initialization complete!');
}
