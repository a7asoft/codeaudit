import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { getGeminiDir } from '../utils/platform.js';
import { BaseInstaller, type InstallerResult } from './base-installer.js';

export class GeminiInstaller extends BaseInstaller {
  readonly agentName = 'gemini';

  async install(auditType: string): Promise<InstallerResult> {
    const geminiDir = getGeminiDir();
    const workflowsDir = join(geminiDir, 'global_workflows');
    const rulesTargetDir = join(geminiDir, 'codeaudit_rules', auditType);

    mkdirSync(workflowsDir, { recursive: true });
    mkdirSync(rulesTargetDir, { recursive: true });

    const auditDir = this.getAuditDir(auditType);

    // Create workflow file from plan.md
    const planContent = readFileSync(join(auditDir, 'plan.md'), 'utf-8');
    const workflowPath = join(workflowsDir, `codeaudit_${auditType}.md`);
    writeFileSync(workflowPath, planContent);

    // Copy rule files
    const ruleFiles = this.getRuleFiles(auditType);
    for (const file of ruleFiles) {
      const src = join(auditDir, file);
      writeFileSync(join(rulesTargetDir, file), readFileSync(src));
    }

    // Copy templates if present
    const templatesDir = join(auditDir, 'templates');
    const templatesTarget = join(rulesTargetDir, 'templates');
    if (existsSync(templatesDir)) {
      mkdirSync(templatesTarget, { recursive: true });
      cpSync(templatesDir, templatesTarget, { recursive: true });
    }

    return {
      success: true,
      installedPath: geminiDir,
      message: `Gemini workflow installed at ${workflowPath}`,
    };
  }
}
