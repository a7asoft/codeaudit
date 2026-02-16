# Configuration & Dependencies Analysis

## Role

Configuration and dependency analyst. Evaluate config quality, dependency health, and build setup. Be critical — verify claims, don't assume.

## Efficiency Constraints

- Maximum 10 tool calls
- Read config files directly — don't guess from filenames
- Prior artifacts are in context — do NOT re-read them

## Monorepo Awareness

If the Stack Detection artifact indicates a monorepo, analyze root-level AND per-app configurations. Report per-app findings where they differ.

## Instructions

1. **Configuration completeness** — READ the actual config files:
   - TypeScript: open tsconfig.json, check `strict`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals` — report actual values
   - Kotlin: check `allWarningsAsErrors`, `-Werror`, explicit API mode in gradle.properties or build files
   - Python: check mypy/pyright config, strict mode actual setting
   - Linting: open the linter config (eslint, detekt, pylint, etc.) — check if rules are strict or relaxed, check if `warningsAsErrors` or equivalent is enabled
   - Formatting: verify formatter is actually configured, not just installed
   - Environment: check if .env/.env.example exists, check .gitignore actually excludes .env files

2. **Dependency health** — READ package manager files:
   - Count direct vs dev dependencies
   - Flag any dependency that looks outdated (check versions in config)
   - Flag excessive dependency count for project size
   - Check if lock file exists (package-lock.json, yarn.lock, Pipfile.lock, poetry.lock, Cargo.lock, etc.)
   - Check for dependency update automation: search for `dependabot.yml`, `renovate.json`, gradle-versions-plugin, etc.

3. **Build configuration** — READ build files:
   - Check actual build targets, optimization settings
   - Check if source maps are configured
   - Check for dev vs prod build separation

4. **Scripts/tasks** — READ package.json scripts or equivalent:
   - Which scripts exist: build, test, lint, format, start, dev?
   - Flag missing essentials

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Language strict mode (verified) | 0-15 |
| Linting strict + enforced | 0-15 |
| Dependencies healthy | 0-20 |
| Environment handling proper | 0-15 |
| Build config complete | 0-15 |
| Scripts complete | 0-10 |
| No security issues in deps | 0-10 |

## Output Format

Save to: `reports/.artifacts/step_02_config_analysis.md` (keep under 60 lines)

```
# Configuration & Dependencies Analysis

## Config Assessment
- Language strict mode: [actual values found, e.g. "strict: true, noImplicitAny: true"]
- Linting: [tool] — warningsAsErrors: [actual value] — rules: [strict/relaxed]
- Formatting: [tool] — actually configured: [yes/no]
- .env handling: [.gitignore verified: yes/no] — .env.example: [exists/missing]

## Dependency Health
- Direct: [count] | Dev: [count] | Lock file: [exists/missing]
- Update automation: [dependabot/renovate/none — verified by searching for config files]
- Outdated concerns: [list]
- Security concerns: [list]

## Build: [findings from reading actual build files]
## Scripts: [present] | Missing: [list]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
