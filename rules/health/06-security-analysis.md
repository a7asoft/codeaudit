# Security Analysis

## Role

Security analyst. Identify vulnerabilities, secrets exposure, auth patterns, and security best practices.

## Efficiency Constraints

- Maximum 10 tool calls
- Use grep/search for patterns rather than reading every file
- Focus on common vulnerability patterns
- Prior artifacts are in context — do NOT re-read them

## Instructions

1. **Secrets**: hardcoded secrets/keys/tokens in source, .gitignore for .env, .env.example without real values

2. **Dependency vulnerabilities**: known vulnerable packages, security advisories, audit in CI

3. **Auth & authorization**: mechanism (JWT/session/OAuth), middleware/guards, password hashing, rate limiting

4. **Input validation**: API validation, SQL injection prevention, XSS prevention, CORS config

5. **Security config**: HTTPS, security headers (helmet/CSP/HSTS), cookie flags, no stack traces in prod

6. **Data protection**: sensitive data in logs, PII handling, encryption indicators

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| No hardcoded secrets | 0-25 |
| Dependency security | 0-15 |
| Auth implementation | 0-20 |
| Input validation | 0-20 |
| Security config | 0-10 |
| Data protection | 0-10 |

## Output Format

Save to: `reports/.artifacts/step_06_security_analysis.md` (keep under 50 lines)

```
# Security Analysis
## Secrets: [no issues / X issues found]
## Dependency Security: [X vulnerabilities / clean / unable to check]
## Auth: [mechanism] — Guards: [yes/no] — Hashing: [algo] — Rate limit: [yes/no]
## Input Validation: [assessment]
## Security Config: [assessment]
## Critical Issues: [prioritized, max 5]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
