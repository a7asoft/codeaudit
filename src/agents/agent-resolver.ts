import inquirer from 'inquirer';
import { detectAgents, type AgentName, type DetectedAgent } from './agent-detector.js';
import { logger } from '../utils/logger.js';

export interface ResolvedAgent {
  name: AgentName;
  binary: string;
  model: string;
}

const DEFAULT_MODELS: Record<AgentName, string[]> = {
  claude: ['sonnet', 'opus', 'haiku'],
  cursor: ['sonnet', 'gpt-4o', 'gemini-pro'],
  gemini: ['gemini-2.5-pro', 'gemini-2.5-flash'],
};

export async function resolveAgent(options: {
  agent?: string;
  model?: string;
}): Promise<ResolvedAgent> {
  const detected = detectAgents();

  if (detected.length === 0) {
    logger.error('No AI agents detected. Run "codeaudit doctor" for details.');
    process.exit(1);
  }

  let selectedAgent: DetectedAgent;

  if (options.agent) {
    const match = detected.find((a) => a.name === options.agent);
    if (!match) {
      logger.error(`Agent "${options.agent}" not found. Available: ${detected.map((a) => a.name).join(', ')}`);
      process.exit(1);
    }
    selectedAgent = match;
  } else if (detected.length === 1) {
    selectedAgent = detected[0];
  } else {
    const { agentChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'agentChoice',
        message: 'Select AI agent:',
        choices: detected.map((a) => ({ name: `${a.name} (${a.path})`, value: a.name })),
      },
    ]);
    selectedAgent = detected.find((a) => a.name === agentChoice)!;
  }

  let model: string;

  if (options.model) {
    model = options.model;
  } else {
    const models = DEFAULT_MODELS[selectedAgent.name];
    const { modelChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'modelChoice',
        message: 'Select model:',
        choices: models,
      },
    ]);
    model = modelChoice;
  }

  return {
    name: selectedAgent.name,
    binary: selectedAgent.binary,
    model,
  };
}
