# Security Analysis

## Role

Security analyst performing a thorough audit. Your job is to FIND problems, not to reassure. Assume nothing is secure until proven. Verify every claim. A single missed secret or vulnerability is a failure.

## Efficiency Constraints

- Maximum 12 tool calls
- Use grep/search aggressively for patterns
- READ files to verify — never assume from filenames
- Prior artifacts are in context — do NOT re-read them

## IMPORTANT EXCLUSIONS

- Do NOT recommend CODEOWNERS or SECURITY.md files (governance decisions, not technical requirements)
- Focus ONLY on technical security issues

## Monorepo Awareness

If the Stack Detection artifact indicates a monorepo, analyze each app/package individually and report per-app findings.

## Instructions

### 1. Secrets & Credentials (MOST CRITICAL — MANDATORY CHECK)

**Search for hardcoded secrets** — run these searches:
- Grep for: `password`, `secret`, `api_key`, `apikey`, `token`, `credential`, `private_key`, `access_key` in ALL non-test source files, config files, and properties files
- Grep for: patterns like `=sk-`, `=ghp_`, `=AKIA`, `Bearer `, base64-encoded strings that look like keys
- READ `local.properties`, `.env`, `application.properties`, `application.yml`, `config.yaml`, or any properties/config file that might contain secrets — even if .gitignore excludes them, they might still be on disk or tracked in git history
- Search for keystore/signing files: `*.jks`, `*.keystore`, `*.p12`, `*.pem`, `*.key` — if found, flag as CRITICAL regardless of .gitignore

**Specific secret patterns to grep** (adapt to detected stack):
- Direct env access: `process.env.` in source (should use config service)
- Hardcoded JWT secrets: `secret.*[:=].*['"][^'"]{8,}`
- Database connection strings with credentials: `postgres://`, `mysql://`, `mongodb://`, `redis://` in source
- API keys/tokens in source: `Bearer.*['"][A-Za-z0-9]{20,}`, `api_key.*[:=].*['"]`
- Cloud credentials: `AKIA`, `aws_secret`, `gcp_credentials`, `azure_secret`
- Payment secrets: `sk_live_`, `sk_test_`, `stripe.*[Ss]ecret`

**Verify .gitignore** — READ .gitignore and verify:
- Are secret files (.env, local.properties, *.jks, etc.) actually listed?
- Even if listed in .gitignore, search for these files — they may have been committed BEFORE the .gitignore entry was added
- Check if `.env.example` or `local.properties.example` exists WITHOUT real values

**Check for secrets in committed files**:
- Search for `password=`, `secret=`, `key=` with actual values (not empty/placeholder) in ANY tracked file
- Search build scripts and CI configs for inline secrets

### 2. Dependency Security

- Search for `dependabot.yml` or `.github/dependabot.yml` — READ it if found
- Search for `renovate.json` or `renovate.json5`
- Check if `npm audit`, `pip audit`, `gradle dependencyCheckAnalyze`, or equivalent runs in CI
- If NO dependency scanning exists, this is a significant gap — don't give points

### 3. Authentication & Authorization

- Search for auth-related code: JWT handling, session management, OAuth config
- Check for auth middleware/guards/interceptors — READ one to verify it's real, not a stub
- Search for password hashing: `bcrypt`, `argon2`, `scrypt`, `pbkdf2`
- Search for rate limiting configuration
- For mobile: check for certificate pinning, SSL pinning, network security config

### 4. Input Validation

- Search for validation libraries/decorators: `class-validator`, `zod`, `joi`, `@Valid`, validation pipes
- Check API endpoints: do they validate input or trust raw data?
- Check for SQL injection prevention: parameterized queries, ORM usage
- Check CORS configuration: is it `*` (allow all) or properly restricted?

### 5. Security Configuration

- For web: check for security headers (helmet, CSP, HSTS, X-Frame-Options)
- For mobile: check AndroidManifest.xml/Info.plist for security settings, check for `android:debuggable`, `usesCleartextTraffic`
- Check cookie flags: httpOnly, secure, sameSite
- Check if debug mode can accidentally be enabled in production

### 6. Data Protection

- Search for sensitive data in logs (grep for logging statements near auth/payment code)
- Check encryption: is sensitive data encrypted at rest? (EncryptedSharedPreferences, Keychain, etc.)

### 7. OWASP Top 10 Quick Check

Verify coverage against OWASP Top 10:
- A01 Broken Access Control: auth guards on protected routes?
- A02 Cryptographic Failures: proper password hashing? HTTPS enforcement?
- A03 Injection: input validation on endpoints? Parameterized queries?
- A05 Security Misconfiguration: security headers? Debug mode disabled?
- A06 Vulnerable Components: dependency scanning configured?
- A07 Authentication Failures: brute force protection (rate limiting)?
- A09 Logging Failures: security events logged? No sensitive data in logs?

Report which OWASP categories are covered and which have gaps.

## CRITICAL SCORING RULES

- Hardcoded secrets/passwords found with real values: maximum 30/100 total
- Signing keys (*.jks, *.keystore, *.p12) found in repo: deduct 20 points
- No dependency scanning AND no Dependabot: maximum 8/15 for dep security
- CORS set to `*` in production: deduct 10 points
- `android:debuggable=true` or equivalent in release config: deduct 10 points

## Scoring Criteria (0-100)

| Criteria | Points |
|----------|--------|
| No secrets/credentials exposed | 0-25 |
| Dependency security scanning | 0-15 |
| Auth implementation solid | 0-20 |
| Input validation present | 0-20 |
| Security config proper | 0-10 |
| Data protection | 0-10 |

## Output Format

Save to: `reports/.artifacts/step_06_security_analysis.md` (keep under 80 lines)

```
# Security Analysis

## Secrets & Credentials (MANDATORY)
- Hardcoded secrets found: [yes/no — with specific file:line if yes]
- Secret patterns in source code: [grep results summary — mandatory even if empty]
- Signing keys in repo: [list files found, or "none"]
- Properties files with credentials: [list with redacted values]
- .gitignore coverage: [verified: which secret patterns are covered, which are missing]
- .env.example/local.properties.example: [exists with placeholders / exists with real values / missing]

## Dependency Security
- Scanning tool: [dependabot/renovate/npm audit/none — verified by reading config]
- If dependabot exists: [read and report what it covers]
- CI audit step: [yes/no — verified in CI config]

## Auth
- Mechanism: [type — verified by reading code]
- Middleware/guards: [present and functional / stub / missing]
- Password hashing: [algorithm found / not found]
- Rate limiting: [configured / not found]
- Certificate pinning: [implemented / not found]

## Input Validation: [assessment with evidence]
## Security Config: [assessment with evidence]
## Data Protection: [assessment with evidence]

## OWASP Coverage
| Category | Status | Evidence |
|----------|--------|----------|

## Critical Issues: [prioritized, with file:line references]

## Score: [XX]/100
## Label: [Strong|Fair|Weak]
```
