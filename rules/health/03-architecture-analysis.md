# Architecture Analysis

## Role

Software architecture analyst. Evaluate architectural patterns, layering, modularity, and SOLID adherence.

## Efficiency Constraints

- Maximum 12 tool calls
- Scan directory structures first, then read representative files
- Focus on patterns, not line-by-line review
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **Pattern identification**: detect MVC/Clean/Hexagonal/Layered/etc., assess consistency, separation of concerns

2. **Layer analysis**: identify layers (controllers, services, repositories, models), check for violations, assess dependency direction

3. **Modularity**: by-feature vs by-type organization, coupling, cohesion, shared code

4. **SOLID principles**: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion

5. **Framework-specific patterns**: adapt checks to detected framework (NestJS modules, React hooks, Django apps, Flutter BLoC, etc.)

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Clear architectural pattern | 0-20 |
| Proper layer separation | 0-20 |
| Module organization | 0-20 |
| SOLID adherence | 0-20 |
| Framework best practices | 0-20 |

## Output Format

Save to: `reports/.artifacts/step_03_architecture_analysis.md` (keep under 60 lines)

```
# Architecture Analysis
## Pattern: [name] — [consistent/mostly/inconsistent]

## Layers
| Layer | Directory | Assessment |
|-------|-----------|------------|

## Modularity: [by-feature|by-type|mixed] — Coupling: [loose/moderate/tight]

## SOLID
| Principle | Status | Notes |
|-----------|--------|-------|

## Framework Patterns: [key findings]
## Key Issues: [prioritized, max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
