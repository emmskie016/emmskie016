# Skill: build-rest-api

## Steps
1. Define the contract: method, path, request body/params, response shape, status codes.
2. Write the **Zod schema** (in `packages/shared`) for input + output; infer the types.
3. Controller/route: parse + validate input with Zod → return 422 on failure.
4. Delegate to a **service/use-case**; keep business logic out of the handler.
5. Data access via the **repository layer** (no raw SQL in handlers).
6. **Authn + authz**: verify identity from the token; authorize the actor against the resource.
7. Errors: consistent envelope `{ data, error }`; correct status (400/401/403/404/409/422/5xx).
8. Tests: unit (service), integration (endpoint incl. auth + validation failure paths).

## Checklist
- [ ] Input validated at the boundary; never trust the client.
- [ ] Parameterized queries only.
- [ ] List endpoints paginated; no unbounded results.
- [ ] No secrets/sensitive data leaked in responses or error messages.
- [ ] Idempotency considered for retryable operations.

## Output
Zod schema + route + service + repository changes + tests, each shown as a diff.
