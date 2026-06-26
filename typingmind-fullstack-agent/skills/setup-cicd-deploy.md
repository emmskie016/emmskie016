# Skill: setup-cicd-deploy

## CI (GitHub Actions) — on every PR
1. Install (cached pnpm).
2. `pnpm lint` → `pnpm typecheck` → `pnpm test`.
3. Build the app(s). Fail the PR on any red step.
4. (Optional) Playwright e2e on a preview deploy.

## CD — on merge to main
1. Build artifacts / Docker image.
2. Run migrations (gated, reversible).
3. Deploy to the target (Vercel / Fly.io / AWS). Keep a rollback path.
4. Smoke-test the deployment; alert on failure.

## Principles
- Secrets via the platform's secret store / GitHub Actions secrets — never in the repo.
- Migrations are forward-only in prod but must have a tested rollback plan.
- Environments: dev → staging → prod with the same build artifact promoted.
- Make builds reproducible (lockfile committed, pinned base images).

## Output
The workflow YAML, deploy config, and notes on required secrets/env vars.
