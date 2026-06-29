# AdPilot — Meta & Google Ads Automation SaaS

> **Product planning document** · v1.0 · Last updated: 2026-06-29
>
> A SaaS platform that automates the full lifecycle of advertising on **Meta**
> (Facebook/Instagram) and **Google Ads** (Search, Performance Max, Display,
> YouTube, Shopping) — from campaign creation and creative generation to
> budget optimization, bid management, reporting, and alerting.

---

## 1. Vision & Positioning

### 1.1 One-line pitch
**"Set your goals and budget — AdPilot builds, launches, monitors, and optimizes your Meta and Google ad campaigns automatically, 24/7."**

### 1.2 Problem
- SMBs and agencies spend hours each week manually managing campaigns across two very different ad platforms with two different UIs and APIs.
- Manual optimization is reactive and inconsistent; budgets get wasted on underperforming ad sets/keywords.
- Cross-platform reporting requires stitching data together by hand.
- Creative production (copy + images/video) is a bottleneck.

### 1.3 Solution
A single control plane that:
1. Connects to both ad platforms via official APIs.
2. Uses rule-based + AI-driven automation to manage budgets, bids, audiences, and creatives.
3. Generates ad creative (copy + visuals) with AI.
4. Unifies reporting and attribution across platforms.
5. Acts autonomously within guardrails the user defines.

### 1.4 Target customers (personas)
| Persona | Need | Plan tier |
|---|---|---|
| **Solo e-commerce founder** | "Just run my ads profitably" — full autopilot | Starter |
| **In-house marketer (SMB)** | Save time, scale spend, clear reporting | Growth |
| **Performance/media agency** | Manage many clients, white-label, bulk ops | Agency |
| **D2C brand at scale** | Advanced rules, custom attribution, API access | Scale/Enterprise |

### 1.5 Differentiators
- **True cross-platform autopilot** (most tools cover one platform or are reporting-only).
- **AI creative + AI strategist** in one loop (generate → launch → learn → regenerate).
- **Explainable automation** — every automated action is logged with a human-readable reason and is reversible.
- **Guardrails-first** — hard spend caps, approval gates, and rollback.

---

## 2. Scope — What "Everything" Means

### 2.1 Account & connection management
- OAuth connection to Meta Business and Google Ads accounts (multi-account).
- Token refresh, permission checks, MCC / Business Manager hierarchy support.
- Health monitoring (disapproved ads, billing issues, policy flags, API quota).

### 2.2 Campaign lifecycle automation
- **Create**: campaigns, ad sets/ad groups, ads from briefs or templates.
- **Launch**: scheduling, phased rollout, A/B test setup.
- **Manage**: pause/enable, budget shifts, audience edits, keyword/negatives management.
- **Optimize**: bid strategy tuning, budget reallocation, creative rotation.
- **Scale / Kill**: auto-scale winners, auto-pause losers.

### 2.3 Creative automation
- AI ad **copy** generation (headlines, primary text, descriptions, CTAs) per platform spec.
- AI **image / video** generation and resizing to all placement aspect ratios.
- Creative variant testing and dynamic creative optimization (DCO).
- Brand voice / asset library and compliance checks.

### 2.4 Budget & bid optimization
- Rule engine + ML model for budget pacing and reallocation.
- Cross-platform budget allocation ("spend where ROAS is best").
- Bid strategy recommendations and auto-application.
- Dayparting, spend caps, and pacing alerts.

### 2.5 Audience & targeting
- Audience builder, lookalikes/similar audiences, custom audience sync.
- Negative keyword/audience automation.
- Search term mining → keyword/negative suggestions (Google).

### 2.6 Reporting & analytics
- Unified cross-platform dashboard (spend, ROAS, CPA, CTR, conversions).
- Custom reports, scheduled email/Slack delivery, white-label PDFs.
- Attribution view (platform-reported + optional blended/MMM-lite).
- Anomaly detection and alerts.

### 2.7 Automation rules & playbooks
- No-code rule builder ("IF CPA > X for 3 days THEN pause").
- Prebuilt playbook templates per objective (lead gen, e-com ROAS, app installs).
- AI "autopilot mode" with confidence thresholds and approval gates.

### 2.8 Collaboration & governance
- Multi-user, roles/permissions, client workspaces (agency).
- Approval workflows, audit log, change history, rollback.
- Notifications: in-app, email, Slack, webhook.

---

## 3. Platform Integration Details

### 3.1 Meta (Facebook/Instagram)
- **API**: Meta Marketing API (Graph API), latest stable version; pin and track deprecations.
- **Auth**: Facebook Login + Business Login; System Users for server-to-server.
- **Key objects**: Business, Ad Account, Campaign, Ad Set, Ad, Creative, Custom Audience, Pixel/Conversions API (CAPI).
- **Capabilities used**: Insights API (reporting), Conversions API (server events), Creative & DCO, Audience APIs, Async batch jobs.
- **Constraints**: App Review for `ads_management`/`ads_read`; rate limits (BUC — Business Use Case rate limiting); 2-hour insights data freshness; review/approval latency.

### 3.2 Google Ads
- **API**: Google Ads API (gRPC/REST), pinned version; developer token (Basic → Standard access).
- **Auth**: OAuth 2.0; MCC (manager account) `login-customer-id` for agency hierarchies.
- **Key objects**: Customer, Campaign, AdGroup, Ad, Keyword, Asset/AssetGroup (PMax), ConversionAction, Audience.
- **Capabilities used**: GoogleAdsService (GAQL queries), Recommendations API, mutate/batch jobs, Offline Conversion Import / Enhanced Conversions, Smart Bidding controls.
- **Constraints**: Developer token approval; daily operation quotas; PMax limited granular control; required minimum disclosures for automated changes.

### 3.3 Integration design principles
- One **adapter per platform** behind a common internal interface (`CampaignProvider`).
- Normalize platform entities into a **canonical data model** (see §5).
- All writes go through a **command queue** with idempotency keys, retries with backoff, and dry-run support.
- Respect rate limits via per-account token buckets; degrade gracefully.

---

## 4. System Architecture

### 4.1 High-level
```
                ┌────────────────────────────────────────────────┐
                │                  Web App (SPA)                   │
                │   Dashboards · Rule builder · Creative studio    │
                └───────────────────────┬────────────────────────┘
                                        │ HTTPS / REST + WS
                ┌───────────────────────▼────────────────────────┐
                │                   API Gateway                    │
                │        Auth (JWT) · RBAC · Rate limiting         │
                └───────┬───────────────┬───────────────┬────────┘
                        │               │               │
            ┌───────────▼──┐   ┌────────▼────────┐  ┌───▼──────────┐
            │ Core Service │   │ Automation Engine│  │ Creative AI  │
            │ (CRUD, orgs) │   │ (rules, ML, jobs)│  │  Service     │
            └──────┬───────┘   └───────┬─────────┘  └──────┬───────┘
                  │                   │                    │
        ┌──────────▼───────────────────▼────────────────────▼────────┐
        │                Integration Layer (adapters)                 │
        │   Meta Adapter        Google Ads Adapter     (future: TikTok)│
        └──────────┬───────────────────┬────────────────────┬────────┘
                  │                   │                    │
            Meta Marketing API   Google Ads API        LLM / Image APIs

   Cross-cutting: Postgres · Redis (queue/cache) · Object store · Data warehouse
                  · Event bus · Scheduler/Workers · Observability
```

### 4.2 Components
- **Web app**: React + TypeScript SPA; component lib + charts.
- **API gateway / BFF**: authentication, RBAC, request validation.
- **Core service**: orgs, users, accounts, billing, settings.
- **Automation engine**: rule evaluation, scheduling, ML optimization, action queue.
- **Creative AI service**: copy + image/video generation, brand checks, asset storage.
- **Integration layer**: per-platform adapters, sync workers, command executors.
- **Data pipeline**: scheduled pulls of insights → warehouse → metrics/aggregations.
- **Notification service**: email/Slack/webhook/in-app.

### 4.3 Suggested tech stack (proposal — adjust to team skills)
| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript, Vite, Tailwind, shadcn/ui | Fast, typed, good ecosystem |
| Charts | Recharts / visx | Dashboards |
| Backend | Node.js (NestJS) **or** Python (FastAPI) | Strong API SDKs both platforms |
| Async/jobs | Redis + BullMQ (Node) / Celery (Python) | Queues, scheduling, retries |
| DB | PostgreSQL | Relational + JSONB for platform payloads |
| Warehouse | BigQuery / ClickHouse | Analytics at scale |
| Cache/queue | Redis | Rate-limit buckets, caching |
| Object storage | S3-compatible | Creatives, exports |
| AI | LLM API for copy; image/video gen API | Creative generation |
| Auth | OAuth2 + JWT; SSO (SAML/OIDC) later | Standard |
| Infra | Docker, Kubernetes/managed, IaC (Terraform) | Reproducible |
| Observability | OpenTelemetry, Grafana, Sentry | Reliability |
| Payments | Stripe (subscriptions + usage) | SaaS billing |

> **Build approach (decided):** This is a **full-stack, code-first product** built and owned by a full-stack development team. We do **not** use no-code/workflow-automation platforms (e.g. n8n, Zapier, Make) for the core product. All automation, integrations, and the rule engine are first-class application services we write and control — so we own the logic, scaling, reliability, and IP. Managed building blocks (managed Postgres, managed K8s, Stripe, cloud LLM/image APIs) are fine as infrastructure, but the orchestration is our own code, not a visual workflow tool.

---

## 5. Canonical Data Model (core entities)

```
Organization 1─* Workspace 1─* AdAccountConnection (platform: meta|google)
Organization 1─* User (role)
AdAccountConnection 1─* Campaign 1─* AdGroup 1─* Ad 1─* Creative
Campaign 1─* MetricSnapshot (date, spend, impr, clicks, conv, revenue, roas, cpa…)
Workspace  1─* AutomationRule 1─* RuleExecution (action, reason, before/after, status)
Workspace  1─* Playbook
Creative   *─* Asset (image/video/text)
AutomationRule 1─* ActionCommand (queued → executing → done/failed, idempotency_key)
AuditLog (actor, entity, change, timestamp, reversible_to)
```

Design notes:
- Store raw platform payloads in JSONB alongside normalized columns.
- All metrics keyed by canonical IDs + platform-native IDs for traceability.
- Every mutating action recorded in `AuditLog` with rollback pointer.

---

## 6. Automation Engine Design

### 6.1 Rule model
```
WHEN  <trigger / schedule>
IF    <conditions on metrics over a window>     e.g. CPA > 1.5 × target for 3 days
THEN  <actions>                                 e.g. reduce budget 20%, then pause
WITH  <guardrails>                              caps, cooldowns, approval-required
```

### 6.2 Execution flow
1. **Scheduler** triggers rule evaluation (cron + event-driven).
2. **Evaluator** pulls latest metrics, checks conditions, respects cooldowns.
3. **Planner** turns decisions into platform-agnostic `ActionCommands`.
4. **Guardrail check**: spend caps, change-rate limits, approval gates.
5. **Executor** dispatches via adapters with idempotency + retries; supports dry-run.
6. **Logger** records action + human-readable reason; emits notification.
7. **Rollback** available from audit log.

### 6.3 AI optimization layers
- **Recommendations**: surface platform-native recommendations + AdPilot's own.
- **Budget allocator**: reallocate spend toward best marginal ROAS (multi-armed bandit / constrained optimization).
- **Autopilot**: LLM "strategist" proposes changes with a confidence score; below threshold → suggestion, above → auto-apply (within guardrails).
- **Anomaly detection**: statistical + ML alerting on spend/conv spikes & drops.

### 6.4 Safety / guardrails (non-negotiable)
- Hard per-account and per-workspace daily spend caps.
- Max % change per action and per day (rate limiting changes).
- Approval gates for high-impact actions (e.g., >X budget change, new campaign).
- "Pause everything" kill switch.
- Full dry-run / sandbox mode before going live.

---

## 7. Product Roadmap (phased)

### Phase 0 — Foundations (Weeks 1–4)
- Repo, CI/CD, infra scaffolding, IaC.
- Auth, orgs/workspaces/users, RBAC.
- OAuth connection flows for Meta & Google (read-only first).
- Data pull: pull campaign structure + insights into warehouse.
- **Milestone**: connect an account and see unified read-only dashboard.

### Phase 1 — MVP: Read + basic actions (Weeks 5–12)
- Unified cross-platform dashboard (spend, ROAS, CPA, CTR, conversions).
- Manual actions via UI: pause/enable, budget edit (write to both APIs).
- Basic rule builder (3–5 condition types, pause/budget actions).
- Alerts (email/Slack) + audit log + rollback.
- Stripe billing, Starter/Growth tiers.
- **Milestone**: paying beta users run real rules on real spend.

### Phase 2 — Creative + smarter automation (Weeks 13–24)
- Creative studio: AI copy + image generation, per-placement resizing.
- A/B test setup + creative rotation.
- Prebuilt playbooks per objective.
- Budget allocator (cross-platform reallocation).
- Search-term mining & negative keyword automation (Google).
- Scheduled/white-label reports.
- **Milestone**: end-to-end "brief → live campaign → optimized" loop.

### Phase 3 — Autopilot + scale (Weeks 25–40)
- AI strategist autopilot with confidence thresholds + approval gates.
- Anomaly detection, advanced attribution view.
- Agency features: client workspaces, white-label, bulk operations.
- Conversions API / Enhanced Conversions server-side tracking.
- API access + webhooks for power users.
- **Milestone**: hands-off autopilot trusted on production accounts.

### Phase 4 — Expansion (Weeks 40+)
- Additional channels (TikTok, LinkedIn, Microsoft Ads).
- Blended/MMM-lite attribution, incrementality testing.
- Marketplace of community playbooks.
- Enterprise: SSO, audit/compliance, SLAs.

---

## 8. Compliance, Legal & Risk

### 8.1 Platform policy
- Must pass **Meta App Review** (`ads_management`) and **Google Ads API token** approval (Basic→Standard).
- Comply with both platforms' **API Terms** and **required minimum functionality** (e.g., Google's RMF for tools that make automated changes — must show changes and let users edit).
- Honor automated-change disclosure and not misrepresent data.

### 8.2 Data & privacy
- GDPR/CCPA: data processing agreements, data residency options, deletion/export.
- Secure storage of OAuth tokens (encryption at rest, secret manager).
- PII handling for Custom Audiences / Conversions API (hashing, consent).
- SOC 2 readiness as you move upmarket.

> **Security is a first-class requirement.** Because AdPilot holds OAuth tokens
> that spend real money and stores customer PII, the full defense-in-depth
> design — threat model, token encryption (KMS/HSM), tenant isolation (Postgres
> RLS), money-movement guardrails, AI/prompt-injection defenses, SDLC, and a
> pre-GA hardening checklist — lives in **[`security-architecture.md`](./security-architecture.md)**.

### 8.3 Key risks & mitigations
| Risk | Mitigation |
|---|---|
| API deprecations / version changes | Pin versions, adapter pattern, deprecation monitoring |
| Rate limits / quota exhaustion | Token-bucket throttling, batching, caching, backoff |
| Automated action causes overspend | Hard caps, change-rate limits, approval gates, kill switch |
| App Review delays | Start review early; build read-only first |
| AI generates non-compliant creative | Policy/brand checks before publish; human approval gate |
| Attribution mismatch vs platform | Be transparent; show platform-reported + blended separately |

---

## 9. Monetization

### 9.1 Pricing model (proposal)
- **Tiered subscription** by managed ad spend + features, with usage add-ons (AI creative credits, extra accounts/seats).

| Tier | Target | Indicative price | Includes |
|---|---|---|---|
| Starter | Solo / small e-com | $/mo, low ad-spend cap | 1–2 accounts, basic rules, dashboard |
| Growth | SMB | $$/mo | More accounts/seats, playbooks, AI creative quota |
| Agency | Agencies | $$$/mo | Client workspaces, white-label, bulk ops |
| Scale/Enterprise | Large brands | Custom | API, SSO, SLA, custom attribution |

> Common lever: small **% of managed ad spend** above thresholds (align price with value). Validate against competitors and willingness-to-pay.

### 9.2 Key metrics to track
- Activation: % connecting both platforms; time-to-first-rule.
- Engagement: rules active, automated actions/week, AI creatives generated.
- Value: ROAS/CPA improvement vs baseline (the core proof).
- Business: MRR, churn, NRR, CAC payback, managed spend.

---

## 10. Team & Execution

### 10.1 Minimum team for MVP
- 1 product/founder (strategy, ads domain expertise)
- 2 full-stack engineers (one focused on integrations)
- 1 frontend engineer
- 1 part-time designer
- (Phase 2+) 1 data/ML engineer, 1 customer success

### 10.2 Engineering practices
- Trunk-based dev with feature flags; CI/CD with automated tests.
- Contract tests against sandboxed/mock platform APIs.
- Staging environment with test ad accounts.
- Observability + on-call for the automation engine (it spends real money).

### 10.3 Go-to-market (brief)
- Beta with 10–20 design partners (e-com + small agencies) for case studies.
- Lead with the ROAS-improvement proof + time saved.
- Content/SEO on "Meta vs Google budget allocation", templates, free audit tool as top-of-funnel.

---

## 11. Open Questions / Decisions to Make
1. Backend language: **Node (NestJS)** vs **Python (FastAPI)** — pick based on team strength (both have solid Google/Meta SDK support).
2. ~~Managed stack vs custom~~ — **Decided: full-stack custom build, no no-code/n8n.** Remaining choice: which parts (if any) use managed infra (managed Postgres/K8s) vs self-hosted.
3. Autopilot default: opt-in suggestions first, or aggressive automation with guardrails?
4. Attribution stance: platform-reported only at launch, or invest early in blended?
5. Pricing: flat tiers vs % of ad spend vs hybrid.
6. Initial ICP focus: e-commerce D2C vs lead-gen — affects playbooks and metrics.

---

## 12. Immediate Next Steps (first 2 weeks)
1. Apply for **Meta App Review** and **Google Ads API developer token** (longest lead time — start now).
2. Validate ICP & pricing with 10 target-customer interviews.
3. Stand up repo, CI/CD, and OAuth connection prototypes (read-only) for both platforms.
4. Build the unified read-only dashboard as the first demo-able artifact.
5. Recruit 10–20 design partners for the beta.

---

*This is a living document. Update version and date on each revision.*
