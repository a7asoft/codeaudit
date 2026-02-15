# Health Audit — Execution Plan

## Overview

This audit performs a comprehensive health assessment of any software project, regardless of language or framework. It evaluates technology stack, architecture, code quality, testing, security, CI/CD, and documentation.

## Output

- Artifacts: `reports/.artifacts/step_XX_*.md`
- Final report: `reports/health_audit.txt`

## Execution Order

1. `00-stack-detector.md` — Technology Stack Detection
2. `01-repository-inventory.md` — Repository Inventory
3. `02-config-analysis.md` — Configuration & Dependencies Analysis
4. `03-architecture-analysis.md` — Architecture Analysis
5. `04-testing-analysis.md` — Testing Analysis
6. `05-code-quality.md` — Code Quality Analysis
7. `06-security-analysis.md` — Security Analysis
8. `07-cicd-analysis.md` — CI/CD Analysis
9. `08-documentation-analysis.md` — Documentation Analysis
10. `09-report-generator.md` — Report Generation
11. `10-format-enforcer.md` — Format Enforcement

## Rules

- Each step MUST save its output to the specified artifact path
- Steps are sequential — each step may depend on artifacts from prior steps
- Step 00 (Stack Detection) is MANDATORY and runs first — all subsequent steps adapt to the detected stack
- Step 09 reads ALL prior artifacts and produces the final report
- Step 10 validates and enforces the plain-text report format
