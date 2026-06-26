# Stack & Conventions (2026 AI‑Native Full‑Stack)

> Source of truth for the agent. Follows the **"How Senior Engineers Actually Build With AI in
> 2026"** principle: architecture-first, spec-driven, context-engineered. Edit the `[...]`
> placeholders to your reality — but this is a complete, opinionated default you can ship with.

## Guiding principle
> The skill in 2026 isn't typing code — it's the **system you build around the agent**.
> AI drafts, the engineer decides. Architecture and code auditing are the high‑value work.

## Recommended default stack (modern, AI‑native, TypeScript‑first)

| Layer | Default choice | Why |
|------|----------------|-----|
| Language | **TypeScript** (strict) end‑to‑end | One language across the stack; shared types. |
| Frontend | **React 19 + Vite**, **Tailwind CSS**, **shadcn/ui** | Fast, typed, component-driven, AI-friendly. |
| Routing/data | **TanStack Router + TanStack Query** | Typed routing, clean server-state separation. |
| Validation | **Zod** (shared client+server schemas) | One schema validates input and types it. |
| Backend | **Hono** or **Fastify** (Node) — or **Next.js** for full-stack | Lightweight, typed, edge-capable. |
| API style | **REST** (OpenAPI) or **tRPC** for TS-only apps | Predictable contracts; tRPC = end-to-end types. |
| Database | **PostgreSQL** | Reliable, relational, JSON + `pgvector` for AI. |
| ORM | **Drizzle** (or Prisma) | Typed queries, SQL-first migrations. |
| Auth | **better-auth** / **Clerk** / **Supabase Auth** | Don't roll your own auth. |
| AI layer | LLM via provider SDK + **RAG** (pgvector) + agents/tools | Embed AI alongside frontend/backend/DB. |
| Background jobs | **BullMQ** / queue, or platform jobs | Offload slow + async work. |
| Infra | **Docker**, deploy to **Vercel / Fly.io / AWS** | Reproducible builds; pick one target. |
| CI/CD | **GitHub Actions** | Lint + typecheck + test + deploy on every PR. |
| Testing | **Vitest** (unit/integration), **Playwright** (e2e) | Fast unit + real browser e2e. |
| Observability | Structured logs + **OpenTelemetry** + error tracking (Sentry) | See what production does. |
| Package manager | **pnpm** | Fast, strict, monorepo-friendly. |

> Python variant: **FastAPI + Pydantic + SQLAlchemy/SQLModel + Alembic + PostgreSQL + pytest**.
> Keep the *principles* identical; only swap the tools.

## Repo structure (monorepo default)
```
/apps/web         # React frontend
/apps/api         # backend service
/packages/shared  # shared TS types, Zod schemas, utils
/packages/db      # schema + migrations (Drizzle)
/infra            # Docker, IaC, deploy config
/docs/specs       # spec-driven dev: one folder per feature (see 05)
AGENTS.md         # context file the agent reads first (see 06)
```

## Hard rules (do)
- Use **pnpm** for all dependency operations.
- Everything is **typed**. No `any` without an explicit `// reason:` comment.
- Shared types and Zod schemas live in `packages/shared` and are imported, never duplicated.
- Every endpoint validates input with a **Zod schema** at the boundary.
- DB access goes through the **repository / Drizzle layer** — no raw SQL in route handlers.
- Config is read from one typed module, **validated at startup** (fail fast on missing env).
- Every feature starts from a **spec** in `/docs/specs` (see `05-spec-driven-workflow.md`).

## Hard rules (don't)
- Don't add a dependency without flagging it + the reason.
- Don't change a public API/contract without marking it breaking.
- Don't commit secrets, `.env`, or generated artifacts.
- Don't add an abstraction unless it removes real, present duplication.
- Don't merge AI-written code without review against `04-review-checklist.md`.

## Naming
- Files: kebab-case; React components: PascalCase.
- Variables/functions: camelCase. Constants: UPPER_SNAKE_CASE.
- DB: snake_case, plural table names.

## Definition of done
- Spec exists and is satisfied.
- Type-checks, lints, and tests pass (`pnpm check`).
- Tests added/updated for the change.
- Reviewed against the checklist; no secrets or debug code left in.
- Breaking changes documented.
