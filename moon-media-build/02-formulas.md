# Formulas — copy-paste ready (Notion 2.0 formula syntax)

Paste each into a **Formula** property. Property names must match exactly (rename your
properties or edit the `prop("...")` references). Notion 2.0 lets you reference properties
with `prop("Name")` and supports `now()`, `dateBetween`, `formatDate`, `if`, `and`, `or`,
`style`, etc.

> Build order reminder: create the **Video Deliverables** formulas first (they're rolled up
> by the Clients rollups), then the Clients formulas.

---

## VIDEO DELIVERABLES

### `Days to Due` — signed days until the internal deadline (negative = late)
```
if(empty(prop("Due Date")), 0, dateBetween(prop("Due Date"), now(), "days"))
```

### `Is Overdue` — past due and not yet posted
```
and(not empty(prop("Due Date")), prop("Status") != "Posted", dateBetween(prop("Due Date"), now(), "days") < 0)
```
*Returns a checkbox-style true/false. Used by the Clients "Overdue Videos" rollup and the
"This Week" view.*

### `Is Active?` — anything in the production pipeline (not done, not just an idea sitting in Brief)
```
not or(prop("Status") == "Posted", empty(prop("Status")))
```
*Counts as "in production" for the client rollup. Adjust if you want "Brief Needed" excluded.*

### `Posted This Month?` — delivered in the current calendar month
```
and(
  prop("Status") == "Posted",
  not empty(prop("Post Date")),
  formatDate(prop("Post Date"), "YYYY-MM") == formatDate(now(), "YYYY-MM")
)
```

### `Production Stage` — collapse 8 statuses into 5 clean pipeline stages
```
if(prop("Status") == "Brief Needed", "1 · Pre-Production",
if(or(prop("Status") == "Writing", prop("Status") == "Filming"), "2 · Production",
if(or(prop("Status") == "Editing", prop("Status") == "Client Review"), "3 · Post-Production",
if(or(prop("Status") == "Scheduled", prop("Status") == "Ready to Post"), "4 · Ready",
if(prop("Status") == "Posted", "5 · Published", "—")))))
```
*Group the Production Pipeline board by this for a clean left-to-right flow.*

### `Urgency` — the "what do I touch first" signal
```
if(prop("Status") == "Posted", "✅ Done",
if(prop("Is Overdue"), "🔴 Overdue",
if(prop("Days to Due") <= 3, "🟠 Due ≤3d",
if(prop("Days to Due") <= 7, "🟡 This week",
"🟢 On track"))))
```
*Drives the "This Week" triage view. Sort by `Days to Due` ascending after filtering.*

### `Turnaround (days)` — production speed (created → posted)
```
if(prop("Status") == "Posted" and not empty(prop("Post Date")),
   dateBetween(prop("Post Date"), prop("Created time"), "days"),
   toNumber(""))
```
*Requires a `Created time` property (add via "Created time" property type). Lets you track
whether the team is getting faster over time; great for a future rollup/average.*

---

## CLIENTS

These assume the rollups from `01-build-guide.md` exist:
`Posted This Month` (count), `Overdue Videos` (count), `Total Videos` (count).

### `Delivery Pace` — % of the monthly commitment delivered this month
```
if(prop("Videos Per Month") == 0, 0,
   round(prop("Posted This Month") / prop("Videos Per Month") * 100))
```
*Format the property as a number; append `%` mentally, or wrap with `+ "%"` if you want it
as text. This is the core retention metric: is the client getting what they pay for.*

### `Renewal Countdown` — days to renewal with a traffic-light prefix
```
if(empty(prop("Renewal Date")), "—",
  format(dateBetween(prop("Renewal Date"), now(), "days")) + " days"
)
```
With urgency coloring:
```
if(empty(prop("Renewal Date")), "—",
if(dateBetween(prop("Renewal Date"), now(), "days") < 0, "🔴 Renewed/overdue",
if(dateBetween(prop("Renewal Date"), now(), "days") <= 30, "⚠️ " + format(dateBetween(prop("Renewal Date"), now(), "days")) + " days",
"🟢 " + format(dateBetween(prop("Renewal Date"), now(), "days")) + " days")))
```

### `Health Score` — 0–100 composite (higher = healthier)
```
round(
  /* delivery pace, capped at 100, worth 60 pts */
  (min(if(prop("Videos Per Month") == 0, 100, prop("Posted This Month") / prop("Videos Per Month") * 100), 100) * 0.6)
  /* overdue penalty: -10 per overdue video, worth up to 25 pts */
  + (max(25 - prop("Overdue Videos") * 10, 0))
  /* renewal proximity: 15 pts if >30 days out, less as it nears */
  + (if(empty(prop("Renewal Date")), 15,
       if(dateBetween(prop("Renewal Date"), now(), "days") > 30, 15,
       if(dateBetween(prop("Renewal Date"), now(), "days") > 0, 7, 0))))
)
```
*Weighted: 60% are-we-delivering, 25% are-we-late, 15% renewal-runway. Tune the weights to
taste — the point is one number that flags churn risk early.*

### `Health Flag` — the human-readable verdict
```
if(prop("Health Score") >= 75, "🟢 Healthy",
if(prop("Health Score") >= 50, "🟡 Watch",
"🔴 At Risk"))
```
*Compare this against the manual `Status` field. When `Health Flag` says 🔴 but `Status`
still says Active, that's exactly the early-warning the team wants — see Elevate Fitness in
the sample data (Basic package, only 10/mo, renewal June 30 = imminent).*

---

## Notes on syntax variants

- Notion has two formula syntaxes live. The above uses **Formula 2.0** (`prop()`, `now()`,
  `dateBetween`, `formatDate`/`format`). If your workspace shows the older editor, the same
  logic works; `format()` ↔ `formatDate()` and `min/max` are available in both.
- If `Owner`/`Account Manager` are **Person** properties, swap the "Me" view filter to use
  Notion's built-in **Person → Me** filter — no formula needed.
- `toNumber("")` is the idiomatic "empty number" so the column stays numeric for averaging.
