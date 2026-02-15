import chalk from 'chalk';
import logUpdate from 'log-update';

export type StepStatus = 'pending' | 'running' | 'strong' | 'fair' | 'weak' | 'info' | 'error';

interface StepState {
  title: string;
  status: StepStatus;
  durationMs: number;
  score?: number;
  startedAt?: number;
}

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const CONTENT_WIDTH = 56;
const INDENT = '  ';

function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return `${mins}m ${String(rem).padStart(2, '0')}s`;
}

function formatTokens(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return String(count);
}

function padLine(content: string): string {
  const vis = stripAnsi(content).length;
  const pad = Math.max(0, CONTENT_WIDTH - vis);
  return `${chalk.dim(INDENT + '│')}  ${content}${' '.repeat(pad)}  ${chalk.dim('│')}`;
}

function borderTop(): string {
  return chalk.dim(`${INDENT}┌${'─'.repeat(CONTENT_WIDTH + 4)}┐`);
}

function borderSep(): string {
  return chalk.dim(`${INDENT}├${'─'.repeat(CONTENT_WIDTH + 4)}┤`);
}

function borderBot(): string {
  return chalk.dim(`${INDENT}└${'─'.repeat(CONTENT_WIDTH + 4)}┘`);
}

function emptyLine(): string {
  return padLine('');
}

function fillDots(prefix: string, suffix: string): string {
  const pLen = stripAnsi(prefix).length;
  const sLen = stripAnsi(suffix).length;
  const dotsLen = CONTENT_WIDTH - pLen - sLen;
  if (dotsLen > 2) {
    return prefix + chalk.dim(' ' + '·'.repeat(dotsLen - 2) + ' ') + suffix;
  }
  return prefix + ' ' + suffix;
}

export class ProgressPanel {
  private steps: StepState[];
  private auditType: string;
  private startTime = 0;
  private totalTokens = 0;
  private totalCost = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private spinnerIdx = 0;

  constructor(auditType: string, stepTitles: string[]) {
    this.auditType = auditType;
    this.steps = stepTitles.map((title) => ({
      title,
      status: 'pending' as StepStatus,
      durationMs: 0,
    }));
  }

  start(): void {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.spinnerIdx = (this.spinnerIdx + 1) % SPINNER.length;
      this.draw();
    }, 80);
    this.draw();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.draw();
    logUpdate.done();
  }

  setRunning(index: number): void {
    this.steps[index].status = 'running';
    this.steps[index].startedAt = Date.now();
  }

  complete(index: number, status: StepStatus, durationMs: number, score?: number): void {
    this.steps[index].status = status;
    this.steps[index].durationMs = durationMs;
    if (score !== undefined) this.steps[index].score = score;
  }

  setStats(tokens: number, cost: number): void {
    this.totalTokens = tokens;
    this.totalCost = cost;
  }

  private completedCount(): number {
    return this.steps.filter((s) => !['pending', 'running'].includes(s.status)).length;
  }

  private draw(): void {
    const lines: string[] = [];
    lines.push(borderTop());
    lines.push(emptyLine());
    lines.push(padLine(this.renderHeader()));
    lines.push(emptyLine());
    lines.push(borderSep());
    lines.push(emptyLine());

    for (let i = 0; i < this.steps.length; i++) {
      lines.push(padLine(this.renderStep(i)));
    }

    lines.push(emptyLine());
    lines.push(borderSep());
    lines.push(padLine(this.renderFooter()));
    lines.push(borderBot());

    logUpdate(lines.join('\n'));
  }

  private renderHeader(): string {
    const done = this.completedCount();
    const total = this.steps.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const label = chalk.bold(capitalize(this.auditType) + ' Audit');
    const labelLen = stripAnsi(label).length;

    const barWidth = 20;
    const filled = Math.round((done / total) * barWidth);
    const bar =
      chalk.hex('#6C63FF')('█'.repeat(filled)) +
      chalk.dim('░'.repeat(barWidth - filled));

    const right = `${done}/${total}  ${chalk.bold(`${pct}%`)}`;
    const rightLen = stripAnsi(right).length;

    const gap = CONTENT_WIDTH - labelLen - barWidth - rightLen - 4;
    return `${label}${' '.repeat(Math.max(2, gap))}${bar}  ${right}`;
  }

  private renderStep(index: number): string {
    const step = this.steps[index];

    if (step.status === 'pending') {
      return chalk.dim(`○ ${step.title}`);
    }

    if (step.status === 'running') {
      const elapsed = formatDuration(Date.now() - (step.startedAt || Date.now()));
      const spinner = chalk.cyan(SPINNER[this.spinnerIdx]);
      return fillDots(
        `${spinner} ${chalk.cyan(step.title)} `,
        chalk.cyan(elapsed),
      );
    }

    // Completed step
    const icon = getIcon(step.status);
    const color = getColor(step.status);
    const timeStr = chalk.dim(formatDuration(step.durationMs));

    let suffix: string;
    if (step.score !== undefined) {
      suffix = `${color(String(step.score))}  ${timeStr}`;
    } else {
      suffix = timeStr;
    }

    return fillDots(`${icon} ${color(step.title)} `, suffix);
  }

  private renderFooter(): string {
    const elapsed = formatDuration(Date.now() - this.startTime);
    const tokens = formatTokens(this.totalTokens);
    const cost = `$${this.totalCost.toFixed(2)}`;

    return [
      `${chalk.dim('Time')} ${elapsed}`,
      `${chalk.dim('Tokens')} ${tokens}`,
      `${chalk.dim('Cost')} ~${cost}`,
    ].join(`  ${chalk.dim('│')}  `);
  }
}

// ─── Icons & Colors ─────────────────────────────────

function getIcon(status: StepStatus): string {
  switch (status) {
    case 'strong': return chalk.green('✔');
    case 'fair':   return chalk.yellow('▲');
    case 'weak':   return chalk.red('✖');
    case 'info':   return chalk.cyan('●');
    case 'error':  return chalk.red('✖');
    default:       return chalk.dim('○');
  }
}

function getColor(status: StepStatus): (s: string) => string {
  switch (status) {
    case 'strong': return chalk.green;
    case 'fair':   return chalk.yellow;
    case 'weak':   return chalk.red;
    case 'error':  return chalk.red;
    case 'running': return chalk.cyan;
    case 'info':   return (s: string) => s;
    default:       return chalk.dim;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Summary Card ───────────────────────────────────

export function printSummaryCard(opts: {
  success: boolean;
  passed: number;
  failed: number;
  duration: number;
  tokens: number;
  cost: number;
  reportPath: string;
  reportExists: boolean;
}): void {
  const { success, passed, failed, duration, tokens, cost, reportPath, reportExists } = opts;
  const total = passed + failed;

  const icon = success ? chalk.green.bold('✔') : chalk.yellow.bold('⚠');
  const title = success
    ? chalk.green.bold('AUDIT COMPLETE')
    : chalk.yellow.bold('AUDIT FINISHED');

  const titleContent = `${icon}  ${title}`;
  const titleVisLen = stripAnsi(titleContent).length;
  const titlePad = Math.max(0, Math.floor((CONTENT_WIDTH - titleVisLen) / 2));

  const stepsStr =
    failed > 0
      ? `${passed}/${total} passed  ${chalk.red(`${failed} failed`)}`
      : chalk.green(`${passed}/${total} passed`);

  const lines: string[] = [
    '',
    borderTop(),
    emptyLine(),
    padLine(' '.repeat(titlePad) + titleContent),
    emptyLine(),
    borderSep(),
    emptyLine(),
    padLine(`${chalk.dim('Steps')}      ${stepsStr}`),
    padLine(`${chalk.dim('Duration')}   ${formatDuration(duration)}`),
    padLine(`${chalk.dim('Tokens')}     ${tokens.toLocaleString()}`),
    padLine(`${chalk.dim('Cost')}       ~$${cost.toFixed(2)}`),
    emptyLine(),
  ];

  if (reportExists) {
    lines.push(padLine(`${chalk.dim('Report')} ${chalk.dim('→')}  ${chalk.underline(reportPath)}`));
    lines.push(emptyLine());
  }

  lines.push(borderBot());
  lines.push('');

  console.log(lines.join('\n'));
}
