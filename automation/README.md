# Notion automation (run on your own machine)

> **Why local?** The Claude Code remote environment's network policy blocks
> outbound traffic to `notion.so` (the proxy returns `403` on CONNECT), so the
> browser can't reach Notion from there. This script runs on your machine, where
> you're logged in and there's no proxy wall.

## What it does
- Sets the page title.
- Builds the full **dashboard scaffold** (sections, callouts, toggle lanes,
  dividers, and TODO notes telling you which linked view goes where) using
  Notion's markdown keyboard shortcuts — the reliable part of UI automation.
- Creates the two empty inline databases (**Clients**, **Video Deliverables**).

## What it deliberately leaves to you (see `../moon-media-build/`)
Property types, relations, rollups, **formulas**, views, templates, and buttons.
Automating those blind is brittle, and they're exactly what the Loom wants to
see you build by hand.

## Run it
```bash
cd automation
npm install
npx playwright install chromium        # first time only

node build-notion.mjs --login          # log into Notion in the window, then press Enter
node build-notion.mjs                   # builds the scaffold on the page
```

Target a different page:
```bash
NOTION_URL="https://www.notion.so/p/your-page-id" node build-notion.mjs
```

## If a step misbehaves
Notion's editor changes occasionally. The script screenshots `error.png` (or
`result.png` on success) and types slowly so you can watch. The keyboard-shortcut
approach (`#`, `##`, `/callout`, `>`, `---`) is the stable part; if a selector
drifts, the title/scaffold logic in `build-notion.mjs` is small and easy to tweak.
Your login lives in `.notion-profile/` (gitignored) so you only log in once.
```
```
