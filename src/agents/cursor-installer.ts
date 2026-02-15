import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCursorCommandsDir } from '../utils/platform.js';
import { BaseInstaller, type InstallerResult } from './base-installer.js';
import type { AgentName } from './agent-detector.js';

export class CursorInstaller extends BaseInstaller {
  readonly agentName: AgentName = 'cursor';

  async install(auditType: string): Promise<InstallerResult> {
    const commandsDir = getCursorCommandsDir();
    mkdirSync(commandsDir, { recursive: true });

    const auditDir = this.getAuditDir(auditType);

    // Read plan.md
    const planContent = readFileSync(join(auditDir, 'plan.md'), 'utf-8');

    // Read all rule files and concatenate into single file
    const ruleFiles = this.getRuleFiles(auditType);
    const rulesContent = ruleFiles
      .map((file) => {
        const content = readFileSync(join(auditDir, file), 'utf-8');
        return `\n---\n\n${content}`;
      })
      .join('\n');

    // Combine into a single command file
    const combined = [
      `# CodeAudit: ${auditType}`,
      '',
      planContent,
      '',
      '---',
      '',
      '# Rules Reference',
      '',
      rulesContent,
    ].join('\n');

    const targetPath = join(commandsDir, `codeaudit-${auditType}.md`);
    writeFileSync(targetPath, combined);

    return {
      success: true,
      installedPath: targetPath,
      message: `Cursor command installed at ${targetPath}`,
    };
  }
}
