# Best Practices Audit — Execution Plan

## Overview

This audit performs a micro-level code quality assessment, evaluating testing quality, architecture compliance, and code standards against industry best practices. It focuses on code-level patterns rather than project-level health.

## Output

- Artifacts: `reports/.artifacts/practices_step_XX_*.md`
- Final report: `reports/practices_audit.txt`

## Execution Order

1. `00-testing-quality.md` — Testing Quality Assessment
2. `01-architecture-compliance.md` — Architecture Compliance
3. `02-code-standards.md` — Code Standards Assessment
4. `03-format-enforcer.md` — Format Enforcement
5. `04-report-generator.md` — Report Generation

## Rules

- Each step MUST save its output to the specified artifact path
- Steps are sequential — each step may depend on artifacts from prior steps
- The audit adapts to any technology stack by detecting it first
- Step 04 reads ALL prior artifacts and produces the final report
- Step 03 validates and enforces the plain-text report format
