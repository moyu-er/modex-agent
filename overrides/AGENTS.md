# AGENTS — overrides/ (Material template layer)

> Template overrides for Material for MkDocs. `custom_dir: overrides` in `mkdocs.yml`.

## OVERVIEW

Only `home.html` is overridden — the custom landing template. It extends
`main.html` (Material base) and replaces only the content area; header, footer,
and palette toggle come from base untouched.

## FILES

- `home.html` — landing template (extends `main.html`)
- `README.md` — one-line pointer (keep in sync if files are added)

## I18N CONTRACT (load-bearing — do not break)

Every user-visible string in `home.html` is read from `page.meta.home.*`
(the `home:` frontmatter map in `docs/index.<lang>.md`). **No string literals
in the template.** Adding a locale = adding a translated frontmatter map, zero
template changes. If you add a new visible string to the template, you MUST add
the matching key to the frontmatter contract and document it in
`docs/index.en.md` comments.

## STRUCTURE OF home.html

- `{% extends "main.html" %}` + `{% set home = page.meta.home %}`
- `{% block site_nav %}{% endblock %}` — drop sidebars on landing
- `{% block header %}` — prepend skip link (Material 9.x renders skip only from
  `page.toc`, which the landing lacks; base.html has no `skip` block to override)
- `{% block container %}` — the landing: hero / features / arch / getstarted /
  extras / final CTA. Section keys mirror the frontmatter map.
- Inline `<script>` — IntersectionObserver scroll-reveal (vanilla, no libs);
  degrades to fully-visible without JS/IO.
- `<script src="javascripts/particles.js" defer>` — particle engine boots itself
  from the canvas `data-*` attributes.

## PARTICLE ENGINE WIRING

The hero `<canvas id="pcv">` carries `data-*` attrs the engine reads at boot:
`data-knight-src`, `data-label-wordmark`, and (optionally) `data-label-hub`,
`data-label-knight`, `data-label-puzzle`. The optional shape_labels map is
emitted only when the locale defines it — the engine keeps the current pill text
for shapes without a label. Do not add canvas config the engine does not read.

## ICONS

Feature-card icons are inline SVG branches keyed on `f.icon`
(`graph|shield|hub|layers|term|web`). Adding a new icon = add a branch in
`home.html` + use the same key in the frontmatter `cards:` entry. Keys are
structural — do NOT translate.

## ANTI-PATTERNS

- **Never put user-visible copy in this template.** Use the frontmatter map.
- **Never import JS libs here.** The reveal script is inline vanilla; the
  particle engine is a separate vanilla file. Keep it that way.
- **Never remove the skip-link block override.** Material 9.x does not render
  the skip link on pages without `page.toc`, and the landing has none.
- **Never enable `navigation.instant`** in `mkdocs.yml` — it breaks third-party
  JS init (the particle engine) on page transitions. The comment in
  `mkdocs.yml` already warns about this.

## NOTES

- Landing frontmatter `hide: [navigation, toc]` complements the sidebar drop.
- `home.html` renders only for pages with `template: home.html` in frontmatter.
- Material base blocks can change between Material versions — `requirements.txt`
  pins `mkdocs-material==9.7.6`. Re-validate block names if you upgrade.
