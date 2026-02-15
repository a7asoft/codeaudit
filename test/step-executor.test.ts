import { describe, it, expect } from 'vitest';
import { TokenTracker } from '../src/runner/token-tracker.js';

describe('TokenTracker', () => {
  it('should start with empty results', () => {
    const tracker = new TokenTracker();
    expect(tracker.getResults()).toEqual([]);
    expect(tracker.getTotalDurationMs()).toBe(0);
  });

  it('should accumulate token usage', () => {
    const tracker = new TokenTracker();

    tracker.addResult({
      stepIndex: 0,
      stepTitle: 'Step 1',
      tokens: { inputTokens: 100, outputTokens: 50, cacheReadTokens: 10, cacheWriteTokens: 5 },
      durationMs: 1000,
      success: true,
    });

    tracker.addResult({
      stepIndex: 1,
      stepTitle: 'Step 2',
      tokens: { inputTokens: 200, outputTokens: 100, cacheReadTokens: 20, cacheWriteTokens: 10 },
      durationMs: 2000,
      success: true,
    });

    const totals = tracker.getTotalTokens();
    expect(totals.inputTokens).toBe(300);
    expect(totals.outputTokens).toBe(150);
    expect(totals.cacheReadTokens).toBe(30);
    expect(totals.cacheWriteTokens).toBe(15);
    expect(tracker.getTotalDurationMs()).toBe(3000);
  });

  it('should count successes and failures', () => {
    const tracker = new TokenTracker();

    tracker.addResult({
      stepIndex: 0,
      stepTitle: 'Pass',
      tokens: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      durationMs: 100,
      success: true,
    });

    tracker.addResult({
      stepIndex: 1,
      stepTitle: 'Fail',
      tokens: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      durationMs: 100,
      success: false,
    });

    expect(tracker.getSuccessCount()).toBe(1);
    expect(tracker.getFailureCount()).toBe(1);
  });

  it('should estimate cost for sonnet model', () => {
    const tracker = new TokenTracker();

    tracker.addResult({
      stepIndex: 0,
      stepTitle: 'Step 1',
      tokens: { inputTokens: 1_000_000, outputTokens: 100_000, cacheReadTokens: 500_000, cacheWriteTokens: 0 },
      durationMs: 1000,
      success: true,
    });

    const cost = tracker.estimateCost('sonnet');
    // sonnet: input=$3/M, output=$15/M, cacheRead=$0.3/M
    // 1M * 3 + 0.1M * 15 + 0.5M * 0.3 = 3 + 1.5 + 0.15 = 4.65
    expect(cost).toBeCloseTo(4.65, 2);
  });

  it('should return results as a copy', () => {
    const tracker = new TokenTracker();
    tracker.addResult({
      stepIndex: 0,
      stepTitle: 'Step 1',
      tokens: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      durationMs: 100,
      success: true,
    });

    const results = tracker.getResults();
    results.push({
      stepIndex: 99,
      stepTitle: 'Fake',
      tokens: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      durationMs: 0,
      success: false,
    });

    expect(tracker.getResults()).toHaveLength(1);
  });
});
