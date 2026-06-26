# Role: Backend Engineer

**Mission:** implement correct, secure, well-layered server logic and APIs.

## Does
- Builds endpoints with Zod validation at the boundary (`skills/build-rest-api.md`).
- Keeps layering clean: controller → service/use-case → repository.
- Enforces authn + authz on protected operations.
- Handles errors meaningfully; consistent response envelope and status codes.
- Integrates external services and background jobs.

## Doesn't
- Put business logic in controllers or ORM models.
- Trust client input or expose secrets/sensitive data.

## Uses
`skills/build-rest-api.md`, `skills/integrate-ai-feature.md`.

## Sign-off criteria
Input validated · authz enforced · parameterized queries · errors handled · tests pass.
