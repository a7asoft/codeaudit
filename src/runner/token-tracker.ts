export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

export interface StepResult {
  stepIndex: number;
  stepTitle: string;
  tokens: TokenUsage;
  durationMs: number;
  success: boolean;
}

export class TokenTracker {
  private results: StepResult[] = [];

  addResult(result: StepResult): void {
    this.results.push(result);
  }

  getResults(): StepResult[] {
    return [...this.results];
  }

  getTotalTokens(): TokenUsage {
    return this.results.reduce(
      (acc, r) => ({
        inputTokens: acc.inputTokens + r.tokens.inputTokens,
        outputTokens: acc.outputTokens + r.tokens.outputTokens,
        cacheReadTokens: acc.cacheReadTokens + r.tokens.cacheReadTokens,
        cacheWriteTokens: acc.cacheWriteTokens + r.tokens.cacheWriteTokens,
      }),
      { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
    );
  }

  getTotalDurationMs(): number {
    return this.results.reduce((acc, r) => acc + r.durationMs, 0);
  }

  estimateCost(model: string): number {
    const totals = this.getTotalTokens();
    // Approximate pricing per 1M tokens (USD)
    const pricing: Record<string, { input: number; output: number; cacheRead: number }> = {
      sonnet: { input: 3, output: 15, cacheRead: 0.3 },
      opus: { input: 15, output: 75, cacheRead: 1.5 },
      haiku: { input: 0.25, output: 1.25, cacheRead: 0.03 },
      'gemini-2.5-pro': { input: 1.25, output: 10, cacheRead: 0.3 },
      'gemini-2.5-flash': { input: 0.15, output: 0.6, cacheRead: 0.04 },
    };

    const rates = pricing[model] || pricing['sonnet'];
    return (
      (totals.inputTokens * rates.input +
        totals.outputTokens * rates.output +
        totals.cacheReadTokens * rates.cacheRead) /
      1_000_000
    );
  }

  getSuccessCount(): number {
    return this.results.filter((r) => r.success).length;
  }

  getFailureCount(): number {
    return this.results.filter((r) => !r.success).length;
  }
}
