---
title: Graph Engine
description: How ModexAgent models agent execution as a graph, and why that makes suspension, approval, and runaway-loop control natural.
---

# Graph Engine

Most agent frameworks are built around a loop: call the model, run the tools it asks for, feed the results back, repeat until done. ModexAgent replaces that loop with a **graph-driven execution engine**. Execution is modeled as `Graph[R] + Node[R] + Edge`, where `R` is the result type flowing through the graph. Each node is a unit of work, each edge a transition, and the engine walks the graph instead of spinning a `while` loop.

That one change buys three things: suspension, resumption, and controlled exits.

## The ReAct runtime as four nodes

The built-in ReAct agent is just a small graph with four nodes:

```
        ┌────────┐   ┌─────┐   ┌──────┐
        │ START  │ → │ LLM │ → │ TOOL │
        └────────┘   └──┬──┘   └───┬──┘
                        ▲          │
                        └──────────┘   (tool results feed back)
                             │
                             ▼
                        ┌───────┐
                        │  END  │   (model answers without tool calls)
                        └───────┘
```

| Node | Role |
|------|------|
| START | Sets up the turn and enters the graph. |
| LLM | Calls the model with the current context. |
| TOOL | Executes the tool calls the model requested. |
| END | Reached when the model responds without tool calls. |

Because the loop is a graph, the framework always knows *which node* a turn is in and *what state* it carries. That is what makes the next two features possible.

## GraphInterrupt: suspend, approve, resume

Any node can raise a `GraphInterrupt` to suspend execution mid-turn. The engine doesn't discard the turn; it persists the full state so the run can resume later, exactly where it stopped.

This turns human approval from a hack into a first-class mechanic. When a sensitive tool call needs your go-ahead, the TOOL node suspends through an approval transaction, a snapshot of the turn is rendered to you (in the WebUI or chat), and your decision resumes the graph at the exact point it paused. No re-planning, no lost context. The same mechanism gives you breakpoint-style debugging of agent runs.

!!! warning "Never swallow GraphInterrupt"
    `GraphInterrupt` is control flow, not an error. It must never be caught and swallowed, or a paused approval would silently vanish.

## Loop detection: a controlled exit

A ReAct loop can get stuck: the model keeps requesting the same tool calls without making progress. A naive framework burns tokens until the context window or your budget gives out.

ModexAgent's loop detection treats this as a graph problem (ADR-0016). The engine recognizes a runaway cycle and exits the loop as a **controlled stop** rather than letting it spin. You get a clean termination and a chance to inspect what happened, instead of a surprise bill.

## Where to next

- The same graph runtime powers subagents in [Multi-Agent](multi-agent.md) pools.
- What the LLM node sees each pass is shaped by the [Memory](memory.md) tiers.
- Ready to run an agent? Head to [Get Started](../get-started.md).
