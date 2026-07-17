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

- **Windows (installer):** double-click the "ModexBot" desktop shortcut or Start Menu entry.
- **Any platform (terminal):** run `modexbot start`.

Then open [http://localhost:21800/webui/](http://localhost:21800/webui/) in your browser. The Windows installer opens the WebUI automatically on first launch.

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
- **In-browser config editor.** Edit pools, models, MCP servers, skills, and system prompts from Settings. No YAML hand-editing.
- **Session tree.** Conversations are fully isolated, with parent/child branches per session, and past sessions reload from history.
- **Attachments.** Upload files in the composer; the agent can read them, and you can download results back.
- **Light and dark themes.** Toggle from the sidebar.

## Your first conversation

Type a message in the composer and press send. A good first prompt:

```text
Introduce yourself and tell me what you can do.
```

From there, try something that uses tools, for example asking the bot to look at a file in your workspace or run a small command. If tool approval is enabled for the agent, it will pause before risky changes and ask for your go-ahead; approve with one click in the WebUI or reply `/approve` in chat.

## What to explore next

- [Graph Engine](docs/concepts/graph-engine.md): how the graph-driven ReAct engine runs, suspends, and resumes.
- [Multi-Agent](docs/concepts/multi-agent.md): pools, star-topology subagents, and cross-pool peer messaging.
- [Memory](docs/concepts/memory.md): the multi-tier memory system and self-learning experience loop.
