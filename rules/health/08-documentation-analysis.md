# Documentation Analysis

## Role

Documentation analyst. Evaluate documentation quality and completeness. READ the actual docs — check if content is meaningful, not just that files exist.

## Efficiency Constraints

- Maximum 8 tool calls
- READ docs to assess quality, don't just check file existence
- Prior artifacts are in context — do NOT re-read them

## Monorepo Awareness

If the Stack Detection artifact indicates a monorepo, check for per-app README files and documentation completeness across apps.

## IMPORTANT EXCLUSIONS

- Do NOT recommend CODEOWNERS files (governance decision, not technical)
- Focus on technical documentation only

## Instructions

1. **README** — READ it and verify:
   - Does it have a meaningful project description? (not just the repo name)
   - Installation/setup instructions: are they complete and correct?
   - Usage examples: do they exist?
   - Contributing guidelines: present or missing?
   - License: present or missing?
   - Flag if README is a stub or auto-generated template

2. **API documentation**:
   - Search for Swagger/OpenAPI spec files, GraphQL schemas, API doc generators
   - If API docs exist, are they auto-generated or manually maintained?
   - If no API docs but project has APIs: flag as gap

3. **Code documentation** — sample 2-3 source files:
   - Are public functions/classes documented? (JSDoc, KDoc, docstrings, etc.)
   - Are complex algorithms explained?
   - Or is documentation completely absent from code?

4. **Operational docs** — check existence AND content:
   - CHANGELOG.md: exists? Has entries? Or is it empty/template?
   - CONTRIBUTING.md: exists? Has real guidelines?
   - Deployment guide: how to deploy?
   - Architecture docs: ADRs, architecture diagrams?

5. **Developer experience**:
   - Can a new developer get started from the docs alone?
   - Is the development workflow documented?

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| README complete and helpful | 0-25 |
| API documentation | 0-20 |
| Code documentation | 0-20 |
| Operational docs | 0-20 |
| Developer experience | 0-15 |

## Output Format

Save to: `reports/.artifacts/step_08_documentation_analysis.md` (keep under 50 lines)

```
# Documentation Analysis
## README: [comprehensive/adequate/minimal/stub/missing]
- Has: [list sections present]
- Missing: [list sections absent]

## API Docs: [type or "none"] — If APIs exist but no docs, flag gap
## Code Docs: [from sampling — documented/sparse/absent]

## Operational
| Document | Status |
|----------|--------|
| CHANGELOG | [meaningful/empty/missing] |
| CONTRIBUTING | [meaningful/empty/missing] |
| Deploy guide | [exists/missing] |
| Architecture docs | [exists/missing] |

## Developer Experience: [can a new dev get started? yes/partially/no]
## Key Issues: [max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
