import inquirer from 'inquirer';
import { detectAgents, type DetectedAgent } from './agent-detector.js';
import { type AgentConfig } from './registry.js';
import { logger } from '../utils/logger.js';

export interface ResolvedAgent {
  name: string;
  binary: string;
  model: string;
  config: AgentConfig;
}

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
        choices: detected.map((a) => ({ name: `${a.config.displayName} (${a.path})`, value: a.name })),
      },
    ]);
    selectedAgent = detected.find((a) => a.name === agentChoice)!;
  }

  let model: string;

  if (options.model) {
    model = options.model;
  } else {
    const models = selectedAgent.config.models;
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
    config: selectedAgent.config,
  };
}
