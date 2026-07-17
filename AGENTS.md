# AGENTS — modex-agent (website)

> Knowledge base for anyone working on this repo. Read first.
> This is the **website** repo for the ModexAgent framework — NOT the framework itself.

## OVERVIEW

MkDocs Material static site with a custom particle-morph landing page. Deployed
to GitHub Pages from `main` on every push. The framework it documents lives in
a **sibling repo** (§SOURCE OF TRUTH) — this repo holds no framework Python.

## STRUCTURE

```
modex-agent/
├── mkdocs.yml              # site config — nav, palette, i18n, extra_css (CONDUCTOR SEAM)
├── docs/                   # MkDocs content tree (the built site)
│   ├── index.en.md         # landing — ALL homepage copy lives in its `home:` frontmatter
│   ├── *.en.md             # docs pages (suffix i18n; en default, zh-ready)
│   ├── docs/               # "Docs" nav section content root
│   │   └── concepts/       # concept deep-dives (Concepts sub-block)
│   ├── stylesheets/        # extra.css (design tokens) + home.css (landing-only)
│   ├── javascripts/        # particles.js (particle morph engine)
│   ├── assets/brand/       # logos copied from source repo (no cross-repo runtime dep)
│   ├── design/             # GITIGNORED working docs (spec, tickets) — never built
│   └── handoff/            # GITIGNORED handoff docs — never built
├── overrides/              # Material template overrides (custom_dir) — see overrides/AGENTS.md
├── .github/workflows/      # deploy.yml: push main → mkdocs build --strict → Pages
├── requirements.txt        # pinned build deps — DO NOT upgrade past mkdocs 1.x (§RISKS)
├── HANDOFF.md              # pointer to docs/handoff/HANDOFF.md (the real handoff)
└── prototype/              # GITIGNORED throwaway UI prototype
```

## SOURCE OF TRUTH (where the facts live)

Both this repo AND the framework evolve. **Never invent product features** — trace
every product claim to the framework's `main` branch before writing it here.

The framework source is cloned locally at **`.modexagent-main/`** (gitignored —
see §STRUCTURE). It is a shallow single-branch clone of `main`. If that path is
missing or stale, refresh it:

```powershell
git clone --depth 1 --single-branch --branch main https://github.com/moyu-er/ModexAgent.git .modexagent-main
# or, if it exists but is stale:
git -C .modexagent-main fetch --depth 1 origin main && git -C .modexagent-main reset --hard origin/main
```

| Need | Look at |
|---|---|
| Product features, quick start, extras | `.modexagent-main/README.md` (+ `README.zh-CN.md`) |
| Architecture rules, module map | `.modexagent-main/AGENTS.md` |
| Domain glossary (Pool, Graph, GraphInterrupt, …) | `.modexagent-main/CONTEXT.md` (+ `CONTEXT-MAP.md`) |
| 26 framework modules, one-liners | `.modexagent-main/src/modex_agent/AGENTS.md` |
| Canonical app reference (WebUI, pools, IM adapters) | `.modexagent-main/examples/bot_project/README.md` |
| From-source setup detail | `.modexagent-main/docs/bot-local-setup.md` |
| ADRs (architecture decisions) | `.modexagent-main/docs/adr/` (ADR-0001 ~ 0024 on `main`; index may lag) |
| Docs index | `.modexagent-main/docs/AGENTS.md` |
| Design decisions D1–D10 + rationale | `docs/design/2026-07-17-website-design.md` (gitignored, local only) |

When the framework changes, audit the site's product claims against the above.
The website documents **`main`-released reality only** — features in proposed
ADRs or unmerged branches do not belong on the site until they ship.

## HARD RULES (violations break the build or the design)

1. **`mkdocs build --strict` must pass before every push.** Chain verification
   with `&&` (or check `$LASTEXITCODE`), NEVER `;`. A `;`-chain once shipped a
   red build to `main`.
2. **Never `mkdocs gh-deploy`.** It clobbers the Actions pipeline. Never commit `site/`.
3. **No absolute local paths in committed files.** No framework Python code in this repo.
4. **`.gitignore` uses `.*`** (ignores ALL dot-directories). A new dot-directory
   needs an explicit `!`-unignore (`.github/` already handled). Watch for this
   before adding `.cache/`, `.something/`.
5. **Non-site dirs under `docs/`** (like `design/`, `handoff/`) MUST be added to
   `exclude_docs` in `mkdocs.yml`, or strict builds fail.
6. **Every animation needs a `prefers-reduced-motion` guard.** No emoji as UI
   icons — use inline SVG.
7. **Conventional commits only:** `feat:` / `fix:` / `docs:` / `style:` / `chore:`.
8. **Homepage i18n contract:** every user-visible string on the landing lives in
   the `home:` frontmatter map of `docs/index.<lang>.md`. The template
   (`overrides/home.html`) must stay free of user-visible string literals.
   Adding a locale = copying `index.en.md` → `index.<lang>.md` + translating the
   map + one `languages:` block in `mkdocs.yml`. Zero template/CSS/JS changes.
9. **Design tokens:** edit `docs/stylesheets/extra.css`. Tokens are defined per
   scheme under `[data-md-color-scheme="default"]` (day) and `["slate"]` (night).
   **Change both schemes together** and re-check WCAG AA (body text ≥4.5:1).
   Component styles in `home.css` consume `var(--mdx-*)` only — never hardcode
   palette values there.
10. **Particle engine (`docs/javascripts/particles.js`):** physics constants and
    extraction predicates are validated — **do not tune**. Change shapes/labels
    via frontmatter only (§HOMEPAGE COPY). The engine reads config from the
    canvas `data-*` attributes in `home.html`.
11. **`docs_dir: docs`** is the build root. Anything outside `docs/` is not site
    content; anything inside `docs/` but in `exclude_docs` is not built.

## HOMEPAGE COPY

All landing copy (hero headline/sub/CTAs, feature cards, architecture chips,
get-started steps, extras, final CTA, shape labels) lives in the `home:` map in
`docs/index.en.md`. Section keys: `hero`, `features`, `arch`, `getstarted`,
`extras`, `final`, `urls`. Icon keys (`graph|shield|hub|layers|term|web`) are
structural — do NOT translate. Adding a feature card = add a `cards:` entry +
the matching SVG branch in `home.html`.

## NAV

`nav:` in `mkdocs.yml` uses unsuffixed logical names (e.g. `index.md`,
`docs/concepts/graph-engine.md`). Paths are relative to `docs_dir: docs`; the
i18n plugin resolves the `.en` suffix. The **Docs** section holds all
concept/deep-dive content; **Concepts** lives at `docs/docs/concepts/`. Add a
new Docs page: create `docs/docs/<name>.en.md` → add a `nav:` entry under
`Docs:` → link from other pages with unsuffixed relative links.

## COMMANDS

```powershell
# Local preview — http://127.0.0.1:8000
.\.venv\Scripts\python.exe -m mkdocs serve

# Strict build gate — MUST pass before push
.\.venv\Scripts\python.exe -m mkdocs build --strict

# Deploy = push to main. Watch the run:
gh run list --limit 1
# Live URL (CDN max-age=600 — allow ~10 min): https://moyu-er.github.io/modex-agent
```

## RISKS

- **MkDocs 2.0** will remove the plugin system (our i18n plugin + template
  overrides depend on it). Versions pinned in `requirements.txt`. Evaluate
  migration before ever upgrading past mkdocs 1.x.
- **`releases/latest` link** on the Installation page points to GitHub Releases,
  which has no release yet. Copy handles this gracefully; the link starts
  working when the first `ModexBot-Setup` release is cut.
- **Background subagents on this setup occasionally lose their handles.** If a
  delegated task dies, check the file tree for artifacts, then re-dispatch
  (sync mode for critical reviews).
- **`curl.exe | PowerShell` truncation** sometimes captures ~640 B of a 26 KB
  page. Verify with `curl -o file` + inspect the file.

## NOTES

- Live site: https://moyu-er.github.io/modex-agent
- Repo: `git@github.com:moyu-er/modex-agent.git`, default branch `main`, SSH.
- `gh` CLI authenticated (account `xxsddm`, admin in org `moyu-er`).
- Environment: Windows + PowerShell 7. Python venv at `.venv/`.
- `site/` and `docs/design/` are gitignored — `site/` is rebuild output,
  `docs/design/` holds the spec + ticket log (local working docs).
- Template overrides have their own guide: `overrides/AGENTS.md`.
