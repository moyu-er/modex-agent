---
title: Installation
description: Install ModexBot on Windows with the installer, or run from source on macOS, Linux, and Windows.
---

# Installation

This page covers installing **ModexBot**, the reference bot application built on the ModexAgent framework, with its WebUI included.

!!! warning "Important: what v1 distributes"
    Version 1 distributes the **ModexBot application** only. The **ModexAgent framework itself is not yet published as a standalone installable package** (no PyPI release). If you want the framework for your own project, clone the [source repository](https://github.com/moyu-er/ModexAgent) and work from `src/modex_agent/` directly.

## Windows: Installer (recommended)

The installer bundles everything: Python runtime, all dependencies, the WebUI frontend, and a desktop shell. No prerequisites, and no internet connection is needed during installation.

1. **Download.** Go to [Releases](https://github.com/moyu-er/ModexAgent/releases/latest) and download `ModexBot-Setup-1.0.0-dev.exe` (~100 MB).
2. **Install.** Double-click the downloaded `.exe` and follow the wizard. It installs to `%LOCALAPPDATA%\Programs\ModexBot\` — no admin rights needed.
3. **Launch.** Double-click the "ModexBot" desktop shortcut, or find it in the Start Menu. The bot starts and the WebUI opens in a dedicated desktop window — with a system-tray icon and background health monitoring — rather than a plain browser tab. Prefer the browser? Use the Start Menu "ModexBot (Browser)" entry instead.
4. **Configure.** On first launch the WebUI opens automatically. Open **Settings** and enter your model API key (DeepSeek, OpenAI, and more are supported).

!!! note "Development release"
    `v1.0.0-dev` is the first development release. It is fully usable, but APIs, configuration layout, and packaging may still change before the stable 1.0.0.

!!! tip "Browser-only build"
    The desktop window is a Tauri shell bundled by default. If you build your own installer from source, `build.bat --skip-tauri` produces a browser-only variant without it.

## macOS / Linux / Developers: From source

There is no installer for macOS or Linux yet. Run from source instead (this path also works on Windows):

```bash
git clone https://github.com/moyu-er/ModexAgent.git
cd ModexAgent/examples/bot_project

# Windows
install.bat

# Linux / macOS
chmod +x install.sh && ./install.sh
```

The setup script auto-installs `uv` and Node.js if they are missing, creates the Python environment, builds the WebUI, and registers the `modexbot` command on your PATH. Then:

```bash
modexbot start
```

Open [http://localhost:21800/webui/](http://localhost:21800/webui/) in your browser.

!!! tip "Detailed guide"
    For step-by-step instructions and troubleshooting, see
    [docs/bot-local-setup.md](https://github.com/moyu-er/ModexAgent/blob/main/docs/bot-local-setup.md)
    in the source repository.

## Command-line reference

After installation, `modexbot` is available from any terminal:

| Command | Action |
|---------|--------|
| `modexbot start` | Start the bot |
| `modexbot stop` | Stop the bot |
| `modexbot restart` | Restart the bot |
| `modexbot status` | Show running status (PID, port, uptime, memory) |
| `modexbot install` | Build or rebuild the WebUI frontend (`-f` to force) |
| `modexbot logs -f` | Follow live logs |
| `modexbot config` | Run the config wizard |
| `modexbot model` | Model settings |

## Configuration files

ModexBot splits configuration across several files. None of them require
hand-editing — the WebUI Settings tabs and the `modexbot config` / `modexbot
model` wizards cover everything — but knowing the layout helps for
troubleshooting.

| File | Holds | Edited via |
|------|-------|-----------|
| `.env` | Only `TIMEZONE` (e.g. `Asia/Shanghai`). | Hand-edit |
| `config/model.yml` | Model providers, API keys, default model. Shared across all pools. | WebUI **Models** tab or `modexbot model` |
| `config/im.yml` | IM adapter credentials (QQ, Telegram). Gitignored. | WebUI **IM** tab |
| `config/bot_config.yml` | Cross-cutting: WebUI port, workspace, safety timeouts, observability. | Hand-edit or WebUI |
| `config/pools/<name>/pool.yml` | Per-pool agents, tools, approval, peers. | WebUI **Pools** tab |
| `config/mcp/registry.json` | MCP server registry. Gitignored. | WebUI **MCP** tab |

!!! tip "Configurable port"
    The WebUI port defaults to `21800` (set in `config/bot_config.yml` under
    `webui.port`). Override it with the `MODEXBOT_PORT` environment variable if
    you need a different port.

## Uninstall

On Windows, uninstall via **Add/Remove Programs**. Config files that hold secrets (`.env`, `config/model.yml`, `config/im.yml`) are preserved, so reinstalling picks up where you left off.

## Next steps

- [Get Started](get-started.md): first launch, API key setup, and a WebUI tour.
- [Graph Engine](docs/concepts/graph-engine.md): the execution model under the hood.
- [Multi-Agent](docs/concepts/multi-agent.md): pools, subagents, and peer messaging.
- [Memory](docs/concepts/memory.md): how the bot remembers across sessions.
