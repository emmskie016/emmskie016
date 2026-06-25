# Build Guide — exact steps in Notion

Follow top to bottom. Everything here is doable as a **guest with edit access** on the
"Build here" page. Where a step needs workspace-owner rights (some native automations),
it's marked **[owner]** and there's a guest-friendly fallback.

Time budget: ~60–75 min to build, which is the right pace to also narrate on the Loom.

---

## STEP 0 — Set the page up

1. Open the **[Build here - change title]** page.
2. Rename it to **`📡 Content Operations Command Center`**.
3. Add an icon (📡) and a cover for polish.

We'll create the two databases *inside* this page as in-line databases, then build views
and a dashboard around them. Keeping them in-line on one page satisfies the
"single dashboard page" requirement.

---

## STEP 1 — Rebuild the Clients database

Type `/table` → **Table view** → name it **Clients**. Recreate the sample columns, then add
the new ones. (If you'd rather not re-enter data, keep the provided DB and just add the new
properties — the relation/rollup/formula steps are identical.)

### Keep (from sample)
| Property | Type | Notes |
|---|---|---|
| Client Name | Title | |
| Status | Select | `Onboarding`, `Active`, `At Risk` (blue / green / red) |
| Package | Select | `Basic`, `Standard`, `Premium` |
| Videos Per Month | Number | the monthly commitment |
| Renewal Date | Date | |
| Account Manager | Select | `James`, `Mark`, `Sarah` *(use Person type instead if these are real members)* |

### Add — relation
| Property | Type | Config |
|---|---|---|
| **Videos** | Relation | Relate to the **Video Deliverables** DB (build that first if it doesn't exist yet — Step 2 — then come back). **Turn ON "Show on Video Deliverables"** so it's two-way. |

### Add — rollups (all roll up through the **Videos** relation)
| Property | Rollup of | Calculate | Purpose |
|---|---|---|---|
| **Total Videos** | Videos → Video Name | Count all | total deliverables on file |
| **Posted This Month** | Videos → `Posted This Month?` (formula, Step 2) | Sum / Count checked | are we delivering this month |
| **In Production** | Videos → `Is Active?` (formula) | Count checked | live workload |
| **Overdue Videos** | Videos → `Is Overdue` (formula) | Count checked | red flags per client |
| **Next Post Date** | Videos → Post Date | Earliest date | when does this client next go live |

> Rollups can only "see" properties that exist on the Video DB, so create the Step-2
> formulas first, then add these rollups. Build order: Step 2 formulas → Step 1 rollups.

### Add — formulas (full text in `02-formulas.md`)
| Property | Type | Does |
|---|---|---|
| **Delivery Pace** | Formula | `Posted This Month ÷ Videos Per Month` as a % — are we on pace |
| **Renewal Countdown** | Formula | days to renewal, e.g. `⚠️ 12 days` / `🟢 90 days` |
| **Health Score** | Formula | 0–100 from delivery pace, overdue count, renewal proximity |
| **Health Flag** | Formula | `🟢 Healthy` / `🟡 Watch` / `🔴 At Risk` derived from Health Score |

---

## STEP 2 — Rebuild the Video Deliverables database

Type `/table` → name it **Video Deliverables**.

### Keep (from sample)
| Property | Type | Notes |
|---|---|---|
| Video Name | Title | keep the `Client \| Type: Description` naming convention |
| Content Type | Select | `Trend`, `Gameplay`, `Tutorial`, `Review`, `Product Demo`, `Customer Story`, `Challenge` |
| Status | Select | `Brief Needed`, `Writing`, `Filming`, `Editing`, `Client Review`, `Scheduled`, `Ready to Post`, `Posted` |
| Due Date | Date | internal deadline |
| Post Date | Date | publish date |

> **Important fix:** delete the old plain-text **Client** column and replace it with the
> **relation** created in Step 1 (it appears here automatically once "Show on Video
> Deliverables" is on). Re-link each video to its client (8 clients, ~21 videos — quick).

### Add — people / priority
| Property | Type | Config |
|---|---|---|
| **Owner** | Person *(or Select if guests can't be assigned)* | who's responsible right now |
| **Priority** | Select | `🔴 High`, `🟡 Medium`, `🟢 Low` |
| **Approved** | Checkbox | client/AM sign-off before scheduling |

### Add — content fields (make the video page the source of truth)
| Property | Type | Purpose |
|---|---|---|
| **Brief** | Text | one-line concept / hook |
| **Script / Doc** | URL | link to script (Google Doc, etc.) |
| **Final Asset** | URL | link to the exported video / drive folder |
| **Hook** | Text | the first 3 seconds — most important line |

### Add — formulas (full text in `02-formulas.md`)
| Property | Type | Does |
|---|---|---|
| **Production Stage** | Formula | maps 8 statuses → `1 Pre-Production` / `2 Production` / `3 Post` / `4 Ready` / `5 Published` |
| **Urgency** | Formula | `🔴 Overdue` / `🟠 Due ≤3d` / `🟡 This week` / `🟢 On track` / `✅ Done` |
| **Days to Due** | Formula | signed integer; negative = late |
| **Is Overdue** | Formula (checkbox-like) | true if past Due Date and not Posted |
| **Is Active?** | Formula | true if Status is anywhere between Brief Needed and Ready to Post |
| **Posted This Month?** | Formula | true if Posted and Post Date in current month |
| **Turnaround (days)** | Formula | Post Date − created date, to track production speed over time |

---

## STEP 3 — Build the views

These views are the product. Create them on the Video Deliverables DB unless noted.

### On Video Deliverables
1. **📅 Content Calendar** — *Calendar* view, by **Post Date**. Color by Content Type.
   *The publishing schedule at a glance.*
2. **🏭 Production Pipeline** — *Board* view, group by **Production Stage** (or by Status for
   finer detail). Card preview shows Owner + Priority + Due Date.
   *Drag-to-progress workflow board.*
3. **🔥 This Week** — *Table*, filter `Urgency` is `🔴 Overdue` OR `🟠 Due ≤3d` OR `🟡 This week`,
   sort by Days to Due ascending. *The morning triage list.*
4. **✍️ Needs Brief** — *Table*, filter Status = `Brief Needed`. *Writers' intake queue.*
5. **🎬 In Editing** — *Board* grouped by Owner, filter Status = `Editing`. *Editors' queue + load balance.*
6. **👀 Client Review** — *Table*, filter Status = `Client Review`, sort Due Date. *AM follow-up list.*
7. **🙋 My Tasks** — *Table*, filter Owner = **Me** (Notion's "Me" filter), and Status is not `Posted`.
   *Personal queue for every team member.*
8. **🗂 By Client** — *Table*, group by the Client relation. *Account view.*
9. **All Videos** — keep the original as the master table.

### On Clients
10. **🏥 Account Health** — *Table*, show Health Flag, Delivery Pace, Overdue Videos,
    Renewal Countdown, Account Manager. Sort by Health Score ascending (worst first).
11. **🔄 Renewals** — *Table* or *Calendar* by Renewal Date, filter Renewal Countdown ≤ 30 days.
12. **By Account Manager** — *Board* grouped by Account Manager. *Capacity per AM.*

---

## STEP 4 — Templates (database templates)

On **Video Deliverables**, open the **New** dropdown → **+ New template**:

### Template: "🎥 Standard Video"
Pre-set: Status = `Brief Needed`, Priority = `🟡 Medium`, Approved = unchecked.
In the page body, add a production checklist (to-do blocks):
```
☐ Brief approved
☐ Script written
☐ Filmed / recorded
☐ First cut edited
☐ Internal review
☐ Client review + approval
☐ Scheduled
☐ Posted + link saved
```
Plus headings: **Hook**, **Concept**, **Script link**, **Assets**.
*Every new video starts identical and complete — no more half-filled rows.*

### Template: "⚡ UGC Quick-Turn"
Same but Priority = `🔴 High` and a trimmed 4-step checklist, for fast trend content.

On **Clients**, add a **"🚀 New Client Onboarding"** template with a checklist
(contract signed, brand kit received, kickoff call, first month's videos planned) and a
linked view of that client's Videos in the page body.

---

## STEP 5 — Buttons

Add **Button** blocks on the dashboard (or as a DB button property):

1. **➕ New Video** — *Add page to* Video Deliverables, using the "Standard Video" template.
2. **🚀 Onboard Client** — *Add page to* Clients, using the onboarding template.
3. **🗓 Plan This Month** *(advanced)* — a button on each Client row that adds N pages to
   Video Deliverables pre-linked to that client. (Guest permissions may limit the
   "add multiple" action — if so, demo single-add and explain the intent on the Loom.)

---

## STEP 6 — Native Notion automations

Configure via the **⚡ (lightning)** menu on the database. **[owner]** marks ones that may
need workspace-owner rights; the fallback still demonstrates the thinking.

1. **Status → Client Review ⟶ notify Owner + set a reminder.**
   When `Status` is set to `Client Review`, set `Approved` reminder and notify Owner.
2. **Status → Posted ⟶ stamp Post Date** (if empty, set to Today) and check nothing else is
   left — keeps the calendar honest.
3. **Status → Brief Needed on create** — default for any row not made from a template.
4. **[owner] Due Date passed + not Posted ⟶ set Priority = 🔴 High** (a scheduled/db
   automation). Fallback: the `Is Overdue` formula + the "This Week" view already surface
   this visually without an automation.
5. **New Client added ⟶ notify the assigned Account Manager.**

> Per the task instructions, I don't try to perfect automations under guest limits — I set
> up what I can and explain the rest on the Loom.

---

## STEP 7 — Assemble the dashboard

See `04-dashboard-layout.md` for the exact block layout. In short: a title, a row of
callout "KPIs," then a 2-column section with the Calendar + Pipeline, then role-based
linked views below, then the Account Health table.
