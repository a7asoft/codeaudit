import { which } from '../utils/platform.js';
import { AGENTS, type AgentConfig } from './registry.js';

export interface DetectedAgent {
  name: string;
  binary: string;
  path: string;
  config: AgentConfig;
}

export function detectAgents(): DetectedAgent[] {
  const detected: DetectedAgent[] = [];

  for (const config of AGENTS) {
    for (const binary of config.binaries) {
      const path = which(binary);
      if (path) {
        detected.push({ name: config.name, binary, path, config });
        break;
      }
    }
  }

  return detected;
}

export function isAgentAvailable(name: string): boolean {
  const config = AGENTS.find((a) => a.name === name);
  if (!config) return false;
  return config.binaries.some((b) => which(b) !== null);
}
