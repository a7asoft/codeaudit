# Testing Analysis

## Role

Testing strategy analyst. Evaluate test coverage, quality, patterns, and infrastructure. Be honest about gaps — a project with 10% test coverage is critically undertested regardless of test quality.

## Efficiency Constraints

- Maximum 10 tool calls
- Scan test directories first, then sample 3-5 test files
- Prior artifacts are in context — do NOT re-read them

## Monorepo Awareness

If the Stack Detection artifact indicates a monorepo, count test files per app/package and report per-app test ratios.

## Instructions

1. **Infrastructure** — verify by reading config, not just checking file existence:
   - Testing framework: which one? Read the config to confirm it's properly set up
   - Coverage tool: is it configured with thresholds? What are the actual threshold values?
   - Test scripts: does `test` script exist? Does it actually run tests?

2. **Inventory** — count precisely:
   - Count test files vs source files. Calculate ratio
   - A ratio below 30% is concerning. Below 15% is critical
   - Identify which modules/features have ZERO tests — list them explicitly

3. **Test types** — verify each type exists:
   - Unit, integration, E2E, component, API tests
   - Don't count boilerplate/example tests (e.g., "ExampleUnitTest", "ExampleInstrumentedTest")
   - Flag if only one type exists (e.g., only unit tests, no integration)

4. **Quality** — READ 3-5 actual test files:
   - AAA pattern? Descriptive names? Edge cases?
   - Check for anti-patterns: tests with no assertions, tests that mock everything, tests testing implementation details
   - Check for flaky indicators: timeouts, sleep, external service calls

5. **Coverage enforcement**:
   - Is coverage enforced in CI? On PRs only or all branches?
   - What are actual thresholds? Are they meaningful (>60%) or token (<20%)?

## CRITICAL SCORING RULES

- Test:source ratio below 15%: maximum 55/100 regardless of quality
- No integration tests: deduct 10 points
- No E2E/UI tests: deduct 5 points
- Coverage not enforced in CI: deduct 10 points
- Boilerplate tests counted as real tests: flag this explicitly

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Framework configured properly | 0-10 |
| Meaningful test count (ratio) | 0-25 |
| Test type variety | 0-15 |
| Test quality (from samples) | 0-25 |
| Coverage enforced with thresholds | 0-15 |
| Organization | 0-10 |

## Output Format

Save to: `reports/.artifacts/step_04_testing_analysis.md` (keep under 60 lines)

```
# Testing Analysis
## Infrastructure: [framework] | Coverage: [tool] | Thresholds: [actual values]

## Inventory
- Test files: [count] | Source files: [count] | Ratio: [X%] — [CRITICAL/LOW/ADEQUATE/GOOD]
- Modules with ZERO tests: [list them]

## Test Types
| Type | Count | Notes |
|------|-------|-------|

## Quality (sampled [N] files):
[specific findings — good and bad]

## Anti-patterns found:
[list with file references]

## Coverage enforcement: [where enforced] | Thresholds: [actual values]
## Key Issues: [max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
