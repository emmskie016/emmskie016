# Stack & Conventions

> **EDIT THIS FILE.** Replace the placeholders with your real stack and rules. This is the
> single most important "training" document — the agent treats it as the source of truth and
> follows it over generic best practices when they conflict.

## Tech stack
- **Language(s):** [e.g. TypeScript (strict), Python 3.12]
- **Frontend:** [e.g. React 19 + Vite, Tailwind CSS, shadcn/ui]
- **Backend:** [e.g. Node.js + Express / Fastify, or FastAPI]
- **Database:** [e.g. PostgreSQL via Prisma / Drizzle]
- **Auth:** [e.g. JWT access + refresh, or Supabase Auth, or Clerk]
- **Infra / deploy:** [e.g. Docker, deployed to AWS ECS / Vercel]
- **Package manager:** [e.g. pnpm — never npm/yarn]
- **Testing:** [e.g. Vitest (unit), Playwright (e2e)]

## Repo structure
```
[ describe top-level folders, e.g. ]
/apps/web        # frontend
/apps/api        # backend
/packages/shared # shared types & utils
/infra           # IaC / docker
```

## Hard rules (do)
- Use [pnpm] for all dependency operations.
- All new code is fully typed. No `any` without an explicit `// reason:` comment.
- Shared types live in `[packages/shared]` and are imported, never duplicated.
- Every API endpoint validates its input with `[zod / pydantic]`.
- Database access goes through `[the repository layer / Prisma]` — no raw SQL in handlers
  except `[where allowed]`.
- Environment config is read from `[env.ts / settings.py]`, never `process.env` scattered.

## Hard rules (don't)
- Don't introduce a new dependency without flagging it and the reason.
- Don't change the public API shape without noting it's a breaking change.
- Don't commit secrets, `.env` files, or generated artifacts.
- Don't add a new abstraction layer unless it removes real, present duplication.

## Naming
- Files: [e.g. kebab-case for files, PascalCase for React components].
- Variables/functions: [e.g. camelCase]. Constants: [UPPER_SNAKE_CASE].
- Database: [e.g. snake_case tables/columns, plural table names].

## Definition of done
- Compiles / type-checks with no new errors.
- Tests added or updated for the change and passing.
- Lints clean (`[pnpm lint]`).
- No secrets, no debug logging left in.
