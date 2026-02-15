import { Command } from 'commander';
import { printBanner } from './utils/banner.js';
import { runAudit } from './commands/run.js';
import { runDoctor } from './commands/doctor.js';
import { listAudits } from './commands/list.js';
import { runInit } from './commands/init.js';
import { runInstall } from './commands/install.js';

const program = new Command();

program
  .name('codeaudit')
  .description('Universal AI-Powered Project Audit CLI')
  .version('0.1.0')
  .hook('preAction', () => {
    printBanner();
  });

program
  .command('run <type>')
  .description('Run an audit (health, practices)')
  .option('-a, --agent <agent>', 'AI agent to use (claude, cursor, gemini)')
  .option('-m, --model <model>', 'Model to use')
  .action(async (type: string, opts) => {
    await runAudit(type, opts);
  });

program
  .command('doctor')
  .description('Check environment and AI tool availability')
  .action(async () => {
    await runDoctor();
  });

program
  .command('list')
  .description('List available audit types')
  .action(async () => {
    await listAudits();
  });

program
  .command('init')
  .description('Detect AI tools and install audit skills')
  .action(async () => {
    await runInit();
  });

program
  .command('install <agent>')
  .description('Install audit skills to a specific AI agent (claude, cursor, gemini)')
  .action(async (agent: string) => {
    await runInstall(agent);
  });

program.parse();
