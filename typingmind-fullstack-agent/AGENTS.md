# AGENTS.md

> Project guardrail file. Any AI agent (or teammate) reads this first. Keep it short, factual,
> and current. Edit the `[...]` bits for your project.

## Project
[One-line description of what this app does and who it's for.]

## Stack
TypeScript end-to-end. React + Vite + Tailwind + shadcn/ui (web), Hono/Fastify or Next.js (api),
PostgreSQL + Drizzle (db), Zod for validation, pnpm, Vitest + Playwright for tests.
Full detail: `knowledge-base/01-stack-and-conventions.md`.

## Commands
```
pnpm install        # install deps
pnpm dev            # run app locally
pnpm build          # production build
pnpm test           # run tests
pnpm lint           # lint
pnpm typecheck      # type check
pnpm check          # lint + typecheck + test (run before declaring done)
```

## Where things live
```
/apps/web · /apps/api · /packages/shared · /packages/db · /infra · /docs/specs
```

## How we work
1. Every non-trivial feature starts from a spec in `/docs/specs` — see
   `knowledge-base/05-spec-driven-workflow.md` (Specify → Plan → Tasks → Implement).
2. Implement one task at a time; test and review each diff before the next.
3. Use the skills in `skills/` and the role mindsets in `agents/`.

## Must respect
- Typed everything; no `any` without `// reason:`.
- Validate input with Zod at boundaries. DB access via the repository/Drizzle layer.
- No secrets in code. Config from one typed, startup-validated module.
- No new dependency without flagging it. No breaking contract change without saying so.
- AI-written code is reviewed against `knowledge-base/04-review-checklist.md` before merge.

## Definition of done
Spec satisfied · `pnpm check` green · tests added/updated · reviewed · no secrets/debug left ·
breaking changes documented.
