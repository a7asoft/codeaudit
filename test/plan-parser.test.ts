import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parsePlan } from '../src/runner/plan-parser.js';

describe('parsePlan', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `codeaudit-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should parse a valid plan.md with numbered steps', () => {
    const planContent = `
# Health Audit Plan

## Execution Order

1. \`00-stack-detector.md\` — Stack Detection
2. \`01-repository-inventory.md\` — Repository Inventory
3. \`02-config-analysis.md\` — Configuration Analysis
`;
    const planPath = join(tempDir, 'plan.md');
    writeFileSync(planPath, planContent);

    const steps = parsePlan(planPath);

    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({
      index: 0,
      filename: '00-stack-detector.md',
      filepath: join(tempDir, '00-stack-detector.md'),
      title: 'Stack Detection',
    });
    expect(steps[1]).toEqual({
      index: 1,
      filename: '01-repository-inventory.md',
      filepath: join(tempDir, '01-repository-inventory.md'),
      title: 'Repository Inventory',
    });
    expect(steps[2]).toEqual({
      index: 2,
      filename: '02-config-analysis.md',
      filepath: join(tempDir, '02-config-analysis.md'),
      title: 'Configuration Analysis',
    });
  });

  it('should handle plans with many steps', () => {
    const planContent = `
## Execution Order

1. \`00-first.md\` — First Step
2. \`01-second.md\` — Second Step
3. \`02-third.md\` — Third Step
4. \`03-fourth.md\` — Fourth Step
5. \`04-fifth.md\` — Fifth Step
`;
    const planPath = join(tempDir, 'plan.md');
    writeFileSync(planPath, planContent);

    const steps = parsePlan(planPath);
    expect(steps).toHaveLength(5);
    expect(steps[4].title).toBe('Fifth Step');
  });

  it('should derive title from filename when no title provided', () => {
    const planContent = `
## Execution Order

1. \`00-stack-detector.md\`
`;
    const planPath = join(tempDir, 'plan.md');
    writeFileSync(planPath, planContent);

    const steps = parsePlan(planPath);
    expect(steps).toHaveLength(1);
    expect(steps[0].title).toBe('stack detector');
  });

  it('should throw when no steps found', () => {
    const planContent = `
# Empty Plan

No steps here.
`;
    const planPath = join(tempDir, 'plan.md');
    writeFileSync(planPath, planContent);

    expect(() => parsePlan(planPath)).toThrow('No steps found');
  });

  it('should handle different dash styles in title separator', () => {
    const planContent = `
## Execution Order

1. \`00-first.md\` - First Step
2. \`01-second.md\` – Second Step
3. \`02-third.md\` — Third Step
`;
    const planPath = join(tempDir, 'plan.md');
    writeFileSync(planPath, planContent);

    const steps = parsePlan(planPath);
    expect(steps).toHaveLength(3);
    expect(steps[0].title).toBe('First Step');
    expect(steps[1].title).toBe('Second Step');
    expect(steps[2].title).toBe('Third Step');
  });
});
