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
4. `03-report-generator.md` — Report Generation & Format Enforcement

## Rules

- Each step MUST save its output to the specified artifact path
- Steps are sequential — each step may depend on artifacts from prior steps
- The audit adapts to any technology stack by detecting it first
- Prior step artifacts are injected into each step's context — avoid re-reading them from disk
- Step 03 uses ALL prior artifacts (provided in context) to produce and format-validate the final report
