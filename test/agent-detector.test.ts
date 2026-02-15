import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectAgents, isAgentAvailable } from '../src/agents/agent-detector.js';

// We test the actual detection — results depend on the environment
// but the function should never throw
describe('detectAgents', () => {
  it('should return an array', () => {
    const agents = detectAgents();
    expect(Array.isArray(agents)).toBe(true);
  });

  it('should return objects with correct shape', () => {
    const agents = detectAgents();
    for (const agent of agents) {
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('binary');
      expect(agent).toHaveProperty('path');
      expect(['claude', 'cursor', 'gemini']).toContain(agent.name);
    }
  });

  it('should not return duplicates for the same agent', () => {
    const agents = detectAgents();
    const names = agents.map((a) => a.name);
    const uniqueNames = [...new Set(names)];
    expect(names.length).toBe(uniqueNames.length);
  });
});

describe('isAgentAvailable', () => {
  it('should return a boolean for valid agent names', () => {
    expect(typeof isAgentAvailable('claude')).toBe('boolean');
    expect(typeof isAgentAvailable('cursor')).toBe('boolean');
    expect(typeof isAgentAvailable('gemini')).toBe('boolean');
  });
});
