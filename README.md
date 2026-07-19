# ModexAgent Website

Official website & documentation site for [ModexAgent](https://github.com/moyu-er/ModexAgent), built with [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and deployed to GitHub Pages from `main` on every push.

**Live site:** <https://moyu-er.github.io/modex-agent>

## Repository Layout

```
modex-agent/
├── mkdocs.yml              # site config — nav, palette, i18n, extra_css
├── docs/                   # MkDocs content tree (the built site)
│   ├── index.en.md         # landing — all homepage copy lives in its `home:` frontmatter
│   ├── *.en.md             # top-level pages (Installation, Get Started)
│   ├── docs/concepts/      # concept deep-dives (Graph Engine, Multi-Agent, …)
│   ├── stylesheets/        # extra.css (design tokens) + home.css (landing-only)
│   ├── javascripts/        # particles.js (particle morph engine)
│   └── assets/brand/       # logos (no cross-repo runtime dep)
├── overrides/              # Material template overrides (custom_dir)
├── .github/workflows/      # deploy.yml: push main → mkdocs build --strict → Pages
└── requirements.txt        # pinned build deps (mkdocs 1.x — see AGENTS.md §RISKS)
```

This repo holds **no framework Python**. Every product claim on the site is traced to the framework's `main` branch. See `AGENTS.md` for the source-of-truth map and contributor rules.

## Local Preview

```powershell
.\.venv\Scripts\python.exe -m mkdocs serve
# http://127.0.0.1:8000
```

Strict build gate (must pass before push):

```powershell
.\.venv\Scripts\python.exe -m mkdocs build --strict
```

## Links

- Framework source: [moyu-er/ModexAgent](https://github.com/moyu-er/ModexAgent)
- Live site: <https://moyu-er.github.io/modex-agent>
- Contributor guide: [`AGENTS.md`](AGENTS.md)
