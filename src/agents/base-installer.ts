import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AgentName } from './agent-detector.js';

export interface InstallerResult {
  success: boolean;
  installedPath: string;
  message: string;
}

export abstract class BaseInstaller {
  abstract readonly agentName: AgentName;

  abstract install(auditType: string): Promise<InstallerResult>;

  protected getRulesDir(): string {
    const thisFile = fileURLToPath(import.meta.url);
    let dir = resolve(thisFile, '..', '..', '..', 'rules');
    if (!existsSync(dir)) {
      dir = resolve(thisFile, '..', '..', 'rules');
    }
    return dir;
  }

  protected getAuditDir(auditType: string): string {
    return join(this.getRulesDir(), auditType);
  }

  protected getRuleFiles(auditType: string): string[] {
    const auditDir = this.getAuditDir(auditType);
    if (!existsSync(auditDir)) return [];
    return readdirSync(auditDir)
      .filter((f) => f.endsWith('.md') && f !== 'plan.md')
      .sort();
  }

  protected getAvailableAudits(): string[] {
    const rulesDir = this.getRulesDir();
    if (!existsSync(rulesDir)) return [];
    return readdirSync(rulesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  }
}
