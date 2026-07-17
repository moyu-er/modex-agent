# HANDOFF — ModexAgent Website

> For the next agent picking up this work. Read this first, then start.

## 1. Where you are

**This repository** is the *website* project for ModexAgent. You are already inside it.

- GitHub: https://github.com/moyu-er/modex-agent (public, org `moyu-er`)
- Default branch: `main`
- Git protocol: SSH
- Current contents: only `.gitignore` + `README.md` + this file. Everything else is to be built.

**The source project** (the thing this website documents) is `ModexAgent` — a reusable Python agent framework.
- GitHub: https://github.com/moyu-er/ModexAgent
- Local: the sibling directory named `ModexAgent` (one level up from this repo's root, i.e. `../ModexAgent` from here). Do not assume an absolute path — discover it via `git -C ../ModexAgent remote -v` or clone fresh from the GitHub URL if absent.
- Start reading there at `AGENTS.md` (project overview + conventions), then `docs/adr/` (architecture decisions), `docs/design/` (feature designs), `docs/agents/` (agent workflow docs).

> ⚠️ This repo is **independent** from the source project on purpose. Do not nest it inside `ModexAgent`. Do not import the framework's code here — this is a static website repo.

## 2. Current state

| Item | Status |
|---|---|
| Git repo + remote | ✅ done — `origin` → `git@github.com:moyu-er/modex-agent.git`, first commit pushed |
| `.gitignore` | ✅ covers Python / MkDocs `site/` / editors / env |
| `README.md` | ✅ placeholder |
| MkDocs init | ❌ not started |
| Site config (`mkdocs.yml`) | ❌ not started |
| Content (`docs/`) | ❌ not started |
| GitHub Pages deploy | ❌ not started |
| Design / branding | ❌ not started |
| i18n | ❌ not started |

## 3. The goal (what you need to build)

Build a **complete, production-quality website from scratch** for the ModexAgent project, deployed on GitHub Pages.

**Priority order (explicit from the owner):**

1. **Beautiful & visually striking** — this is the #1 requirement. The site must look premium, not like a default template. Distinctive visual identity, considered typography, refined spacing, polished micro-interactions.
2. **Internationalization (i18n)** — at minimum Chinese (`zh`) + English (`en`), with a clean language switcher. Architecture must make adding more languages trivial. Default language: `zh` (owner's locale is `zh-CN`, timezone `Asia/Hong_Kong`).
3. **Effects & animations** — tasteful motion design: scroll reveals, hover transitions, page-load animations, maybe a hero animation. Not gratuitous — every animation should serve clarity or delight. Must respect `prefers-reduced-motion`.
4. **Documentation content** — does **not** need to be exhaustive. A solid landing page + quick start + a few concept pages is enough for v1. Quality of writing > quantity of pages. Prefer a few excellent pages over many thin ones.

**Non-goals for v1:** full API reference, blog, versioned docs, search analytics, custom domain.

## 4. Tech decisions (already made — do not relitigate without owner approval)

- **Static site generator:** MkDocs + **Material for MkDocs** (`mkdocs-material`). Chosen because: Python-native (matches source project), beautiful default theme, strong i18n plugin support, custom CSS/JS injection for effects.
- **Hosting:** GitHub Pages, **Project Site** type (URL will be `https://moyu-er.github.io/modex-agent`). Not a user/org site.
- **Deploy:** GitHub Actions workflow (NOT `mkdocs gh-deploy` manual command). Push to `main` → auto build → auto deploy.
- **i18n:** Use the `i18n` plugin for MkDocs Material (`squidfunk/mkdocs-static-i18n` or the built-in Material i18n). Structure: one docs tree per language (`docs/en/`, `docs/zh/`) or per-file suffix — pick the cleaner option and document the choice.
- **Styling customization:** Material theme `palette` + `custom_dir` overrides + `extra_css` for bespoke design tokens and effects.

## 5. Suggested execution order

1. **Plan content & visual direction first** (use `brainstorming` + `brand` + `design-system` skills). Decide: site name, tagline, color palette, typography pairing, hero concept, page list. Output a short design brief before writing any code.
2. `pip install mkdocs mkdocs-material mkdocs-static-i18n` (or whatever i18n plugin you pick).
3. `mkdocs new .` in this repo root → produces `mkdocs.yml` + `docs/index.md`.
4. Configure `mkdocs.yml`: Material theme, i18n plugin, markdown extensions (`pymdownx.superfences`, `admonition`, `toc`, etc.), nav, `site_url` = `https://moyu-er.github.io/modex-agent`.
5. Write content: landing `index.md` (+ i18n variants), `quick-start.md`, 2–3 concept pages. Pull source material from the ModexAgent project's `AGENTS.md` and `docs/`.
6. Build the visual layer: `docs/css/extra.css` (design tokens, hero, cards, animations), `overrides/` templates where Material blocks need extending, hero/OG images.
7. Write `.github/workflows/deploy.yml` (Actions: install deps → `mkdocs build` → upload Pages artifact). Enable Pages in repo Settings → Source = "GitHub Actions".
8. Push to `main`, watch Actions, verify live URL.
9. Visual QA via browser (Playwright screenshot) against the design brief.

## 6. Suggested skills

Invoke these (already installed locally — check `~/.agents/skills/`):

| Skill | When |
|---|---|
| `brainstorming` | **Start here.** Clarify site positioning, IA, target audience before building. |
| `brand` | Define brand voice, visual identity, messaging for ModexAgent. |
| `design-system` | Build the token layer (colors, type scale, spacing) that `extra.css` implements. |
| `frontend-design` | Distinctive, non-templated visual direction; hero design; animation choreography. |
| `ui-ux-pro-max` | Palette/font pairing selection; UX guidelines; component patterns. |
| `logo-generator` | Generate a logo for ModexAgent if one doesn't exist (check source project first). |
| `banner-design` | Hero banner + social share (OG) images. |
| `mkdocs` | MkDocs setup, config, plugins, deployment reference. **Core technical skill.** |
| `github-pages` | Special-repo setup, Pages publishing source, Actions deploy, troubleshooting. **Core technical skill.** |
| `web-design-guidelines` | Audit the finished site against web guidelines (a11y, responsive, motion). |
| `playwright` (built-in) | Screenshot the live site for visual QA. |

> User-installed skills override built-ins. The design skills (`brand`, `design-system`, `frontend-design`, `ui-ux-pro-max`, `logo-generator`, `banner-design`) are the owner's installed set — prefer them.

## 7. Environment notes

- **GitHub CLI (`gh`)** is installed and authenticated as account `xxsddm` (admin role in org `moyu-er`). Use it for repo settings, Pages config, Actions checks. In a fresh shell it's on PATH as `gh`; if not, full path is the standard Windows install location.
- **Git** uses SSH (`git@github.com:...`). SSH key already configured for `moyu-er` repos.
- **OS:** Windows. Use PowerShell. MkDocs dev server: `mkdocs serve` → `http://127.0.0.1:8000`.
- **Python:** use `pip` (or `uv pip` if available — check the source project's tooling). MkDocs + plugins install cleanly on Windows.

## 8. Hard guardrails

- ❌ Do **not** commit build output (`site/`) — already in `.gitignore`.
- ❌ Do **not** use `mkdocs gh-deploy` once Actions deploy is set up — it force-pushes `gh-pages` and will clobber the Actions-based deploy. Pick ONE deploy mechanism (Actions, per the decision above).
- ❌ Do **not** hardcode absolute local paths anywhere in committed files. Use repo-relative paths or GitHub URLs.
- ❌ Do **not** import or copy the ModexAgent framework's Python code into this repo. This is a static site.
- ❌ Do **not** suppress type/style errors or leave broken builds on `main`.
- ✅ Every animation MUST guard with `@media (prefers-reduced-motion: reduce)`.
- ✅ Both `zh` and `en` must build without warnings before pushing.
- ✅ Commit messages: follow conventional style (`feat:`, `docs:`, `chore:`, `style:`).

## 9. Key references (read before building)

- MkDocs Material docs: https://squidfunk.github.io/mkdocs-material/
- MkDocs i18n: https://ultrabug.github.io/mkdocs-static-i18n/
- Material custom CSS: https://squidfunk.github.io/mkdocs-material/customization/
- GitHub Pages + Actions deploy: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Source project overview: `../ModexAgent/AGENTS.md` (or https://github.com/moyu-er/ModexAgent/blob/main/AGENTS.md)

---

**TL;DR for the next agent:** You're in an empty website repo for ModexAgent. Build a *beautiful*, *animated*, *bilingual (zh/en)* MkDocs Material site and deploy it to GitHub Pages via Actions. Start with `brainstorming` + `brand` to lock the visual direction, then implement. Aesthetics > content volume.
