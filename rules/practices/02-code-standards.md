# Code Standards Assessment

## Role

Code standards specialist. Find real problems in real code. READ source files, GREP for patterns, count actual violations. Don't generalize — provide specific file:line references for every issue found.

## Efficiency Constraints

- Maximum 15 tool calls
- Search codebase for patterns, then READ flagged files
- Focus on systemic patterns and specific violations
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **Naming conventions** — GREP for violations:
   - Search for inconsistent casing (e.g., mixed camelCase and snake_case)
   - Search for single-letter variables outside loops
   - Search for cryptic abbreviations (e.g., `mgr`, `ctx`, `tmp`, `val` as function params)
   - Check file naming consistency across the project

2. **Error handling** — SEARCH for problems:
   - Grep for empty catch blocks: `catch` followed by `{}` or just a comment
   - Grep for generic error handling: `catch (e)` without specific types
   - Check if errors are silently swallowed (caught but not logged, rethrown, or handled)
   - Check for missing error handling on async operations (floating promises, unhandled rejections)
   - Report EVERY empty catch with file:line

3. **Implementation quality** — READ 5-8 source files:
   - Measure actual function lengths. Flag every function > 50 lines with file:line
   - Count parameters > 4 on functions. Flag with file:line
   - Check nesting depth > 3 levels. Flag with file:line
   - Check for code duplication: similar blocks of code in multiple places
   - Check for early returns and guard clauses vs deep nesting

4. **Type safety** (typed languages) — READ config and code:
   - Open language config: is strict mode ON? Report actual value
   - Grep for `any` (TypeScript), raw types (Java), `dynamic` (Dart/Flutter)
   - Count occurrences and report
   - Check null handling: Optional/nullable types used consistently?

5. **Best practices** — SEARCH for violations:
   - Grep for magic numbers/strings (literal values in conditions/calculations)
   - Check async/await: are there floating promises? (async call without await)
   - Check resource cleanup: are connections, streams, subscriptions properly closed?

## CRITICAL SCORING RULES

- Empty catch blocks > 5: deduct 10 points from error handling
- `any` / dynamic usage > 10 occurrences: deduct 10 points from type safety
- Functions > 100 lines found: deduct 5 points each (max -15)
- Floating promises found: deduct 5 points

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| Naming conventions | 0-20 |
| Error handling (no swallowed errors) | 0-25 |
| Implementation quality (complexity) | 0-25 |
| Type safety (strict mode verified) | 0-15 |
| Best practices | 0-15 |

## Output Format

Save to: `reports/.artifacts/practices_step_02_code_standards.md` (keep under 70 lines)

```
# Code Standards Assessment
## Naming: [consistent/mostly/inconsistent] — style: [casing] — violations: [count]

## Error Handling
- Empty catches: [count] — [file:line list]
- Silently swallowed errors: [count]
- Generic catches: [count]
- Missing async error handling: [count]

## Implementation Quality
- Functions > 50 lines: [count] — [file:line list]
- Functions > 4 params: [count]
- Nesting > 3 levels: [count]
- Code duplication: [assessment]

## Type Safety
- Strict mode: [actual config value]
- any/dynamic usage: [count from grep]
- Null safety: [assessment]

## Violations (all, for report)
[file:line — description — recommendation — severity]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
