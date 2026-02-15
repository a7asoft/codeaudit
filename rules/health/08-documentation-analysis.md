# Documentation Analysis

## Role

Documentation analyst. Evaluate documentation quality, completeness, and accessibility.

## Efficiency Constraints

- Maximum 8 tool calls
- Scan for doc files first, then sample content
- Focus on presence and quality, not reading everything
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **README**: exists, non-trivial, has description/install/usage/contributing/license

2. **API docs**: Swagger/OpenAPI/GraphQL schema, auto-generated or manual, completeness

3. **Code docs**: inline comments quality, JSDoc/docstrings, complex logic documented, ADRs

4. **Operational**: deployment docs, env setup, troubleshooting, CHANGELOG, CONTRIBUTING

5. **Developer experience**: onboarding, workflow, code style guide, IDE setup

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| README complete | 0-25 |
| API documentation | 0-20 |
| Code documentation | 0-20 |
| Operational docs | 0-20 |
| Developer experience | 0-15 |

## Output Format

Save to: `reports/.artifacts/step_08_documentation_analysis.md` (keep under 45 lines)

```
# Documentation Analysis
## README: [comprehensive/adequate/minimal/missing]
- Sections: [list]

## API Docs: [type or "none"] — Completeness: [assessment]
## Code Docs: Comments: [good/sparse/missing] — Docstrings: [yes/no]

## Operational
| Document | Present |
|----------|---------|
| CHANGELOG | yes/no |
| CONTRIBUTING | yes/no |
| Deploy guide | yes/no |

## Developer Experience: [assessment]
## Key Issues: [max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
