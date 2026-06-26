# Spec‑Driven Development Workflow

> Core technique from **"How Senior Engineers Actually Build With AI in 2026."** Don't ask the
> agent to "build X" cold. Drive every non-trivial feature through four phases. The spec is an
> **executable blueprint** the agent implements against — and you audit.

## The loop: Specify → Plan → Tasks → Implement

### 1. Specify  (the *what* and *why*)
Write a short Markdown spec in `/docs/specs/<feature>/spec.md`:
- **Problem / goal** — what user need, why now.
- **Scope** — what's in, what's explicitly out.
- **Requirements** — numbered, testable statements ("R1: a user can…").
- **Data** — entities, fields, relationships.
- **Contracts** — API endpoints / events with request/response shapes.
- **Acceptance criteria** — how we know it's done (maps to tests).
- **Non-functional** — perf, security, accessibility constraints.

> Ask the agent: *"Draft a spec for [feature] following our spec template. Ask me anything
> ambiguous before writing."*

### 2. Plan  (the *how*)
`/docs/specs/<feature>/plan.md`:
- Architecture decisions and trade-offs (and why this option).
- Affected modules/files; new vs changed.
- Data model + migrations.
- Risks, edge cases, rollout/rollback.

> *"From the spec, produce an implementation plan. Recommend one approach; flag risks."*

### 3. Tasks  (the *steps*)
`/docs/specs/<feature>/tasks.md` — ordered, small, independently verifiable:
```
[ ] T1: add migration + schema for <entity>
[ ] T2: repository methods + unit tests
[ ] T3: API endpoint + Zod validation + tests
[ ] T4: frontend component + states (loading/error/empty)
[ ] T5: e2e happy path
```

> *"Break the plan into a checklist of small, verifiable tasks in dependency order."*

### 4. Implement  (one task at a time)
- Implement **one task**, run its tests, then move on. Don't batch the whole feature blind.
- After each task: typecheck + test, then audit the diff against `04-review-checklist.md`.
- Update `tasks.md` checkboxes as you go.

> *"Implement T1 only. Show the diff and the tests. Stop and let me review before T2."*

## Why this works with AI
- The spec gives the agent **bounded, unambiguous context** → fewer wrong guesses.
- Small tasks → small diffs → reviewable → catch errors early.
- Specs + plans become durable docs and great knowledge-base material.

## Tiered rigor
Match effort to risk — don't over-process a throwaway, don't under-process a payment path.

| Tier | Examples | Process |
|------|----------|---------|
| Low | internal script, prototype, copy tweak | light spec, minimal tests |
| Standard | normal feature | full Specify→Plan→Tasks→Implement, unit+integration tests |
| High | auth, payments, data migration, anything irreversible | detailed spec, threat model, extra reviewer, e2e + rollback plan |
