---
title: Modern CLI Tools
sidebar_position: 3
---

# Modern CLI Tools for Multi-Agent Workflows

Managing parallel agent sessions, rapid context switching across worktrees, and quick file edits without breaking flow—modern CLI tools eliminate friction that accumulates across dozens of daily operations. These tools complement agent workflows with better defaults, richer information, and ergonomic interfaces.

**Four categories:** Text editing (micro), file navigation (eza, yazi, fzf), and git operations (lazygit) address the most frequent CLI tasks in multi-agent development workflows.

## Text Editing

### micro

[**micro**](https://micro-editor.github.io/) is a Go-based terminal text editor that brings GUI-like keybindings to the command line. Single binary, no dependencies, cross-platform support.

**Key differentiators:** Ctrl+S to save, Ctrl+Q to quit, Ctrl+F to find—no modal editing or memorization required. Syntax highlighting for 130+ languages out of box. Multi-cursor support (Sublime-style) for parallel editing. Lua plugin system for extensibility. Integrated terminal and mouse support for hybrid keyboard/mouse workflows.

**Best suited for:** Developers needing quick edits in agent context without switching to IDE. Engineers who find Vim's modal editing overhead for one-line changes. Users wanting terminal editing with familiar modern editor keybindings (coming from VSCode, Sublime, or similar GUI editors).

**Trade-offs:** Feature-minimal compared to IDEs—no LSP integration, limited refactoring tools, basic navigation. Not as powerful as Vim/Neovim for complex multi-file operations or advanced text object manipulation. For large files (1000+ lines) or deep code exploration, IDE remains superior tool choice.

**vs Vim:** No modal editing learning curve enables instant productivity. Trade: less powerful for macro operations and text object manipulation at scale.

**vs Nano:** More sophisticated feature set—multi-cursor editing, plugin ecosystem, better syntax highlighting for code. Better suited for actual development work rather than simple config edits.

**Installation:**

```bash
# macOS
brew install micro

# Linux (binary)
curl https://getmic.ro | bash

# Cross-platform (Go)
go install github.com/zyedidia/micro/cmd/micro@latest
```

Requirements: None (static binary). Optional: clipboard support via xclip/xsel on Linux.

## File Navigation

### eza

[**eza**](https://eza.rocks/) is a Rust-based ls replacement, actively maintained fork of the unmaintained exa project. Fast, feature-rich, with better defaults than traditional ls.

**Key differentiators:** Colors for file types and permissions by default. Git integration shows per-file status (`--git`) or per-directory repository state (`--git-repos`). Human-readable file sizes in long format without flags. Tree view (`--tree`), icons support (`--icons`), and hyperlink support for terminal emulators. Fixes Grid Bug from exa that caused rendering issues.

**Best suited for:** Developers working across git worktrees who need instant branch status visibility. Engineers wanting better ls defaults without heavy configuration overhead. Users comfortable with modern Rust tooling ecosystem and willing to install additional dependencies.

**Trade-offs:** More dependencies than ls (Rust binary, optional Nerd Fonts for icons). Some features need configuration (icon support requires compatible fonts). Slightly longer learning curve for advanced options, though defaults work well immediately.

**vs ls:** Colors, git status visibility, human-readable sizes by default. Better information density without memorizing flags.

**vs exa:** Actively maintained (exa development stopped), security patches, bug fixes (Grid Bug), feature parity plus hyperlinks and bright color support.

**Installation:**

```bash
# macOS
brew install eza

# Cargo (Rust)
cargo install eza

# Linux package managers
sudo apt install eza      # Debian/Ubuntu
sudo pacman -S eza        # Arch
```

Requirements: None (static binary). Optional: Nerd Fonts for icon support (`--icons`).

### yazi

[**yazi**](https://yazi-rs.github.io/) is a Rust-based terminal file manager with full asynchronous I/O and multi-threaded CPU task distribution. Currently in public beta, suitable as daily driver.

**Key differentiators:** Full asynchronous architecture keeps UI responsive during heavy operations (large directories, remote filesystems). Rich preview support for images (Kitty, Sixel, iTerm2, WezTerm protocols), videos, PDFs, archives, and code with syntax highlighting via built-in integration. Lua-based plugin system with package manager for extensibility. Vim-like keybindings with visual mode, multi-tab support, and auto-completion. Client-server architecture with pub-sub model enables cross-instance communication. Integrates with ripgrep, fd, fzf, and zoxide for enhanced workflows.

**Best suited for:** Developers navigating complex directory structures who need rich file previews without leaving terminal. Engineers working with remote filesystems where responsiveness matters (async I/O prevents UI freezing). Users wanting Vim-like file management with extensive customization (Lua plugins, themes, custom previewers).

**Trade-offs:** Currently in public beta—stable enough for daily use but evolving rapidly. More complex than simpler tools like nnn (which is tiny, nearly 0-config). Learning curve for Vim keybindings if coming from traditional file managers. Lacks "undo" feature that Vifm provides.

**vs Ranger:** Significantly faster (Rust vs Python architecture). Asynchronous I/O prevents UI freezing on heavy operations.

**vs lf:** Both fast and async-capable (lf written in Go). Yazi offers richer built-in preview support and plugin ecosystem.

**vs nnn:** nnn is smaller, faster to start, nearly 0-config. Yazi trades simplicity for rich features (previews, plugins, advanced async task management).

**Installation:**

```bash
# macOS
brew install yazi

# Cargo (Rust)
cargo install --locked yazi-fm yazi-cli

# Linux package managers
sudo pacman -S yazi       # Arch
```

Requirements: None (static binary). Optional: Überzug++ or similar for advanced image preview, ffmpegthumbnailer for video thumbnails, fd/ripgrep/fzf/zoxide for enhanced integration.

### fzf

[**fzf**](https://junegunn.github.io/fzf/) is a Go-based fuzzy finder that processes millions of items instantly. Single binary, 11+ years mature (since 2013), widely adopted as the standard fuzzy CLI tool.

**Key differentiators:** Shell integration provides Ctrl+R (history search), Ctrl+T (file search), Alt+C (directory navigation), and `**<TAB>` (fuzzy completion for any command). Vim/Neovim integration via fzf.vim and fzf-lua plugins. Tmux integration via fzf-tmux wrapper for popup windows. Preview window support shows file contents or git diffs during selection. Highly customizable via environment variables (FZF_DEFAULT_OPTS, FZF_DEFAULT_COMMAND). Pipe-friendly architecture works with any command output.

**Best suited for:** Developers navigating large codebases who need instant file/symbol location without IDE context switches. Engineers with heavy shell usage for command history search and script selection. Users wanting fuzzy selection everywhere—git branches, docker containers, kubernetes pods, process lists.

**Trade-offs:** Requires shell setup script for full power (Ctrl+R, Ctrl+T, `**<TAB>` bindings). Learning curve for advanced customization (environment variables, preview commands, custom key bindings). Power comes from integration with other tools—standalone usage provides limited value.

**vs traditional find/grep:** Interactive visual feedback with instant results. Fuzzy matching reduces need for exact pattern specification.

**Installation:**

```bash
# macOS
brew install fzf
$(brew --prefix)/opt/fzf/install  # Shell integration

# Git clone
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install

# Linux package managers
sudo apt install fzf      # Debian/Ubuntu
sudo pacman -S fzf        # Arch
```

Requirements: None (static binary). Shell integration script essential for full functionality.

:::tip fzf Shell Integration
Full fzf power requires shell integration. After installation, run:

```bash
$(brew --prefix)/opt/fzf/install  # macOS Homebrew
~/.fzf/install                     # Git installation
```

Enables: Ctrl+R (history), Ctrl+T (files), Alt+C (cd), `**<TAB>` (completion)
:::

## Git Operations

### lazygit

[**lazygit**](https://github.com/jesseduffield/lazygit) is a Go-based Git TUI (terminal user interface) for visual branch management, interactive staging, and commit navigation. Cross-platform with extensive customization options.

**Key differentiators:** Visual branch tree shows repository topology without command memorization. Interactive staging supports hunk selection and individual line staging. Commit navigation browses history with inline diffs. Customizable keybindings via YAML config. Mouse support for clicking to select, scrolling through commits. Multi-worktree awareness for parallel branch development.

**Best suited for:** Developers managing multi-worktree workflows who need visual branch context. Engineers doing complex interactive rebases, cherry-picks, and merges. Users wanting git discoverability via menu-driven interface instead of command memorization.

**Trade-offs:** Performance degrades on massive repositories (Linux kernel: 57s load time, 2.6GB RAM usage). Not a replacement for all git commands—some operations faster via raw CLI. Learning curve for keybindings, though discoverable via built-in help menu.

**vs raw git:** Visual interface reduces command memorization burden. Complex operations (rebase, cherry-pick) easier with interactive UI.

**vs gitui:** More mature ecosystem (plugins, community integrations) but slower on massive repos. gitui benchmarks: 24s load time, 0.17GB RAM on Linux kernel.

**vs tig:** Significantly faster (57s vs 4m20s on Linux kernel). More interactive—tig focuses on browsing, lazygit enables full git workflows.

**Installation:**

```bash
# macOS
brew install lazygit

# Go
go install github.com/jesseduffield/lazygit@latest

# Windows
scoop install lazygit

# Linux package managers
sudo apt install lazygit     # Debian/Ubuntu
sudo pacman -S lazygit       # Arch
```

Requirements: git. Optional: custom config in `~/.config/lazygit/config.yml`.

## Philosophy: Mix CLI and UI Tools

Don't be dogmatic about terminal-only or GUI-only workflows. IDEs remain the best tools for code navigation, symbol search, and viewing large files. CLI excels at quick edits, git operations, and managing parallel sessions.

**Use the best tool for each task:**

- **Code navigation and exploration:** IDE (VS Code, IntelliJ, etc.) - superior symbol search, go-to-definition, call hierarchies
- **Quick edits in agent context:** CLI (micro, vim) - faster than switching to IDE for one-line changes
- **Git operations across worktrees:** CLI (lazygit, raw git commands) - better visibility into multiple branches
- **Reading large files or complex logic:** IDE - better syntax highlighting, folding, and navigation

Pragmatism beats purism. These are all just tools—choose based on efficiency, not ideology.

---

**Related Course Content:**

- [Lesson 7: Planning & Execution](/docs/practical-techniques/lesson-7-planning-execution) - Multi-worktree workflows leveraging these CLI tools
- [Developer Tools: Terminals](/developer-tools/terminals) - Terminal recommendations for running these CLI tools efficiently
- [Developer Tools: MCP Servers](/developer-tools/mcp-servers) - Extend CLI agents with code research and web grounding
