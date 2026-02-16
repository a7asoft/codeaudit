<div align="center">

```
                 _                       _ _ _
   ___ ___   __| | ___  __ _ _   _  __| (_) |_
  / __/ _ \ / _` |/ _ \/ _` | | | |/ _` | | __|
 | (_| (_) | (_| |  __/ (_| | |_| | (_| | | |_
  \___\___/ \__,_|\___|\__,_|\__,_|\__,_|_|\__|
```

### Universal AI-Powered Project Audit CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Version](https://img.shields.io/badge/version-0.2.0-purple.svg)](https://github.com/a7asoft/codeaudit/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](https://github.com/a7asoft/codeaudit/pulls)

**Run comprehensive health audits and best practices checks on any software project.**
**Works with Claude Code, Cursor, and Gemini CLI.**

[Installation](#-installation) &bull; [Quick Start](#-quick-start) &bull; [Commands](#-commands) &bull; [How It Works](#-how-it-works) &bull; [Audit Types](#-audit-types)

</div>

---

## Preview

```
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  Health Audit          ████████████████████  10/10  100%   │
  │                                                            │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │  ● Technology Stack Detection ················· 33s        │
  │  ● Repository Inventory ······················· 41s        │
  │  ▲ Configuration & Dependencies Analysis · 82   55s        │
  │  ✔ Architecture Analysis ··················· 94   54s      │
  │  ✖ Testing Analysis ······················· 66   49s       │
  │  ▲ Code Quality Analysis ·················· 76   58s       │
  │  ✖ Security Analysis ······················ 68   49s       │
  │  ▲ CI/CD Analysis ························· 72   37s       │
  │  ▲ Documentation Analysis ················· 71   42s       │
  │  ▲ Report Generation & Format Enforcement · 78  4m 12s     │
  │                                                            │
  ├────────────────────────────────────────────────────────────┤
  │  Time 11m 15s  │  Tokens 1.8M  │  Cost ~$0.98             │
  └────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │                    ✔  AUDIT COMPLETE                       │
  │                                                            │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │  Steps       10/10 passed                                  │
  │  Duration    11m 15s                                       │
  │  Tokens      1,847,203                                     │
  │  Cost        ~$0.98                                        │
  │                                                            │
  │  Report →  reports/health_audit.txt                        │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

---

## Features

|  | Feature | Description |
|--|---------|-------------|
| 🌐 | **Universal** | Works with any language — Node.js, Python, Go, Rust, Java, Kotlin, Flutter, .NET, and more |
| 🤖 | **AI-Agnostic** | Supports Claude Code, Cursor, and Gemini CLI as audit engines |
| 📝 | **Pure Markdown Rules** | Audit rules are `.md` files — no proprietary format, fully transparent |
| 🔌 | **Installable Skills** | Install audit capabilities directly into your AI tools |
| 📊 | **Detailed Reports** | Generates plain-text reports ready for Google Docs |
| 🏗️ | **Monorepo Aware** | Automatically detects and handles monorepo structures |
| 🔒 | **OWASP Security** | Security analysis includes OWASP Top 10 coverage checks |
| 💰 | **Token Tracking** | Real-time token usage and cost estimation per step |

---

## Installation

**One-liner** (recommended):

```bash
curl -fsSL https://raw.githubusercontent.com/a7asoft/codeaudit/main/install.sh | bash
```

This clones to `~/.codeaudit/`, builds, and links the `codeaudit` command globally.

**Manual:**

```bash
git clone https://github.com/a7asoft/codeaudit.git ~/.codeaudit
cd ~/.codeaudit && npm install && npm run build
ln -sf ~/.codeaudit/dist/index.js ~/.local/bin/codeaudit
```

**Update:**

```bash
codeaudit update
```

**Uninstall:**

```bash
codeaudit uninstall
```

---

## Quick Start

```bash
# 1. Check your environment
codeaudit doctor

# 2. Run a health audit on your project
cd your-project/
codeaudit run health

# 3. Run best practices check
codeaudit run practices

# 4. Specify agent and model
codeaudit run health --agent claude --model sonnet
```

---

## Commands

| Command | Description |
|---------|-------------|
| `codeaudit run <type>` | Run an audit (`health`, `practices`) |
| `codeaudit doctor` | Check environment and AI tool availability |
| `codeaudit list` | List available audit types and their steps |
| `codeaudit init` | Detect AI tools and install audit skills to all |
| `codeaudit install <agent>` | Install skills to a specific agent |
| `codeaudit update` | Update codeaudit to the latest version |
| `codeaudit uninstall` | Remove codeaudit from your system |

### Options

| Flag | Description |
|------|-------------|
| `-a, --agent <agent>` | AI agent to use (`claude`, `cursor`, `gemini`) |
| `-m, --model <model>` | Model to use (`sonnet`, `opus`, `haiku`, etc.) |
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

---

## How It Works

```
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  plan.md    │────▶│  AI Agent   │────▶│  Artifacts  │
  │  (10 steps) │     │  (Claude/   │     │  (.md files │
  │             │     │   Cursor/   │     │   per step) │
  └─────────────┘     │   Gemini)   │     └──────┬──────┘
                      └─────────────┘            │
                                                 ▼
                                         ┌─────────────┐
                                         │   Report    │
                                         │  (.txt file │
                                         │  for Docs)  │
                                         └─────────────┘
```

1. **Parse** `plan.md` — ordered list of audit steps
2. **Detect** AI agent — finds available CLI (claude, cursor, gemini)
3. **Execute** each step — spawns AI process with the rule `.md` file
4. **Inject** prior artifacts — each step gets context from completed steps
5. **Generate** report — compiles all artifacts into final plain-text report

Each rule is a **self-contained markdown file** that any AI can read and follow. The CLI orchestrates execution, tracks tokens, and compiles the final report.

---

## Audit Types

### Health Audit

> `codeaudit run health`

Comprehensive project health assessment across **9 weighted sections**.
Produces a **15-section report** with Evidence, Risks, and Metrics per section.

```
  Section                    Weight    What It Checks
  ─────────────────────────  ──────    ─────────────────────────────
  Technology Stack & Config   15%      Language, framework, configs
  Architecture                18%      Patterns, layers, SOLID, DI
  Code Quality                15%      Linting, formatting, complexity
  Testing                     15%      Coverage, quality, anti-patterns
  Security                    12%      Secrets, auth, OWASP Top 10
  API & Data Layer            10%      API design, DB patterns
  CI/CD                        5%      Pipelines, automation
  Documentation                5%      README, API docs, inline docs
  Developer Experience         5%      Onboarding, tooling
```

**Output**: `./reports/health_audit.txt`

### Best Practices

> `codeaudit run practices`

Deep code-level quality assessment with **file:line violation tracking**.

```
  Section                    Weight    What It Checks
  ─────────────────────────  ──────    ─────────────────────────────
  Testing Quality              35%     AAA patterns, mocks, edge cases
  Architecture Compliance      35%     Layer boundaries, imports, DI
  Code Standards               30%     Naming, error handling, types
```

**Output**: `./reports/practices_audit.txt`

---

## Scoring

```
  ██████████████████████████████  Strong   85-100   Excellent
  ████████████████████░░░░░░░░░  Fair     70-84    Good, room to improve
  ██████████████░░░░░░░░░░░░░░░  Weak      0-69   Needs attention
```

The audit is **evidence-based and aggressive** — scores are backed by specific file:line references, grep results, and verified config values. Hard score caps prevent inflated results:

- Hardcoded secrets found → max 30/100 on Security
- Test ratio below 15% → max 55/100 on Testing
- Empty catch blocks > 5 → -10 points on Error Handling
- No dependency scanning → max 8/15 on Dep Security

---

## Supported AI Agents

<table>
<tr>
<td align="center" width="200">

**Claude Code**

`codeaudit run health --agent claude`

Sonnet, Opus, Haiku

</td>
<td align="center" width="200">

**Cursor**

`codeaudit run health --agent cursor`

Default model

</td>
<td align="center" width="200">

**Gemini CLI**

`codeaudit run health --agent gemini`

Pro, Flash

</td>
</tr>
</table>

---

## Project Structure

```
codeaudit/
├── src/
│   ├── index.ts              # CLI entry point (commander)
│   ├── commands/              # run, doctor, list, init, install, update, uninstall
│   ├── agents/                # Agent detection, resolution, installers
│   ├── runner/                # Plan parser, step executor, token tracker
│   └── utils/                 # Logger, banner, progress panel
├── rules/
│   ├── health/                # 10-step health audit rules
│   │   ├── plan.md
│   │   ├── 00-stack-detector.md
│   │   ├── ...
│   │   ├── 09-report-generator.md
│   │   └── templates/
│   └── practices/             # 4-step best practices rules
│       ├── plan.md
│       ├── 00-testing-quality.md
│       ├── ...
│       ├── 03-report-generator.md
│       └── templates/
└── test/
```

---

## Requirements

- **Node.js** >= 18
- At least one AI CLI installed:
  - [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (recommended)
  - [Cursor](https://cursor.com)
  - [Gemini CLI](https://github.com/google-gemini/gemini-cli)

---

## Development

```bash
git clone https://github.com/a7asoft/codeaudit.git
cd codeaudit
npm install
npm run build        # Build with tsup
npm run dev -- doctor  # Run in dev mode
npm test             # Run tests
```

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

The rule files in `rules/` are plain markdown — you can improve audit quality just by editing `.md` files, no TypeScript needed.

---

<div align="center">

**Made with AI, for AI-powered development.**

MIT License

</div>
