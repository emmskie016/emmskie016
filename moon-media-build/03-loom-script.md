# Loom Walkthrough Script (~12 min, target 10–20)

Record screen + camera. Build a couple of pieces *live* (they asked to see process). Cover
the five required points — they're flagged **[REQUIRED]** below.

---

### 0:00 — Intro (45s)
> "Hi, I'm Emmskie. This is my build for the Moon Media test. The brief was to take two flat
> databases — Clients and Video Deliverables — and turn them into something a content
> operations *team* would actually run their week on. I'll show you what I built, walk
> through the why, and call out what I'd do next with more time."

Show the finished **Content Operations Command Center** dashboard. Scroll once, top to bottom.

---

### 0:45 — The problem I saw  **[REQUIRED: what I decided to improve]** (1.5 min)
> "Four things were missing. One: the two databases weren't actually connected — 'Client' on
> a video was just text, so a typo silently breaks any reporting. Two: there was no sense of
> urgency — dates, but nothing telling you what's overdue or due this week. Three: no
> ownership inside a video — a status, but no owner, priority, or place for the brief and
> assets. Four: no reporting layer — a manager couldn't answer 'are we hitting Apex's 30
> videos a month' or 'which clients are about to churn' without counting rows by hand."

---

### 2:15 — Fix #1: the relation  **[REQUIRED: why]** (1.5 min) — *build this live*
> "The foundation is a proper two-way relation between Clients and Videos." 

Live: delete the text Client field, add the relation, link one video, show it appear on the
client.
> "The moment this exists, everything else becomes possible — rollups, a 'by client' view,
> and no more typos. This one change is what turns two lists into a system."

---

### 3:45 — Fix #2: making time visible  **[REQUIRED: why]** (2 min) — *build a formula live*
Open the `Urgency` formula. Build or paste it on camera.
> "I don't want people reading dates and doing math in their head every morning. This formula
> turns Due Date plus Status into one signal: Overdue, Due in three days, This week, On
> track. I sort the 'This Week' view by it — so the morning routine is: open one view, work
> top to bottom."

Show the **This Week** view and the **Production Pipeline** board (grouped by the Production
Stage formula).
> "And I collapsed the eight statuses into five clean stages so the pipeline board reads
> left-to-right like an actual assembly line — Pre-Pro, Production, Post, Ready, Published."

---

### 5:45 — Fix #3: client health + churn early-warning  **[REQUIRED: why]** (2 min)
Show the **Account Health** table. Point at the rollups and the Health Score.
> "Rollups count each client's videos — total, posted this month, in production, overdue.
> Delivery Pace divides 'posted this month' by their monthly commitment, so I can instantly
> see who's underserved. Then Health Score rolls delivery, overdue count, and renewal
> runway into one number, and Health Flag turns it red, yellow, or green."

Point at Elevate Fitness.
> "Here's why this matters: Elevate Fitness is on the Basic package, only ten videos a month,
> renewal is June 30th — days away. The system flags it 🔴 *before* a human has to remember
> to. That's the difference between reacting to churn and preventing it."

---

### 7:45 — How it serves the *team*  **[REQUIRED: how it helps content ops]** (2 min)
Expand the **By Role** toggles.
> "A content team isn't one person. So instead of one giant table, the dashboard gives each
> role its own lane off the *same* data. An editor opens 'In Editing' grouped by owner. A
> writer opens 'Needs Brief.' An account manager opens 'Client Review' and 'Renewals.'
> Everyone opens 'My Tasks' and sees only their queue. One source of truth, many lenses."

Show **templates** + **buttons**.
> "New work stays consistent: this button spins up a video from a template with the full
> production checklist already in it — brief, script, filmed, edited, review, scheduled,
> posted. Nobody starts from a blank, half-filled row."

Show the **automations** menu.
> "Native automations handle the nagging: when a video moves to Client Review the owner gets
> pinged; when a new client is added the account manager is notified. Under guest
> permissions I can't fully wire all of these, so where I hit a limit I'll explain the
> intent rather than fake it — which the brief said is fine."

---

### 9:45 — What I'd do next  **[REQUIRED: what I'd improve with more time]** (1.5 min)
> - "A **Tasks/Subtasks** database so a single video can hold scriptwriter, editor, and
>   thumbnail-designer assignments separately — right now ownership is one person per video.
> - **Capacity planning**: a rollup of active videos per Owner to flag when someone's
>   overloaded before deadlines slip.
> - **Performance loop**: add Views / Watch-time / Engagement fields and post-publish, feed
>   them back so 'what content type works for this client' becomes data, not opinion.
> - A **Turnaround average** rollup to see if the team is getting faster month over month.
> - **Client portal**: a shared, filtered view per client for approvals, instead of email."

---

### 11:15 — External automations I'd recommend  **[REQUIRED]** (1 min)
> "Outside Notion, I would *not* over-automate, but a few high-leverage ones:
> - **Make / n8n**: when a video flips to 'Scheduled,' push it to the actual scheduler
>   (Later, Metricool, native platform APIs) so Notion's calendar and what's really queued
>   never disagree.
> - **Slack notify** on 'Client Review' and on any 🔴 Health Flag, so the team doesn't have to
>   live inside Notion to catch what's urgent.
> - **Post-publish metrics pull**: a scheduled job that reads view counts from each platform
>   back into the video row, powering that performance loop.
> - **Drive/asset automation**: auto-create a folder per video and drop the link in 'Final
>   Asset.'
> I'd build these only once the in-Notion workflow is proven, so we're automating a process
> that already works rather than cementing a broken one."

---

### 12:15 — Close (20s)
> "That's the build: one connected system, a signal layer so nothing slips, a health layer so
> no client churns quietly, and role-based views so the whole team works off the same truth.
> Thanks for watching."

---

## Quick checklist of the 5 required Loom points
- [x] What I decided to build/improve → 0:45
- [x] Why I made those decisions → woven through 2:15, 3:45, 5:45
- [x] How it helps a content operations team → 7:45
- [x] What I'd improve next → 9:45
- [x] External automations I'd recommend → 11:15
