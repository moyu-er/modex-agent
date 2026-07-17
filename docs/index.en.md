---
title: Home
description: A modular, composable, production-ready Python Agent framework.
template: home.html
hide:
  - navigation
  - toc

# ==========================================================================
# Landing-page string map — the ONLY source of homepage copy.
# overrides/home.html reads every user-visible string via page.meta.home.*.
# Adding a locale = copying this file as index.<lang>.md and translating the
# values below. Zero template changes required.
#
# Conventions:
#   headline_lead / headline_accent / headline_tail — the accent part is
#     rendered inside the teal-highlighted <span>; lead and tail flank it.
#     Translators may redistribute words across the three fields freely.
#   icon — structural key (graph|shield|hub|layers|term|web), do NOT translate.
#   hot  — highlights the pipeline core chip in the architecture strip.
# ==========================================================================
home:
  # ---- Hero (Variant A, centered stage) ---------------------------------
  hero:
    shape_label: "MODEX · AGENT"
    # Per-shape pill labels for the particle morph cycle (T4). Optional map:
    # omit in a locale to keep the initial shape_label for every shape.
    shape_labels:
      hub: "FRAMEWORK — AGENT HUB"
      knight: "MODEXBOT — PRAISE THE SUN"
      puzzle: "PLUGIN — PLUGGABLE ECOSYSTEM"
    kicker: "Actively developed · core interfaces stabilizing"
    headline_lead: "Build agents like"
    headline_accent: "building blocks"
    headline_tail: "."
    sub: >-
      ModexAgent is a modular, composable Python framework for AI agent
      systems — graph-driven ReAct, interruptible approval, multi-agent
      collaboration, and a browser WebUI. Don't reinvent wheels. Connect them.
    cta_primary: "Get Started"
    cta_primary_aria: "Read the Get Started guide"
    cta_ghost: "GitHub"
    cta_ghost_aria: "ModexAgent on GitHub, opens in a new tab"
    scroll_hint: "SCROLL"
    badges:
      - { label: "python",  value: "≥ 3.12" }
      - { label: "license", value: "MIT" }
      - { label: "mypy",    value: "strict" }
      - { label: "ui",      value: "React WebUI" }

  # ---- Features grid (6 cards) ------------------------------------------
  features:
    tag: "Features"
    title: "Core capabilities"
    desc: "Every layer is pluggable — take what you need, replace what you don't."
    # NB: key is `cards`, not `items` — `items` collides with dict.items in Jinja
    cards:
      - icon: graph
        title: "Graph-driven ReAct"
        desc: "Execution modeled as Graph + Node + Edge. Interrupt mid-run, persist state, resume exactly where it stopped."
      - icon: shield
        title: "Interruptible Approval"
        desc: "Sensitive tool calls pause for a human go-ahead. Tiered policies, cascade cancel, off by default."
      - icon: hub
        title: "Multi-Agent Collaboration"
        desc: "Strict star topology per pool, peer messaging across pools. One send_to_agent tool — the framework routes."
      - icon: layers
        title: "Multi-tier Memory"
        desc: "Session, Archive, Knowledge and Experience layers. The Dream Engine consolidates archives into knowledge."
      - icon: term
        title: "Cross-platform Terminal"
        desc: "WinPTY, ConPTY, pexpect and tmux behind one interface. Visible and headless PTY modes."
      - icon: web
        title: "Browser WebUI"
        desc: "React + Vite frontend: streaming chat, TodoPanel, per-turn model picker, in-browser config editor."

  # ---- Architecture strip ------------------------------------------------
  arch:
    tag: "Architecture"
    title: "One pipeline, every channel"
    desc: "I/O adapters are fully decoupled from agent logic."
    rows:
      - chips:
          - { label: "QQ" }
          - { label: "Telegram" }
          - { label: "CLI" }
          - { label: "WebUI · WebSocket" }
      - chips:
          - { label: "InputAdapter / OutputAdapter" }
      - chips:
          - { label: "AgentPipeline — Context → ReAct → Tools", hot: true }
      - chips:
          - { label: "MessageBroker" }
      - chips:
          - { label: "AgentPool" }
          - { label: "SubagentManager" }
          - { label: "InboxMQ" }

  # ---- Get Started teaser (installer-first) ------------------------------
  getstarted:
    tag: "Get Started"
    title: "Running in three minutes"
    desc: "ModexBot ships as an installer package — no Python toolchain required."
    steps:
      - num: "01"
        title: "Download"
        desc: "Grab the latest ModexBot installer package from GitHub Releases."
      - num: "02"
        title: "Run the installer"
        desc: "One idempotent script bootstraps the runtime, config and adapters — safe to re-run."
      - num: "03"
        title: "Launch the WebUI"
        desc: "Start ModexBot and open the browser console. QQ and Telegram adapters ship out of the box."
    cta: "Full installation guide"
    cta_aria: "Open the Installation page"

  # ---- Extras chips --------------------------------------------------------
  extras:
    tag: "Modular"
    title: "Install only what you need"
    desc: "Optional capability packs for framework development — pull in one extra, or everything."
    chips:
      - "llm"
      - "sandbox"
      - "gateway"
      - "skills"
      - "terminal"
      - "all"

  # ---- Final CTA band ------------------------------------------------------
  final:
    title_lead: "Don't reinvent wheels."
    title_accent: "Connect them."
    sub: "Mod · Nexus · Agent — star the repo and start assembling your agent system."
    cta: "Star on GitHub"
    cta_aria: "Star ModexAgent on GitHub, opens in a new tab"

  # ---- External URLs --------------------------------------------------------
  urls:
    repo: "https://github.com/moyu-er/ModexAgent"
---

<!-- Rendered by overrides/home.html — all copy lives in the frontmatter home: map above. -->
