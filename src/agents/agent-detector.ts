import { which } from '../utils/platform.js';

export type AgentName = 'claude' | 'cursor' | 'gemini';

export interface DetectedAgent {
  name: AgentName;
  binary: string;
  path: string;
}

const AGENT_BINARIES: Record<AgentName, string[]> = {
  claude: ['claude'],
  cursor: ['cursor-agent', 'cursor'],
  gemini: ['gemini'],
};

export function detectAgents(): DetectedAgent[] {
  const detected: DetectedAgent[] = [];

  for (const [name, binaries] of Object.entries(AGENT_BINARIES)) {
    for (const binary of binaries) {
      const path = which(binary);
      if (path) {
        detected.push({ name: name as AgentName, binary, path });
        break;
      }
    }
  }

  return detected;
}

export function isAgentAvailable(name: AgentName): boolean {
  const binaries = AGENT_BINARIES[name];
  return binaries.some((b) => which(b) !== null);
}
