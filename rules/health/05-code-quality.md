# Code Quality Analysis

## Role

Code quality analyst. Evaluate linting, formatting, static analysis, complexity, and code health.

## Efficiency Constraints

- Maximum 10 tool calls
- Check configs first, then sample 3-5 source files
- Focus on systemic issues
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **Linting**: tool, strictness, custom rules, pre-commit hooks

2. **Formatting**: tool, EditorConfig, consistency

3. **Static analysis**: type checking strictness, additional tools

4. **Complexity** (sample 3-5 files): function length >50, file length >300, nesting >3, god classes

5. **Code health**: TODO/FIXME count, console.log in prod, dead code, magic numbers, error handling patterns

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Linter strict | 0-20 |
| Formatter configured | 0-15 |
| Type safety | 0-20 |
| Complexity within limits | 0-25 |
| Code health | 0-20 |

## Output Format

Save to: `reports/.artifacts/step_05_code_quality.md` (keep under 50 lines)

```
# Code Quality Analysis
## Linting: [tool] — [strict/moderate/minimal] — Pre-commit: [yes/no]
## Formatting: [tool] — EditorConfig: [yes/no]
## Type Safety: [strict/moderate/loose/none]

## Complexity (sampled)
| File | Lines | Max Fn Length | Max Nesting |
|------|-------|--------------|-------------|

## Code Health
- TODOs: [count] | Console stmts: [count] | Dead code: [yes/no]
- Error handling: [assessment]

## Key Issues: [max 5]
## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
