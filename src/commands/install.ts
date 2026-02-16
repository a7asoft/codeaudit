import chalk from 'chalk';
import { isAgentAvailable } from '../agents/agent-detector.js';
import { getAgent, getAgentNames } from '../agents/registry.js';
import { logger } from '../utils/logger.js';

export async function runInstall(agent: string): Promise<void> {
  const config = getAgent(agent);
  if (!config) {
    logger.error(`Unknown agent "${agent}". Valid agents: ${getAgentNames().join(', ')}`);
    return;
  }

  if (!config.installer) {
    logger.warn(`No installer available for ${chalk.bold(config.displayName)}. It can still be used as an audit engine.`);
    return;
  }

  if (!isAgentAvailable(agent)) {
    logger.warn(`${chalk.bold(config.displayName)} CLI not found in PATH. Installing skills anyway...`);
  }

  const installer = config.installer();
  const auditTypes = ['health', 'practices'];

  logger.info(`Installing audit skills for ${chalk.bold(config.displayName)}...`);
  logger.blank();

  for (const auditType of auditTypes) {
    try {
      const result = await installer.install(auditType);
      if (result.success) {
        logger.success(`${auditType}: ${chalk.dim(result.installedPath)}`);
      } else {
        logger.warn(`${auditType}: ${result.message}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`${auditType}: ${message}`);
    }
  }

  logger.blank();
  logger.success(`Skills installed for ${chalk.bold(config.displayName)}!`);
}
