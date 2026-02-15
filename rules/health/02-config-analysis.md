# Configuration & Dependencies Analysis

## Role

You are a configuration and dependency analysis specialist. Your task is to evaluate the project's configuration files, dependency health, and build setup.

## Efficiency Constraints

- Maximum 10 tool calls
- Read multiple config files in batch
- Focus on issues, not just listing

## Prerequisites

Read `reports/.artifacts/step_00_stack_detector.md` and `reports/.artifacts/step_01_repository_inventory.md`.

## Instructions

1. **Configuration completeness**:
   - TypeScript: tsconfig.json strictness (strict, noImplicitAny, strictNullChecks)
   - Linting: ESLint/Prettier/Biome/pylint/rubocop/etc. configuration
   - Build: build configuration completeness
   - Environment: .env handling (.env.example exists?, .env in .gitignore?)

2. **Dependency health**:
   - Outdated dependencies (check for very old major versions)
   - Duplicate dependencies or conflicting versions
   - Unused dependencies (check imports vs declared deps where feasible)
   - Security-sensitive dependencies (known vulnerable packages)
   - Dependency count assessment (too many? too few for the project size?)

3. **Build configuration**:
   - Build targets and output format
   - Source maps configuration
   - Optimization settings
   - Development vs production builds

4. **Script/task configuration**:
   - Available scripts (build, test, lint, format, start, dev)
   - Missing recommended scripts
   - Script correctness and consistency

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| TypeScript/language strict mode | 0-15 |
| Linting configured and strict | 0-15 |
| Dependencies up to date | 0-20 |
| Environment handling proper | 0-15 |
| Build config complete | 0-15 |
| Scripts complete and correct | 0-10 |
| No security issues in deps | 0-10 |

## Output Format

Save results to: `reports/.artifacts/step_02_config_analysis.md`

```
# Configuration & Dependencies Analysis

## Configuration Assessment
### Language Config
[findings]

### Linting & Formatting
[findings]

### Environment Handling
[findings]

## Dependency Health
### Overview
- Direct dependencies: [count]
- Dev dependencies: [count]
- Potentially outdated: [count]
- Security concerns: [count]

### Issues Found
[list of issues]

## Build Configuration
[findings]

## Scripts Assessment
| Script | Present | Notes |
|--------|---------|-------|
| build  | ✓/✗     |       |
| test   | ✓/✗     |       |
| lint   | ✓/✗     |       |
...

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
