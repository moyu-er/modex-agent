---
title: Installation
description: Install ModexBot on Windows with the installer, or run from source on macOS, Linux, and Windows.
---

# Installation

This page covers installing **ModexBot**, the reference bot application built on the ModexAgent framework, with the browser WebUI included.

!!! warning "Important: what v1 distributes"
    Version 1 distributes the **ModexBot application** only. The **ModexAgent framework itself is not yet published as a standalone installable package** (no PyPI release). If you want the framework for your own project, clone the [source repository](https://github.com/moyu-er/ModexAgent) and work from `src/modex_agent/` directly.

## Windows: Installer (recommended)

The installer bundles everything: Python runtime, all dependencies, and the WebUI frontend. No prerequisites, and no internet connection is needed during installation.

1. **Download.** Go to [Releases](https://github.com/moyu-er/ModexAgent/releases/latest) and download `ModexBot-Setup-x.x.x.exe`.
2. **Install.** Double-click the downloaded `.exe` and follow the wizard. No admin rights needed.
3. **Launch.** Double-click the "ModexBot" desktop shortcut, or find it in the Start Menu.
4. **Configure.** On first launch the WebUI opens automatically. Open **Settings** and enter your model API key (DeepSeek, OpenAI, and more are supported).

!!! note "No release yet?"
    If the Releases page has no installer published yet, use the from-source path below. The installer lands with the first release.

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
| `modexbot logs -f` | Follow live logs |
| `modexbot config` | Run the config wizard |
| `modexbot model` | Model settings |

## Uninstall

On Windows, uninstall via **Add/Remove Programs**. Your config files (API keys, and so on) are preserved, so reinstalling picks up where you left off.

## Next steps

- [Get Started](get-started.md): first launch, API key setup, and a WebUI tour.
- [Graph Engine](concepts/graph-engine.md): the execution model under the hood.
- [Multi-Agent](concepts/multi-agent.md): pools, subagents, and peer messaging.
- [Memory](concepts/memory.md): how the bot remembers across sessions.
