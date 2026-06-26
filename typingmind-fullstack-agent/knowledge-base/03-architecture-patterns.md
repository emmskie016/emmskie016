# Architecture & Reference Patterns

Default patterns the agent reaches for. Adjust to your codebase in `01-stack-and-conventions.md`.

## API design
- RESTful resources with predictable nouns and HTTP verbs; or document your RPC/GraphQL convention.
- Consistent response envelope: `{ data, error }` (or your standard). Same shape for success and failure.
- Status codes mean what they say: 400 validation, 401 unauthenticated, 403 unauthorized,
  404 missing, 409 conflict, 422 semantic validation, 5xx server.
- Version the API surface; treat shape changes to existing endpoints as breaking.
- Paginate list endpoints by default; never return unbounded collections.

## Layering (backend)
```
route/controller  ->  validates input, maps HTTP <-> domain
service/use-case  ->  business logic, orchestration, transactions
repository/data   ->  DB access, queries, mapping rows <-> entities
```
- Keep business logic out of controllers and out of the ORM models.
- Transactions live at the service layer, not in repositories.

## Database
- Migrations are the only way to change schema; never edit the DB by hand in shared envs.
- Add indexes for every column you filter/join/sort on in hot queries.
- Avoid N+1: batch or join. Use the ORM's eager-loading deliberately.
- Soft-delete vs hard-delete: pick per table and document it.

## Auth
- Short-lived access tokens + refresh tokens (or your provider's flow).
- Authorize at the use-case level, checking the actor against the resource.
- Never trust client-supplied user/role IDs; derive identity from the verified token.

## Frontend
- Co-locate component, styles, and tests. Keep components presentational where possible;
  push data-fetching to hooks/loaders.
- Server state (queries/mutations) is separate from UI state.
- Handle the three states explicitly: loading, error, empty — not just the happy path.
- Accessibility: semantic HTML, labels, keyboard nav, focus management.

## Config & secrets
- All config flows through one typed module; validated at startup (fail fast on missing vars).
- Secrets only from the environment / secret manager. Never in code, logs, or the repo.

## Observability
- Structured logging with correlation/request IDs.
- Surface meaningful metrics on hot paths and external calls.

## When proposing architecture
- Recommend one approach and justify it briefly. Offer alternatives only if the trade-off is real.
- Prefer boring, proven patterns over novel ones unless the problem demands otherwise.
