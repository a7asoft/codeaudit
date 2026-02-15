import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface PlanStep {
  index: number;
  filename: string;
  filepath: string;
  title: string;
}

/**
 * Parse a plan.md file to extract the ordered list of rule steps.
 *
 * Expected format in plan.md:
 * ```
 * ## Execution Order
 *
 * 1. `00-stack-detector.md` — Stack Detection
 * 2. `01-repository-inventory.md` — Repository Inventory
 * ...
 * ```
 */
export function parsePlan(planPath: string): PlanStep[] {
  const content = readFileSync(planPath, 'utf-8');
  const rulesDir = dirname(planPath);
  const steps: PlanStep[] = [];

  const stepRegex = /^\d+\.\s+`([^`]+\.md)`\s*(?:[—–-]\s*(.+))?$/gm;
  let match: RegExpExecArray | null;

  while ((match = stepRegex.exec(content)) !== null) {
    const filename = match[1];
    const title = match[2]?.trim() || filename.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ');

    steps.push({
      index: steps.length,
      filename,
      filepath: join(rulesDir, filename),
      title,
    });
  }

  if (steps.length === 0) {
    throw new Error(`No steps found in plan: ${planPath}. Expected format: "1. \`filename.md\` — Title"`);
  }

  return steps;
}
