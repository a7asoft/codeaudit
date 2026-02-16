import { Command } from 'commander';
import chalk from 'chalk';
import { printBanner } from './utils/banner.js';
import { checkForUpdates } from './utils/update-notifier.js';
import { getAgentNames } from './agents/registry.js';
import { runAudit } from './commands/run.js';
import { runDoctor } from './commands/doctor.js';
import { listAudits } from './commands/list.js';
import { runInit } from './commands/init.js';
import { runInstall } from './commands/install.js';
import { runUpdate } from './commands/update.js';
import { runUninstall } from './commands/uninstall.js';

const program = new Command();
const agentList = getAgentNames().join(', ');

program
  .name('codeaudit')
  .description('Universal AI-Powered Project Audit CLI')
  .version('0.3.0')
  .hook('preAction', (thisCommand, actionCommand) => {
    // Skip banner for the default action (no subcommand) — it prints its own
    if (actionCommand !== program) {
      printBanner();
      checkForUpdates();
    }
  })
  .configureHelp({ showGlobalOptions: false })
  .addHelpCommand(false);

program
  .command('run <type>')
  .description('Run an audit (health, practices)')
  .option('-a, --agent <agent>', `AI agent to use (${agentList})`)
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
  .description(`Install audit skills to a specific AI agent (${agentList})`)
  .action(async (agent: string) => {
    await runInstall(agent);
  });

program
  .command('update')
  .description('Update codeaudit to the latest version')
  .action(async () => {
    await runUpdate();
  });

program
  .command('uninstall')
  .description('Remove codeaudit from your system')
  .action(async () => {
    await runUninstall();
  });

// Custom default: show banner + styled commands when no args
program.action(() => {
  printBanner();

  const dim = chalk.dim;
  const cyan = chalk.cyan;
  const white = chalk.white;
  const green = chalk.green;
  const yellow = chalk.yellow;

  console.log(white('  Usage:'), dim('codeaudit'), cyan('<command>'), dim('[options]'));
  console.log();
  console.log(white('  Commands:'));
  console.log();
  console.log(`    ${green('run')} ${cyan('<type>')}        Run an audit ${dim('(health, practices)')}`);
  console.log(`    ${green('doctor')}              Check environment and AI tools`);
  console.log(`    ${green('list')}                List available audit types`);
  console.log(`    ${green('init')}                Detect AI tools and install skills`);
  console.log(`    ${green('install')} ${cyan('<agent>')}   Install skills to an agent`);
  console.log(`    ${green('update')}              Update to the latest version`);
  console.log(`    ${green('uninstall')}           Remove codeaudit from your system`);
  console.log();
  console.log(white('  Options:'));
  console.log();
  console.log(`    ${yellow('-a, --agent')} ${cyan('<agent>')}  AI agent to use`);
  console.log(`    ${yellow('-m, --model')} ${cyan('<model>')}  Model to use`);
  console.log(`    ${yellow('-V, --version')}         Show version number`);
  console.log(`    ${yellow('-h, --help')}            Show help for a command`);
  console.log();
  console.log(dim('  Supported agents:'), dim(agentList));
  console.log();
  console.log(dim('  Examples:'));
  console.log();
  console.log(dim('    $ codeaudit run health'));
  console.log(dim('    $ codeaudit run practices --agent claude --model sonnet'));
  console.log(dim('    $ codeaudit run health --agent codex --model o3'));
  console.log(dim('    $ codeaudit doctor'));
  console.log();
});

program.parse();
