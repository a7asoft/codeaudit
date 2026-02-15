# codeaudit

Universal AI-Powered Project Audit CLI. Run comprehensive health audits and best practices checks on any software project using your preferred AI agent.

## Features

- **Universal**: Works with any language/framework (Node.js, Python, Go, Rust, Java, Flutter, etc.)
- **AI-Agnostic**: Supports Claude Code, Cursor, and Gemini CLI
- **Pure Markdown Rules**: Audit rules are `.md` files — no proprietary format
- **Installable Skills**: Install audit capabilities directly into your AI tools
- **Detailed Reports**: Generates plain-text reports ready for Google Docs

## Installation

One-liner (recommended):

```bash
curl -fsSL https://raw.githubusercontent.com/a7asoft/codeaudit/main/install.sh | bash
```

This clones to `~/.codeaudit/`, builds, and links the `codeaudit` command globally.

To update, run the same command again. To uninstall:

```bash
rm -rf ~/.codeaudit ~/.local/bin/codeaudit
```

## Quick Start

```bash
# Check your environment
codeaudit doctor

# Run a health audit
codeaudit run health

# Run best practices check
codeaudit run practices

# List available audits
codeaudit list
```

## Commands

### `codeaudit run <type>`

Run an audit on the current project.

```bash
codeaudit run health                        # Full health audit
codeaudit run practices                     # Best practices check
codeaudit run health --agent claude --model sonnet  # Specify agent + model
```

**Options:**
- `-a, --agent <agent>` — AI agent to use (claude, cursor, gemini)
- `-m, --model <model>` — Model to use (sonnet, opus, haiku, etc.)

### `codeaudit doctor`

Check your environment for required tools.

```bash
codeaudit doctor
```

### `codeaudit list`

List available audit types with their steps.

```bash
codeaudit list
```

### `codeaudit init`

Detect installed AI tools and install audit skills to all of them.

```bash
codeaudit init
```

### `codeaudit install <agent>`

Install audit skills to a specific AI agent.

```bash
codeaudit install claude    # Install to Claude Code
codeaudit install cursor    # Install to Cursor
codeaudit install gemini    # Install to Gemini CLI
```

## Audit Types

### Health Audit (`health`)

Comprehensive project health assessment covering 9 sections:

| Section | Weight |
|---------|--------|
| Tech Stack & Config | 15% |
| Architecture | 18% |
| Code Quality | 15% |
| Testing | 15% |
| Security | 12% |
| API & Data Layer | 10% |
| CI/CD | 5% |
| Documentation | 5% |
| Developer Experience | 5% |

**Output**: `./reports/health_audit.txt`

### Best Practices (`practices`)

Deep code-level quality assessment:

| Section | Weight |
|---------|--------|
| Testing Quality | 35% |
| Architecture Compliance | 35% |
| Code Standards | 30% |

**Output**: `./reports/practices_audit.txt`

## Scoring

- **Strong** (85-100): Excellent adherence to standards
- **Fair** (70-84): Good with room for improvement
- **Weak** (0-69): Needs significant attention

## How It Works

1. **Parse plan.md** — extract ordered list of audit steps
2. **Detect AI agent** — find available CLI (claude, cursor, gemini)
3. **Select model** — interactive prompt or `--model` flag
4. **Execute steps** — spawn AI process for each rule file
5. **Generate report** — compile artifacts into final report

Each rule is a self-contained `.md` file that any AI can read and follow. The CLI orchestrates execution, tracks tokens, and compiles the final report.

## Requirements

- Node.js >= 18
- At least one AI CLI installed:
  - [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
  - [Cursor](https://cursor.com)
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli)

## Development

```bash
git clone <repo-url>
cd codeaudit
npm install
npm run build        # Build with tsup
npm run dev -- doctor  # Run in dev mode
npm test             # Run tests
```

## License

MIT
