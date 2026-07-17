---
title: Memory
description: The memory tiers, scopes, and self-learning loops that let ModexAgent remember across turns, sessions, and users.
---

# Memory

An agent that forgets everything between turns is a chatbot with tools. ModexAgent gives agents layered memory, so short turns add up to long-term competence.

## The tiers

| Tier | Purpose |
|------|---------|
| Session | The active conversation's working memory. |
| Archive | Long-term storage for history that has left the session window. |
| Knowledge | Durable, distilled knowledge the agent can draw on later. |
| UserRetentionBuffer | Retains user-scoped memory beyond a single session. |
| Pruned | A catalog of messages removed by cleanup, so the model still knows what was taken out. |
| Experience | Reusable lessons written as EXPERIENCE.md reference files. |

A few tiers deserve a closer look.

**Pruned** works independently of the archive. When cleanup prunes messages, they are written to a `pruned/{session_id}/` catalog, and an injection policy feeds that catalog back to the model as XML. Every agent, main or subagent, gets this injection, so pruning never creates silent holes in context.

**Experience** is written, not just stored. The `ExperienceReviewAgent`, itself a ReAct agent, reviews conversations and creates or updates EXPERIENCE.md files, turning one-off interactions into reference knowledge the agent can consult on later tasks.

## Scopes: who a memory belongs to

Every memory carries a scope that decides who shares it. Available scopes include Session, User, Tenant, Agent, Channel, Chat, Composite, and Global, with SessionScope, UserScope, and GlobalScope as the common cases. A fact stored at User scope follows the user across sessions; a Session-scoped fact dies with the conversation.

## Compression vs. governance

Two very different processes shape what the model sees, and mixing them up corrupts memory.

!!! warning "Governance output is never written back"
    **Compression** mutates persisted session and archive memory through lifecycle hooks. **Governance** mutates only the copy sent to the LLM before a model call; its output is never written back to the session. Governance is a lens on memory, not an editor of it.

One structural invariant applies everywhere: tool-call chains must stay legal. An `assistant` message with `tool_calls` must never be separated from its matching `tool` results, or the model API will reject the context.

## The Dream Engine

Over time, archives pile up. The **Dream Engine** consolidates archived history into the Knowledge tier, so what the agent has done becomes what the agent knows. Together with the ExperienceReviewAgent, it closes the self-learning loop: sessions feed archives, archives feed knowledge, and conversations feed experience.

## Subagent memory

Subagents run leaner. `archive=None` is the standard session-only mode: a subagent's session memory is temporary and cleared when the subagent finishes, and its injection policy is restricted to a narrow context window. Long-term remembering is the main agent's job.

## Where to next

- Memory feeds the LLM node of the [Graph Engine](graph-engine.md) on every pass.
- Subagent isolation is part of the [Multi-Agent](multi-agent.md) star topology.
- See memory in action by running the bot in [Get Started](../../get-started.md).
