#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────
REPO_ORG="a7asoft"
REPO_NAME="codeaudit"
INSTALL_DIR="$HOME/.codeaudit"
BIN_DIR="$HOME/.local/bin"
BIN_PATH="$BIN_DIR/codeaudit"
MIN_NODE_VERSION=18

# ─── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

# ─── Helpers ─────────────────────────────────────────────────
info()    { printf "  ${BLUE}→${RESET} %s\n" "$1"; }
success() { printf "  ${GREEN}✔${RESET} %s\n" "$1"; }
warn()    { printf "  ${YELLOW}⚠${RESET} %s\n" "$1"; }
error()   { printf "  ${RED}✖${RESET} %s\n" "$1"; exit 1; }
step()    { printf "    ${GREEN}✔${RESET} %s\n" "$1"; }
dim()     { printf "  ${DIM}%s${RESET}\n" "$1"; }

# ─── Banner ──────────────────────────────────────────────────
banner() {
  echo ""
  printf "  ${PURPLE}▄▀▀ ▄▀▄ █▀▄ ██▀${BLUE} ▄▀▄ █ █ █▀▄${CYAN} █ ▀█▀${RESET}\n"
  printf "  ${PURPLE}▀▄▄ ▀▄▀ █▄▀ █▄▄${BLUE} █▀█ ▀▄█ █▄▀${CYAN} █  █${RESET}\n"
  printf "  ${DIM}AI-Powered Project Audit${RESET}\n"
  echo ""
}

# ─── Detect Git protocol ────────────────────────────────────
detect_repo_url() {
  if ssh -o StrictHostKeyChecking=no -o BatchMode=yes -T git@github.com 2>&1 | grep -qi "successfully authenticated"; then
    echo "git@github.com:${REPO_ORG}/${REPO_NAME}.git"
  else
    echo "https://github.com/${REPO_ORG}/${REPO_NAME}.git"
  fi
}

# ─── Detect shell config file ───────────────────────────────
detect_shell_config() {
  local shell_name
  shell_name=$(basename "$SHELL")

  case "$shell_name" in
    zsh)
      echo "$HOME/.zshrc"
      ;;
    bash)
      if [[ -f "$HOME/.bash_profile" ]]; then
        echo "$HOME/.bash_profile"
      else
        echo "$HOME/.bashrc"
      fi
      ;;
    fish)
      echo "$HOME/.config/fish/config.fish"
      ;;
    *)
      echo "$HOME/.profile"
      ;;
  esac
}

# ─── Add to PATH ────────────────────────────────────────────
ensure_path() {
  if echo "$PATH" | tr ':' '\n' | grep -qx "$BIN_DIR"; then
    return 0
  fi

  local config_file
  config_file=$(detect_shell_config)
  local shell_name
  shell_name=$(basename "$SHELL")

  if [[ "$shell_name" == "fish" ]]; then
    local line="fish_add_path $BIN_DIR"
  else
    local line="export PATH=\"\$HOME/.local/bin:\$PATH\""
  fi

  if [[ -f "$config_file" ]] && grep -qF "$BIN_DIR" "$config_file" 2>/dev/null; then
    return 0
  fi

  echo "" >> "$config_file"
  echo "# codeaudit" >> "$config_file"
  echo "$line" >> "$config_file"

  warn "Added ${BIN_DIR} to PATH in ${config_file}"
  warn "Run: source ${config_file}  (or restart your terminal)"
}

# ═════════════════════════════════════════════════════════════
#                        MAIN
# ═════════════════════════════════════════════════════════════

banner

IS_UPDATE=false
if [[ -d "$INSTALL_DIR" ]]; then
  IS_UPDATE=true
  info "Updating codeaudit..."
else
  info "Installing codeaudit..."
fi
echo ""

# ─── Prerequisites ───────────────────────────────────────────
info "Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
  error "Node.js not found. Install Node.js >= ${MIN_NODE_VERSION} first."
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [[ "$NODE_VERSION" -lt "$MIN_NODE_VERSION" ]]; then
  error "Node.js >= ${MIN_NODE_VERSION} required. Found: $(node -v)"
fi
step "Node.js $(node -v)"

# npm
if ! command -v npm &> /dev/null; then
  error "npm not found."
fi
step "npm $(npm -v)"

# git
if ! command -v git &> /dev/null; then
  error "git not found."
fi
step "git found"

echo ""

# ─── Clone or Pull ──────────────────────────────────────────
if [[ "$IS_UPDATE" == true ]]; then
  info "Pulling latest changes..."
  cd "$INSTALL_DIR"
  git pull --quiet origin main 2>/dev/null || git pull --quiet 2>/dev/null
  step "Repository updated"
else
  info "Cloning repository..."
  REPO_URL=$(detect_repo_url)
  dim "  ${REPO_URL}"
  git clone --quiet "$REPO_URL" "$INSTALL_DIR"
  step "Cloned to ${INSTALL_DIR}"
fi

echo ""

# ─── Install & Build ────────────────────────────────────────
info "Building..."
cd "$INSTALL_DIR"

npm install --silent --no-fund --no-audit 2>/dev/null
step "Dependencies installed"

npm run build --silent 2>/dev/null
step "Build complete"

echo ""

# ─── Link binary ────────────────────────────────────────────
info "Setting up PATH..."

mkdir -p "$BIN_DIR"
chmod +x "$INSTALL_DIR/dist/index.js"
ln -sf "$INSTALL_DIR/dist/index.js" "$BIN_PATH"
step "Linked to ${BIN_PATH}"

ensure_path
echo ""

# ─── Verify ─────────────────────────────────────────────────
if command -v codeaudit &> /dev/null; then
  VERSION=$(codeaudit --version 2>/dev/null || echo "unknown")
  success "codeaudit ${VERSION} installed successfully!"
else
  success "codeaudit installed to ${BIN_PATH}"
  warn "Restart your terminal or run: export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo ""
dim "  Usage:"
dim "    codeaudit doctor          Check your environment"
dim "    codeaudit run health      Run a health audit"
dim "    codeaudit run practices   Run best practices check"
dim "    codeaudit --help          See all commands"
echo ""
dim "  To update:    curl -fsSL <install-url> | bash"
dim "  To uninstall: rm -rf ~/.codeaudit ~/.local/bin/codeaudit"
echo ""
