---
title: Memory
description: The memory tiers, scopes, storage contracts, and self-learning loops that let ModexAgent remember across turns, sessions, and users.
---

# Memory

An agent that forgets everything between turns is a chatbot with tools.
ModexAgent gives agents layered memory, so short turns add up to long-term
competence.

## The tiers

| Tier | Purpose |
|------|---------|
| Session | The active conversation's working memory. |
| Archive | Long-term storage for history that has left the session window. |
| Core Memory | Durable, distilled knowledge the agent manages in-context — `SOUL.md` (agent identity), `USER.md` (user profile), `MEMORY.md` (distilled facts). |
| Pruned | A catalog of messages removed by cleanup, so the model still knows what was taken out. |
| Experience | Reusable lessons written as `EXPERIENCE.md` reference files. |

!!! note "Core Memory, not Knowledge"
    This tier was renamed from "Knowledge" to **Core Memory** to keep it
    distinct from retrieval-style knowledge bases. The XML tag values
    (`<your_identity>`, `<user_profile>`, `<known_facts>`) and the file names
    (`SOUL.md` / `USER.md` / `MEMORY.md`) are **not** renamed — they are
    agent-facing prompt artifacts and user workspace data.

### Core Memory vs. KnowledgeBase

These two concepts are easy to conflate. They are distinct:

| | Core Memory | KnowledgeBase |
|---|---|---|
| What | Agent identity, user profile, distilled facts | Retrievable domain knowledge (RAG corpus, FAQ, reference data) |
| Where | In-context — always injected into the system prompt | Out-of-context — retrieved on demand via search / tool / injection |
| Managed by | The agent itself, through scoped file tools | Typically shared across agents or scoped to a pool / workspace |
| Aligned with | Letta's "Core Memory" (`persona` + `human` blocks) | LangChain / LlamaIndex / mem0's RAG-vs-Memory distinction |

The framework deliberately does **not** ship a KnowledgeBase abstraction:
retrieval over domain knowledge is an application-layer concern, not a memory
tier. Core Memory is the in-context half of the distinction, and it is the
half ModexAgent owns.

### Pruned: no silent holes

Pruned works **independently of the archive**. When cleanup prunes messages,
they are written to a `pruned/{session_id}/` catalog, and an injection policy
feeds that catalog back to the model as XML at **priority 85**. Every agent —
main or subagent — gets this injection, so pruning never creates silent holes
in context.

### Experience: written, not just stored

The `ExperienceReviewAgent`, itself a ReAct agent, reviews conversations and
creates or updates `EXPERIENCE.md` files, turning one-off interactions into
reference knowledge the agent can consult on later tasks. The experience layer
is injected as `<available_experiences>` XML.

## Long-term memory is opt-in

Session memory, compaction, and the pruned catalog are always on. The two
long-term layers — Archive and Core Memory — ship **off by default**, because
they are the layers that accumulate without bound. Enabling them is a per-pool
decision, toggled in `pool.yml`:

```yaml
memory:
  archive_enabled: true
  core_enabled: true
```

`core_enabled` requires `archive_enabled` — Core Memory is fed by archive
consolidation, so enabling it without the archive is a configuration error.
The same toggles are editable in the WebUI Pool Editor and persisted back to
`pool.yml`. The Dream Engine (below) runs only when both layers are on.

## Scopes: who a memory belongs to

Every memory carries a scope that decides who shares it. Available scopes
include Session, User, Tenant, Agent, Channel, Chat, Composite, and Global,
with `SessionScope`, `UserScope`, and `GlobalScope` as the common cases. A fact
stored at User scope follows the user across sessions; a Session-scoped fact
dies with the conversation.

## Storage contract: split store ABCs

Memory storage is backend-pluggable through **split store ABCs** (per
[ADR-0023](https://github.com/moyu-er/ModexAgent/blob/main/docs/adr/0023-hybrid-persistence-sqlite-plus-file.md)).
Four focused interfaces replace the old monolithic storage god-interface:

| ABC | Responsibility |
|-----|---------------|
| `MessageStore` | Session messages — append, read, prune, soft-delete |
| `KVStore` | Key-value pairs (core memory blocks, cursors) |
| `CursorStore` | Read cursors for archive consumers |
| `ArchiveStore` | Long-term archive documents |

A `MemoryStoreBundle` composes all four into one frozen value returned by the
storage registry. Two backends ship:

- **File** (framework default) — one `DefaultScopedStorage` implements all four
  interfaces over per-scope directories.
- **SQLite** (bot default) — four independent `Sqlite*Store` adapters, one per
  ABC, backed by the per-workspace `state.db`.

Switching backends is a config flag (`persistence.backend`); no data migrates
automatically — users opt in.

## Compression vs. governance

Two very different processes shape what the model sees, and mixing them up
corrupts memory.

!!! warning "Governance output is never written back"
    **Compression** mutates persisted session and archive memory through
    lifecycle hooks. **Governance** mutates only the copy sent to the LLM before
    a model call; its output is never written back to the session. Governance is
    a lens on memory, not an editor of it.

Compression runs as a hook-driven cleanup pipeline. When a session crosses its
token threshold, cleanup picks a tool-chain-safe prune boundary, generates a
structured compact summary, commits `[compact_summary]` plus the kept tail
back to the session, writes the pruned catalog, and — only when the archive
layer is enabled — generates archive documents. `CLEANUP_TRIGGERED` and
`CLEANUP_FINISHED` hooks fire around this pipeline; the bot uses them, for
example, to re-orient the agent's todo list after a prune.

One structural invariant applies everywhere: tool-call chains must stay legal.
An `assistant` message with `tool_calls` must never be separated from its
matching `tool` results, or the model API will reject the context. Compression
honors this — if a boundary would split a tool chain, the whole chain is
evicted (archived), never partially kept.

## The Dream Engine: closing the self-learning loop

Over time, archives pile up. The **Dream Engine** consolidates archived history
into Core Memory, so what the agent has done becomes what the agent knows. It
is the only path from archive to Core Memory — nothing else writes
consolidation results. Together with the `ExperienceReviewAgent`, it closes
the self-learning loop:

```mermaid
flowchart LR
    S["Sessions"] -->|compression| A["Archive"]
    A -->|Dream Engine<br/>consolidation| C["Core Memory<br/>SOUL · USER · MEMORY"]
    S -->|ExperienceReviewAgent| E["Experience<br/>EXPERIENCE.md"]
    C -->|injected at priority 100| LLM["LLM context"]
    E -->|injected as XML| LLM
```

Sessions feed archives, archives feed Core Memory, and conversations feed
Experience — all three flow back into the LLM context on every turn.

## Subagent memory

Subagents run leaner. `archive=None` is the standard session-only mode: a
subagent's session memory is temporary and cleared when the subagent finishes,
and its injection policy is restricted to a narrow context window. Subagents
do not carry the `memory` toggle — they are session-only by construction.
Long-term remembering is the main agent's job.

## Where to next

- Memory feeds the LLM node of the [Graph Engine](graph-engine.md) on every pass.
- Subagent isolation is part of the [Multi-Agent](multi-agent.md) star topology.
- See memory in action by running the bot in [Get Started](../../get-started.md).
