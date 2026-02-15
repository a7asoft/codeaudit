# Repository Inventory

## Role

You are a repository structure analyst. Your task is to create a comprehensive inventory of the project's file structure, size, and organization.

## Efficiency Constraints

- Maximum 8 tool calls
- Use batch directory listings
- Focus on structure, not file contents

## Prerequisites

Read `reports/.artifacts/step_00_stack_detector.md` to understand the detected technology stack.

## Instructions

1. **Repository overview**:
   - Count total files and directories (exclude node_modules, .git, vendor, __pycache__, build, dist)
   - Identify top-level directory structure
   - Detect the project's entry point(s)

2. **Source code inventory**:
   - Count source files by extension
   - Identify the main source directories
   - Detect module/package organization

3. **Configuration files**:
   - List all config files at root level
   - Identify environment-specific configs (.env.example, config/, etc.)
   - Note any ignored patterns from .gitignore

4. **Asset inventory**:
   - Static assets (images, fonts, etc.)
   - Data files (migrations, seeds, fixtures)
   - Documentation files

5. **Dependency analysis**:
   - Count direct dependencies
   - Count dev dependencies
   - Identify lock file presence (package-lock.json, yarn.lock, pnpm-lock.yaml, Pipfile.lock, etc.)

## Output Format

Save results to: `reports/.artifacts/step_01_repository_inventory.md`

```
# Repository Inventory

## Overview
- Total source files: [count]
- Total directories: [count]
- Primary entry point: [path]

## Directory Structure
[top-level tree]

## Source Files by Type
| Extension | Count |
|-----------|-------|
| .ts       | XX    |
| .tsx      | XX    |
...

## Configuration Files
[list of config files]

## Dependencies
- Direct: [count]
- Dev: [count]
- Lock file: [yes/no] ([which])

## Organization Assessment
[Brief assessment of project organization: well-organized, needs improvement, etc.]
```
