import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { resolveAgent } from '../agents/agent-resolver.js';
import { parsePlan } from '../runner/plan-parser.js';
import { executeStep, findStepScore, scoreToStatus } from '../runner/step-executor.js';
import { TokenTracker } from '../runner/token-tracker.js';
import { ProgressPanel, printSummaryCard } from '../utils/progress-panel.js';
import { logger } from '../utils/logger.js';

function getRulesDir(): string {
  const thisFile = fileURLToPath(import.meta.url);
  let dir = resolve(thisFile, '..', '..', '..', 'rules');
  if (!existsSync(dir)) {
    dir = resolve(thisFile, '..', '..', 'rules');
  }
  return dir;
}

export async function runAudit(
  auditType: string,
  options: { agent?: string; model?: string },
): Promise<void> {
  const rulesDir = getRulesDir();
  const auditDir = join(rulesDir, auditType);
  const planPath = join(auditDir, 'plan.md');

  if (!existsSync(planPath)) {
    logger.error(`Audit type "${auditType}" not found. Run "codeaudit list" to see available audits.`);
    process.exit(1);
  }

  const cwd = process.cwd();
  const steps = parsePlan(planPath);

  // Resolve agent interactively (before panel starts)
  const agent = await resolveAgent(options);

  logger.info(`Running ${chalk.bold(auditType)} audit on ${chalk.dim(cwd)}`);
  logger.info(`Using ${chalk.bold(agent.name)} with model ${chalk.bold(agent.model)}`);
  logger.blank();

  // Create panel and tracker
  const panel = new ProgressPanel(auditType, steps.map((s) => s.title));
  const tracker = new TokenTracker();

  panel.start();

  try {
    for (const step of steps) {
      panel.setRunning(step.index);

      const result = await executeStep({
        agent,
        step,
        totalSteps: steps.length,
        cwd,
        auditType,
      });

      // Parse score from artifact
      const score = findStepScore(cwd, step.index);
      const status = scoreToStatus(score, result.success);

      panel.complete(step.index, status, result.durationMs, score ?? undefined);

      // Update tracker and panel stats
      tracker.addResult(result);
      const totals = tracker.getTotalTokens();
      panel.setStats(
        totals.inputTokens + totals.outputTokens + totals.cacheReadTokens,
        tracker.estimateCost(agent.model),
      );
    }
  } finally {
    panel.stop();
  }

  // Print summary card
  const reportPath = join('reports', `${auditType}_audit.txt`);
  const fullReportPath = join(cwd, reportPath);
  const totals = tracker.getTotalTokens();

  printSummaryCard({
    success: tracker.getFailureCount() === 0,
    passed: tracker.getSuccessCount(),
    failed: tracker.getFailureCount(),
    duration: tracker.getTotalDurationMs(),
    tokens: totals.inputTokens + totals.outputTokens,
    cost: tracker.estimateCost(agent.model),
    reportPath,
    reportExists: existsSync(fullReportPath),
  });
}
