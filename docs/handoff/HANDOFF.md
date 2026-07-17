# HANDOFF — ModexAgent Website (v2)

> For the next agent or maintainer picking up this work. Read this first.
> Supersedes the root `HANDOFF.md` (v1, pre-build).

## 1. What this repo is

The **website** for [ModexAgent](https://github.com/moyu-er/ModexAgent) (a Python agent framework) — a MkDocs Material static site with a custom particle-morph landing page.

- **Live:** https://moyu-er.github.io/modex-agent (GitHub Pages, project site)
- **Repo:** `git@github.com:moyu-er/modex-agent.git`, default branch `main`, SSH
- **Status: v1 SHIPPED (2026-07-18).** All 7 planned tickets done, reviewed, deployed.

### Site architecture (what's where)

| Path | Role |
|---|---|
| `mkdocs.yml` | Site config: Material theme, day/night palettes, fonts, nav, i18n (`suffix`, en-only), search, `extra_css`. **Conductor-owned seam — edit carefully.** |
| `docs/index.en.md` | Landing page. **All homepage copy lives in its frontmatter `home:` map** — never in the template. |
| `docs/installation.en.md`, `docs/get-started.en.md` | Docs pages (EN). |
| `docs/concepts/*.en.md` | Concept pages (EN). |
| `overrides/home.html` | Custom landing template (extends Material `main.html`; reads `page.meta.home.*`). |
| `docs/stylesheets/extra.css` | Teal & Ember design tokens for both schemes (`[data-md-color-scheme="default"/"slate"]`). |
| `docs/stylesheets/home.css` | Landing-only styles, consumes `var(--mdx-*)` tokens only. |
| `docs/javascripts/particles.js` | Particle morph engine (landing only, wired from `home.html`). |
| `docs/assets/brand/` | Logos copied from the source project (icon/wordmark SVGs, knight `logo.jpg`). |
| `.github/workflows/deploy.yml` | Push to `main` → `mkdocs build --strict` → Pages artifact → deploy. |
| `requirements.txt` | Pinned build deps (`mkdocs==1.6.1`, `mkdocs-material==9.7.6`, `mkdocs-static-i18n==1.3.1`). |
| `docs/design/` | **Gitignored** working docs: full spec + tickets (see §4). Never built into the site. |
| `docs/handoff/` | This file. Excluded from the site build like `design/`. |
| `prototype/` | **Gitignored** throwaway UI prototype (design phase artifact; keep for reference or delete). |

## 2. Local machine layout (THIS machine only)

| What | Path |
|---|---|
| This website repo | `F:\tool\pythonProject\modex-agent` |
| Source project (content truth: README, AGENTS.md, brand assets in `assets/`) | `F:\tool\pythonProject\ModexAgent` |
| Python venv (MkDocs toolchain) | `F:\tool\pythonProject\modex-agent\.venv` |
| Local dev preview | `http://127.0.0.1:8000` via `.venv\Scripts\python.exe -m mkdocs serve` |
| Prototype server (if running) | `http://localhost:8300` via `python -m http.server 8300 --directory prototype` |

Environment: Windows + PowerShell 7. `gh` CLI authenticated (account `xxsddm`, admin in org `moyu-er`). Git over SSH.

## 3. Current state — what v1 shipped

- **Landing** (`/`): particle morph hero (wordmark → Agent Hub logo → modexbot knight → puzzle, with shape labels), features grid (6), architecture strip, installer-first get-started teaser, extras chips, final CTA. Day/night toggle recolors particles live. Reduced-motion renders a static frame.
- **Docs**: Installation (bot-only warning + `releases/latest` + CLI table), Get Started (first launch / API key / WebUI tour), Concepts (Graph Engine, Multi-Agent, Memory). EN only; i18n-ready (see §6.4).
- **Design**: "Teal & Ember" — logo-teal `#2DD4A8` spine + amber accents, warm-tinted neutrals, both schemes designed together.
- **Deploy**: Actions pipeline green; every push to `main` auto-deploys (CDN `max-age=600` — allow ~10 min to see changes).

## 4. Deep references (do NOT duplicate — read these)

- **Design spec (all decisions D1–D10 + rationale):** `docs/design/2026-07-17-website-design.md` (gitignored, local only)
- **Ticket log with per-ticket evidence:** `docs/design/tickets.md` (gitignored, local only)
- **History:** `git log --oneline` — commits `1886860` (T1) → `128fcfa` (T7 fixes)
- **Content truth for product claims:** `../ModexAgent/README.md` and `../ModexAgent/AGENTS.md` (sibling repo, see §2) — never invent features; trace claims there.

## 5. Hard rules (violations break the build or the design)

1. `mkdocs build --strict` must pass before every push. Chain verification with `&&` (or check `$LASTEXITCODE`), never `;` — a `;`-chain once shipped a red build to `main`.
2. Never `mkdocs gh-deploy` (clobbers the Actions pipeline). Never commit `site/`.
3. No absolute local paths in committed files. No framework Python code in this repo.
4. `.gitignore` has `.*` (ignores ALL dot-dirs) — a new dot-directory needs an explicit `!`-unignore (`.github/` already handled).
5. New dirs under `docs/` that are NOT site content (like `design/`, `handoff/`) must be added to `exclude_docs` in `mkdocs.yml` or strict builds fail.
6. Every animation needs a `prefers-reduced-motion` guard. No emoji as icons (inline SVG). Conventional commits (`feat:`/`fix:`/`docs:`/`style:`/`chore:`).

## 6. How-to guides (documentation updates)

### 6.1 Edit text on a docs page
Edit the corresponding `docs/<page>.en.md`. Product facts must trace to the source repo's README/AGENTS.md (§2). Preview (§6.5), then push.

### 6.2 Change homepage copy
Edit **only** the `home:` frontmatter map in `docs/index.en.md`. The template (`overrides/home.html`) must stay free of user-visible string literals — that is the i18n contract. Shape-label texts for the particle cycle live at `home.hero.shape_label` + `home.hero.shape_labels.{hub,knight,puzzle}`.

### 6.3 Add a new docs page
1. Create `docs/<name>.en.md` (frontmatter `title` + `description`).
2. Add it to `nav:` in `mkdocs.yml` (unsuffixed logical name, e.g. `<name>.md` — the i18n plugin resolves the suffix).
3. Link to it from other pages with unsuffixed relative links (`[x](../<name>.md)`), matching the site convention.

### 6.4 Add a language (e.g. Chinese)
The architecture is ready (mkdocs-static-i18n, suffix structure):
1. Copy each `*.en.md` → `*.zh.md` and translate (including the full `home:` frontmatter map in `index.zh.md`).
2. In `mkdocs.yml` → `plugins.i18n.languages`, add a `zh` block (`name`, `build: true`); keep `en` as `default: true`.
3. Optionally add a header language toggle later — v1 intentionally ships without one.
Homepage template, CSS, and particle engine need **zero** changes (labels come from frontmatter; Noto Sans SC is already in the font fallbacks).

### 6.5 Preview & verify locally
```powershell
cd F:\tool\pythonProject\modex-agent
.\.venv\Scripts\python.exe -m mkdocs serve   # http://127.0.0.1:8000
.\.venv\Scripts\python.exe -m mkdocs build --strict   # gate before push
```

### 6.6 Deploy
Push to `main` — that's it. Watch with `gh run list --limit 1`; verify the live URL after ~10 min (CDN cache).

### 6.7 Change colors / design tokens
Edit `docs/stylesheets/extra.css` — tokens are defined per scheme under `[data-md-color-scheme="default"]` (day) and `["slate"]` (night). **Change both schemes together** and re-check WCAG AA (body ≥4.5:1). Note the documented deviation: day link color uses `#0F766E` (not spec-brand `#0D9488`, which measures 3.58:1 on paper) — see comments in the file.

### 6.8 Particle engine (`docs/javascripts/particles.js`)
Physics constants and extraction predicates are **validated — do not tune** (spec §5.1–5.2 has the rules and why). To change shapes/labels: frontmatter only (§6.2). The engine reads config from the canvas `data-*` attributes in `home.html`.

## 7. Known risks / watchlist

- **MkDocs 2.0**: the Material team announced MkDocs 2.0 will remove the plugin system (our i18n plugin + template overrides depend on it). Versions are pinned in `requirements.txt`, so builds are stable; evaluate migration before ever upgrading past mkdocs 1.x.
- **`releases/latest` link**: the Installation page points to GitHub Releases, which has no release yet — copy already handles this gracefully. When the first `ModexBot-Setup` release is cut, the link just starts working.
- **Background subagents on this setup occasionally lose their handles** (observed 2026-07-17/18). If a delegated task dies, check the file tree for artifacts, then re-dispatch (sync mode for critical reviews).
- ** curl-through-PowerShell truncation**: `curl.exe | PowerShell` sometimes captures ~640 B of a 26 KB page. Verify with `curl -o file` + inspect the file instead.

## 8. Suggested skills (invoke as needed)

| Task | Skill |
|---|---|
| Any MkDocs config/structure question | `mkdocs` |
| Pages/Actions/deploy issues | `github-pages` |
| Visual/design changes (palette, typography, UX) | `ui-ux-pro-max` |
| Big new feature work | `brainstorming` → `to-tickets` → `parallel-implement` |
| Implementing a single ticket | `implement` |
| Visual verification of pages (note: dynamic canvas — prefer owner eyeball + static checks over screenshots) | `playwright` |
| Writing the next handoff | `handoff` |

---
**TL;DR:** v1 is live and complete. To update docs: edit `docs/*.en.md` (homepage copy = frontmatter only), `mkdocs build --strict`, push. Everything else — design decisions, ticket evidence, local paths — is in `docs/design/` and §2 above.
