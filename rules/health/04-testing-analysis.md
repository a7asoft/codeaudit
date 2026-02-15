# Testing Analysis

## Role

Testing strategy analyst. Evaluate test coverage, quality, patterns, and infrastructure.

## Efficiency Constraints

- Maximum 10 tool calls
- Scan test directories first, then sample 3-5 test files
- Use file counts and patterns rather than reading every file
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **Infrastructure**: testing framework, runner, coverage tool, test scripts

2. **Inventory**: test file count, test-to-source ratio, naming convention, organization

3. **Test types**: unit, integration, E2E, API/contract, component, performance

4. **Quality** (sample 3-5 files): AAA pattern, descriptive names, edge cases, mock usage, isolation, assertion quality

5. **Coverage**: configured?, thresholds?, report generation?

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Framework configured | 0-10 |
| Meaningful test count | 0-20 |
| Test types variety | 0-20 |
| Test quality (samples) | 0-25 |
| Coverage setup | 0-15 |
| Organization | 0-10 |

## Output Format

Save to: `reports/.artifacts/step_04_testing_analysis.md` (keep under 50 lines)

```
# Testing Analysis
## Infrastructure: [framework] | Runner: [name] | Coverage: [tool or "none"]

## Inventory
- Tests: [count] | Sources: [count] | Ratio: [ratio] | Convention: [pattern]

## Test Types
| Type | Present | Count |
|------|---------|-------|

## Quality (sampled): [key findings, max 5 lines]
## Coverage: [configured/not] — Thresholds: [values or "none"]
## Key Issues: [max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
