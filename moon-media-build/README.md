# Moon Media — Content Operations Command Center

**Author:** Emmskie · **Date:** 2026-06-25
**Deliverable for:** Moon Media Notion Build Test

This folder is the planning + build documentation for the Moon Media take-home. The
actual artifact lives in Notion (the "Build here" page in the *Moon Media Build Test*
workspace). These files are the spec I built from and the script I recorded against,
saved here so the reasoning is reviewable and reproducible.

## Files

| File | What it is |
|------|------------|
| `README.md` | This overview + the design rationale (the "why") |
| `01-build-guide.md` | Exact step-by-step Notion build: every property, relation, rollup, formula, view, template, button, and automation |
| `02-formulas.md` | Every formula in copy-paste Notion 2.0 syntax, with plain-English explanation |
| `03-loom-script.md` | The 12-minute Loom walkthrough script, beat by beat |
| `04-dashboard-layout.md` | The single dashboard page layout (blocks, sections, linked views) |

---

## The problem with the starting setup

The sample workspace ships two flat databases:

- **Clients** — Client Name, Status, Package, Videos Per Month, Renewal Date, Account Manager
- **Video Deliverables** — Video Name, Client (text), Content Type, Status, Due Date, Post Date

They're clean, but as a *content operations* system they have four gaps:

1. **No real link between the two databases.** "Client" on a video is plain text. That
   means no rollups, no "show me everything for Apex Sports," and typos silently break
   reporting (`Apex Sports` vs `Apex sports`).
2. **No sense of time or urgency.** Due Date and Post Date are just dates. Nobody can see
   at a glance what's overdue, due this week, or about to slip — the single most important
   thing a content ops lead needs every morning.
3. **No accountability inside a video.** A video has a status but no owner, no priority,
   and no place for the brief, script, or asset links. Status alone doesn't tell you *who*
   is blocking it.
4. **No reporting layer.** A manager can't answer "are we hitting Apex's 30 videos/month?",
   "which clients are at risk?", or "what's Sarah's workload?" without manually counting
   rows.

## What I built (and why)

A **single dashboard page** — "Content Operations Command Center" — backed by the two
upgraded databases. The guiding principle: **every person who opens it should see only
what's relevant to their role in under five seconds.**

| Improvement | Why it matters for content ops |
|---|---|
| **Two-way relation** Clients ⇄ Videos | The backbone. Unlocks every rollup and every "by client" view. Removes typo risk. |
| **Rollups on Clients** (total videos, posted this month, in production, overdue) | Turns the Client DB into an account-health report without leaving the row. |
| **Delivery-pace formula** (videos this month ÷ committed/month) | Directly answers "are we delivering what the client pays for?" The retention metric. |
| **Health Score + auto At-Risk flag** | Surfaces churn risk *before* the human Status field gets manually flipped to "At Risk." |
| **Production Stage formula** (groups 8 statuses → 5 stages) | The 8 statuses are detailed but noisy. Grouping into Pre-Pro → Production → Post → Ready → Published gives a clean pipeline board. |
| **Urgency formula** (Overdue / Due Soon / On Track) with emoji | The "what do I touch first" signal. Drives the morning view. |
| **Owner + Priority** on videos | Accountability. Powers per-person workload views and balances the team. |
| **Brief / Script / Asset link fields + checklist template** | The video page becomes the single source of truth, not a Slack thread. |
| **Content Calendar (by Post Date) + Production Pipeline (kanban)** | The two views a content team actually lives in. |
| **Per-role views** (My Tasks, Needs Brief, In Editing, Client Review, Overdue) | Each function opens straight to their queue. |
| **Templates + Buttons** | New video and new-client onboarding spin up in one click, pre-filled and consistent. |
| **Native automations** | Status changes notify the owner/AM; passing a due date flags the row. The repetitive nudging is handled by the system. |

The full reasoning per decision is in `03-loom-script.md` (that's what I talk through on
camera). The exact clicks are in `01-build-guide.md`.

## Why a dashboard and not just better databases

A content ops team isn't one persona. The **account manager** cares about client health and
renewals; the **editor** cares about their editing queue; the **lead** cares about capacity
and what's slipping. One mega-table serves none of them well. The dashboard composes
filtered *views* of the same two databases so each role gets a focused surface while the
data stays single-source. That's the whole bet: **one source of truth, many lenses.**
