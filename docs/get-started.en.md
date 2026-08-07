---
title: Get Started
description: Launch ModexBot, add your model API key, and have your first conversation in the WebUI.
---

# Get Started

This guide takes you from a fresh install to your first conversation with ModexBot.

!!! note "Prerequisite"
    ModexBot must be installed first. See [Installation](installation.md) for the Windows installer or the from-source path.

## First launch

Start the bot:

- **Windows (installer):** double-click the "ModexBot" desktop shortcut or Start Menu entry. The bot starts and the WebUI opens in a dedicated desktop window, with a system-tray icon for quick show/hide. Prefer a plain browser? Use the Start Menu "ModexBot (Browser)" entry instead.
- **Any platform (terminal):** run `modexbot start`, then open [http://localhost:21800/webui/](http://localhost:21800/webui/) in your browser.

The desktop window shows the WebUI directly — there is nothing else to open. From the browser, use the URL above.

## Add your model API key

The bot needs at least one model provider before it can reply.

1. Open **Settings** in the WebUI.
2. Go to the **Models** tab.
3. Enter your provider and API key. DeepSeek, OpenAI, and other OpenAI-compatible providers are supported.
4. Save. You can define several providers and models here and switch between them later.

Prefer the terminal? `modexbot model` (or `modexbot config`) runs an interactive wizard that writes the same model config.

## A quick tour of the WebUI

- **Streaming chat.** Agent output renders incrementally as it is generated, with reasoning blocks, Markdown, syntax-highlighted code, and mermaid diagrams inline.
- **TodoPanel.** When the agent breaks work into steps, a side panel tracks the live task list so you can follow progress without prompting.
- **Per-turn model selector.** Pick the provider and model in the chat composer before each message. Models are defined once and shared across pools.
- **Pool selector.** A dropdown in the sidebar picks the active pool for a new conversation — `default`, `coder`, or `opencode` ship out of the box. Each conversation is pinned to its pool.
- **Workspace browser.** A modal directory browser lets you switch between live workspaces without leaving the UI (`/cd` does the same in IM chats). Switching mutates only a per-session pointer — no `os.chdir`, no restart.
- **In-browser config editor.** Edit pools, models, MCP servers, skills, IM credentials, and system prompts from Settings. No YAML hand-editing.
- **Session tree.** Conversations are fully isolated, with parent/child branches per session, and past sessions reload from history.
- **Attachments.** Upload files in the composer; the agent can read them, and you can download results back. Uploads are safety-gated by type, content sniffing, and size — images up to 20 MB and other files up to 10 MB by default.
- **Light and dark themes.** Toggle from the sidebar.

## Your first conversation

Type a message in the composer and press send. A good first prompt:

```text
Introduce yourself and tell me what you can do.
```

From there, try something that uses tools, for example asking the bot to look at a file in your workspace or run a small command. Tool approval is opt-in per pool — off unless enabled in Settings → Pools or the pool config — and the bundled `default` and `coder` pools ship with it enabled for writes outside the project. When approval is on, the agent pauses before risky changes and asks for your go-ahead; approve with one click in the WebUI or reply `/approve` (or `/deny`) in chat.

## What to explore next

- [Graph Engine](docs/concepts/graph-engine.md): how the graph-driven ReAct engine runs, suspends, and resumes.
- [Multi-Agent](docs/concepts/multi-agent.md): pools, star-topology subagents, and cross-pool peer messaging.
- [Memory](docs/concepts/memory.md): the multi-tier memory system and self-learning experience loop.
