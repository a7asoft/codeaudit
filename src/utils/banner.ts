import chalk from 'chalk';
import gradient from 'gradient-string';

const LOGO = [
  '  ▄▀▀ ▄▀▄ █▀▄ ██▀ ▄▀▄ █ █ █▀▄ █ ▀█▀',
  '  ▀▄▄ ▀▄▀ █▄▀ █▄▄ █▀█ ▀▄█ █▄▀ █  █ ',
];

const brand = gradient(['#6C63FF', '#3B82F6', '#06B6D4']);

export function printBanner(): void {
  console.log();
  console.log(brand.multiline(LOGO.join('\n')));
  console.log(chalk.dim('  AI-Powered Project Audit  v0.1.0'));
  console.log();
}
