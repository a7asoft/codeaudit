import chalk from 'chalk';
import { isAgentAvailable, type AgentName } from '../agents/agent-detector.js';
import { ClaudeInstaller } from '../agents/claude-installer.js';
import { CursorInstaller } from '../agents/cursor-installer.js';
import { GeminiInstaller } from '../agents/gemini-installer.js';
import { logger } from '../utils/logger.js';

const INSTALLERS = {
  claude: new ClaudeInstaller(),
  cursor: new CursorInstaller(),
  gemini: new GeminiInstaller(),
} as const;

const VALID_AGENTS: AgentName[] = ['claude', 'cursor', 'gemini'];

export async function runInstall(agent: string): Promise<void> {
  if (!VALID_AGENTS.includes(agent as AgentName)) {
    logger.error(`Unknown agent "${agent}". Valid agents: ${VALID_AGENTS.join(', ')}`);
    return;
  }

  const agentName = agent as AgentName;

  if (!isAgentAvailable(agentName)) {
    logger.warn(`${chalk.bold(agentName)} CLI not found in PATH. Installing skills anyway...`);
  }

  const installer = INSTALLERS[agentName];
  const auditTypes = ['health', 'practices'];

  logger.info(`Installing audit skills for ${chalk.bold(agentName)}...`);
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
  logger.success(`Skills installed for ${chalk.bold(agentName)}!`);
}
