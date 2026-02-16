import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { getClaudeSkillsDir } from '../utils/platform.js';
import { BaseInstaller, type InstallerResult } from './base-installer.js';

export class ClaudeInstaller extends BaseInstaller {
  readonly agentName = 'claude';

  async install(auditType: string): Promise<InstallerResult> {
    const skillsDir = getClaudeSkillsDir();
    const targetDir = join(skillsDir, `codeaudit-${auditType}`);
    const rulesSubDir = join(targetDir, 'rules');
    const templatesSubDir = join(targetDir, 'templates');

    mkdirSync(rulesSubDir, { recursive: true });
    mkdirSync(templatesSubDir, { recursive: true });

    const auditDir = this.getAuditDir(auditType);

    // Read and transform plan.md into SKILL.md with frontmatter
    const planContent = readFileSync(join(auditDir, 'plan.md'), 'utf-8');
    const skillContent = [
      '---',
      `name: codeaudit-${auditType}`,
      `description: Run ${auditType} audit on the current project`,
      `tools: Read, Bash, Glob, Grep, Write`,
      '---',
      '',
      planContent,
    ].join('\n');
    writeFileSync(join(targetDir, 'SKILL.md'), skillContent);

    // Copy rule files
    const ruleFiles = this.getRuleFiles(auditType);
    for (const file of ruleFiles) {
      const src = join(auditDir, file);
      writeFileSync(join(rulesSubDir, file), readFileSync(src));
    }

    // Copy templates if present
    const templatesDir = join(auditDir, 'templates');
    if (existsSync(templatesDir)) {
      cpSync(templatesDir, templatesSubDir, { recursive: true });
    }

    return {
      success: true,
      installedPath: targetDir,
      message: `Claude skill installed at ${targetDir}`,
    };
  }
}
