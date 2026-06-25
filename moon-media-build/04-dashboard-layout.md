# Dashboard Layout — the single page

The whole build lives on one Notion page: **📡 Content Operations Command Center**. Layout
top to bottom. Use `/` commands for each block. Linked views = type `/linked` → "Create
linked view of database."

```
┌──────────────────────────────────────────────────────────────────────┐
│ 📡 Content Operations Command Center                          (H1)     │
│ Last updated automatically · One source of truth, many lenses (quote)  │
├──────────────────────────────────────────────────────────────────────┤
│  ▸ QUICK ACTIONS  (3 buttons, in a row)                                │
│  [ ➕ New Video ]   [ 🚀 Onboard Client ]   [ 📅 Open Calendar ]        │
├──────────────────────────────────────────────────────────────────────┤
│  ▸ TODAY'S SIGNALS   (4 callout blocks in a 4-column layout)           │
│  🔴 Overdue         🟠 Due ≤3 days      👀 In Client Review   🔴 At-Risk│
│  (linked view,      (linked view,       (linked view,         Clients  │
│   This Week filtered (This Week           Client Review)      (Account  │
│   to Overdue)        filtered Due ≤3d)                         Health🔴)│
├──────────────────────────────────────────────────────────────────────┤
│  ▸ THE WORK                                                            │
│  ╔════════════════════════╗   ╔════════════════════════════════════╗  │
│  ║ 📅 Content Calendar     ║   ║ 🏭 Production Pipeline (Board)      ║  │
│  ║ (linked Calendar view,  ║   ║ (linked Board view grouped by      ║  │
│  ║  by Post Date)          ║   ║  Production Stage)                 ║  │
│  ╚════════════════════════╝   ╚════════════════════════════════════╝  │
├──────────────────────────────────────────────────────────────────────┤
│  ▸ BY ROLE   (toggle list — each opens a focused linked view)         │
│  ▸ 🙋 My Tasks            (Owner = Me, not Posted)                      │
│  ▸ ✍️ Needs Brief         (Status = Brief Needed)                       │
│  ▸ 🎬 In Editing          (Status = Editing, grouped by Owner)          │
│  ▸ 👀 Client Review       (Status = Client Review)                      │
├──────────────────────────────────────────────────────────────────────┤
│  ▸ ACCOUNTS                                                            │
│  🏥 Account Health  (linked Clients table: Health Flag, Delivery Pace, │
│      Overdue Videos, Renewal Countdown, AM — sorted worst-first)       │
│  🔄 Renewals next 30 days  (linked Clients view)                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Block-by-block (`/` commands)

1. **Heading 1**: `📡 Content Operations Command Center`
2. **Quote / callout**: the one-liner tagline.
3. **Buttons**: three button blocks side by side (drag to make columns). Configure each per
   `01-build-guide.md` Step 5.
4. **TODAY'S SIGNALS**: type `/2 columns` (or 4 columns). In each column drop a **linked
   view** of Video Deliverables (or Clients for the last) filtered as labeled, displayed as
   a compact table or just the count. Wrap each in a **callout** with the colored emoji so
   it reads like a KPI tile.
5. **THE WORK**: `/2 columns`. Left = linked **Calendar** view. Right = linked **Board**
   (Production Pipeline). These are the two views the team lives in.
6. **BY ROLE**: a **toggle list**; nest a linked view inside each toggle so the page stays
   short until someone expands their lane.
7. **ACCOUNTS**: linked Clients **Account Health** table, then the **Renewals** view.

## Design choices

- **Signals on top, detail below.** The first screen answers "is anything on fire?" The
  scrolling answers "what do I do about it?"
- **Toggles for role views** keep the page from becoming a wall of tables — each person
  expands only their lane.
- **Everything is a linked view**, never a duplicate database, so the dashboard can never
  drift from the source data.
- **Color is meaningful, not decorative** — 🔴/🟠/🟡/🟢 always means the same urgency scale
  across videos and clients, so the eye learns it once.
