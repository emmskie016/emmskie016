/**
 * Moon Media — Notion dashboard scaffolder (LOCAL run)
 * ----------------------------------------------------
 * WHY THIS RUNS LOCALLY, NOT IN THE CLAUDE ENVIRONMENT:
 *   The Claude Code remote container's network policy blocks outbound traffic
 *   to notion.so (the proxy returns 403 on CONNECT). So this script is built to
 *   run on YOUR machine, where you're already logged into Notion.
 *
 * WHAT IT DOES (the parts browser automation does *reliably*):
 *   1. Opens your Notion "Build here" page.
 *   2. Sets the page title.
 *   3. Builds the full dashboard SCAFFOLD using Notion's markdown keyboard
 *      shortcuts (#, ##, /callout, > toggle, ---). These shortcuts are stable
 *      across Notion versions, so this is robust.
 *   4. Creates the two inline databases (Clients, Video Deliverables) as empty
 *      tables, ready for you to add properties.
 *
 * WHAT IT INTENTIONALLY DOES NOT DO (and why):
 *   Property types (select/date/relation/rollup/formula), formulas, views,
 *   templates, and buttons are created by hand from ../moon-media-build/. Driving
 *   those through the DOM blind is brittle and not something to ship untested —
 *   and they're the parts the Loom wants to *see you* reason through anyway.
 *
 * USAGE:
 *   cd automation
 *   npm install
 *   npx playwright install chromium        # first time only
 *   node build-notion.mjs --login          # opens a browser; log into Notion, then press Enter in terminal
 *   node build-notion.mjs                   # runs the scaffold build
 *
 * Override the target page:
 *   NOTION_URL="https://www.notion.so/p/...your page..." node build-notion.mjs
 */

import { chromium } from 'playwright';
import readline from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, '.notion-profile'); // persists your login (gitignored)
const PAGE_URL =
  process.env.NOTION_URL ||
  'https://app.notion.com/p/Build-here-change-title-3883b9fa536580a3a984e29d6835926d';

const LOGIN_MODE = process.argv.includes('--login');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ask = (q) =>
  new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (a) => { rl.close(); res(a); });
  });

// ---- The dashboard scaffold, typed line-by-line. ----
// Each entry is [type, text]. Types map to Notion markdown shortcuts.
const SCAFFOLD = [
  ['h1', '📡 Content Operations Command Center'],
  ['quote', 'One source of truth, many lenses.'],
  ['divider'],
  ['h2', '⚡ Quick Actions'],
  ['text', 'TODO: add Buttons → “➕ New Video” (template: Standard Video) · “🚀 Onboard Client”.'],
  ['divider'],
  ['h2', '🚨 Today’s Signals'],
  ['callout', '🔴 Overdue — linked view of Video Deliverables, filter Urgency = 🔴 Overdue'],
  ['callout', '🟠 Due ≤3 days — linked view, filter Urgency = 🟠 Due ≤3d'],
  ['callout', '👀 In Client Review — linked view, filter Status = Client Review'],
  ['callout', '🔴 At-Risk Clients — linked view of Clients, filter Health Flag = 🔴 At Risk'],
  ['divider'],
  ['h2', '🗂 The Work'],
  ['text', 'TODO: 2 columns → left: linked Calendar view (by Post Date). right: linked Board view grouped by Production Stage.'],
  ['divider'],
  ['h2', '🙋 By Role'],
  ['toggle', '🙋 My Tasks — linked view, Owner = Me, Status ≠ Posted'],
  ['toggle', '✍️ Needs Brief — linked view, Status = Brief Needed'],
  ['toggle', '🎬 In Editing — linked Board grouped by Owner, Status = Editing'],
  ['toggle', '👀 Client Review — linked view, Status = Client Review'],
  ['divider'],
  ['h2', '🏥 Accounts'],
  ['text', 'TODO: linked Clients “Account Health” table (Health Flag, Delivery Pace, Overdue Videos, Renewal Countdown, AM) sorted worst-first.'],
  ['text', 'TODO: linked Clients “Renewals” view, Renewal Countdown ≤ 30 days.'],
];

async function focusEditor(page) {
  // Click into the page body so keyboard input lands in the editor.
  await page.keyboard.press('Escape');
  const title = page.locator('[contenteditable="true"]').first();
  await title.click({ timeout: 30000 });
  await wait(400);
}

async function typeLine(page, [type, text = '']) {
  switch (type) {
    case 'h1': await page.keyboard.type('# '); break;
    case 'h2': await page.keyboard.type('## '); break;
    case 'h3': await page.keyboard.type('### '); break;
    case 'quote': await page.keyboard.type('" '); break;     // Notion: " + space → quote
    case 'toggle': await page.keyboard.type('> '); break;     // > + space → toggle
    case 'divider':
      await page.keyboard.type('---');
      await wait(200);
      await page.keyboard.press('Enter');
      return;
    case 'callout': {
      // /callout via slash menu (more reliable than a shortcut)
      await page.keyboard.type('/callout');
      await wait(700);
      await page.keyboard.press('Enter');
      await wait(400);
      break;
    }
    case 'text':
    default:
      break;
  }
  await wait(120);
  await page.keyboard.type(text, { delay: 8 });
  await wait(120);
  await page.keyboard.press('Enter');
  // After a toggle, the next Enter would nest inside it — outdent back out.
  if (type === 'toggle') { await page.keyboard.press('Shift+Tab'); await wait(80); }
}

async function createInlineDatabase(page, name) {
  await page.keyboard.type('/table');
  await wait(900);
  await page.keyboard.press('Enter'); // pick "Table view" (inline)
  await wait(2500);
  // Notion drops focus into the new DB title; set its name.
  await page.keyboard.type(name, { delay: 12 });
  await wait(400);
  await page.keyboard.press('Escape');
  await wait(600);
  await focusEditor(page);
}

(async () => {
  const ctx = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1500, height: 950 },
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());

  if (LOGIN_MODE) {
    await page.goto('https://www.notion.so/login', { waitUntil: 'domcontentloaded' });
    console.log('\n👉 A browser window opened. Log into Notion (do the “Verify it’s you” step if asked).');
    await ask('   When you can see your Notion workspace, press Enter here to save the session… ');
    console.log('✅ Session saved to', USER_DATA_DIR, '— now run: node build-notion.mjs');
    await ctx.close();
    return;
  }

  try {
    console.log('→ Opening page:', PAGE_URL);
    await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(4000);

    if (/\/login/.test(page.url())) {
      throw new Error('Not logged in. Run: node build-notion.mjs --login  first.');
    }

    await focusEditor(page);

    // 1) Title — select the existing title text and overwrite it.
    console.log('→ Setting title…');
    await page.keyboard.press('Control+A');
    await page.keyboard.type('📡 Content Operations Command Center', { delay: 12 });
    await page.keyboard.press('Enter');
    await wait(500);

    // 2) Scaffold (skip the first h1 — we just typed the title).
    console.log('→ Building dashboard scaffold…');
    for (const line of SCAFFOLD.slice(1)) {
      await typeLine(page, line);
    }

    // 3) Inline databases.
    console.log('→ Creating Clients database…');
    await createInlineDatabase(page, 'Clients');
    console.log('→ Creating Video Deliverables database…');
    await createInlineDatabase(page, 'Video Deliverables');

    await page.screenshot({ path: path.join(__dirname, 'result.png'), fullPage: true });
    console.log('\n✅ Scaffold built. Screenshot: automation/result.png');
    console.log('   Next: open ../moon-media-build/01-build-guide.md and add properties,');
    console.log('   formulas (02-formulas.md), and the linked views where the TODOs are.');
  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    await page.screenshot({ path: path.join(__dirname, 'error.png'), fullPage: true }).catch(() => {});
    console.error('   Screenshot saved to automation/error.png — selectors may need a nudge for your Notion build.');
  } finally {
    await ask('\nPress Enter to close the browser… ');
    await ctx.close();
  }
})();
