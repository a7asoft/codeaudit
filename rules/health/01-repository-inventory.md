# Repository Inventory

## Role

Repository structure analyst. Create a concise inventory of the project's file structure and organization.

## Efficiency Constraints

- Maximum 8 tool calls
- Use batch directory listings
- Focus on structure, not file contents
- The stack detection artifact is provided in context — do NOT re-read it

## Instructions

1. **Repository overview**: total files/dirs (exclude node_modules, .git, vendor, __pycache__, build, dist), top-level structure, entry point(s)

2. **Source code inventory**: file counts by extension, main source directories, module organization

3. **Configuration files**: root-level configs, environment configs, .gitignore patterns

4. **Dependencies**: direct count, dev count, lock file presence

## Output Format

Save to: `reports/.artifacts/step_01_repository_inventory.md` (keep under 50 lines)

```
# Repository Inventory
## Overview
- Source files: [count] | Directories: [count] | Entry point: [path]

## Directory Structure
[top-level tree, max 15 lines]

## Source Files by Type
| Extension | Count |
|-----------|-------|

## Configuration Files
[list]

## Dependencies
- Direct: [count] | Dev: [count] | Lock file: [yes/no]

## Organization: [well-organized | needs improvement | poor]
```
