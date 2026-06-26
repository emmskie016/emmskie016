# Skill: scaffold-feature

End-to-end procedure for shipping a new feature. Combines spec-driven dev with the full stack.

## Steps
1. **Spec** — write `/docs/specs/<feature>/spec.md` (problem, requirements R1.., data,
   contracts, acceptance criteria). Ask clarifying questions first if ambiguous.
2. **Plan** — `plan.md`: architecture decision (one recommendation), affected files, data model
   + migration, risks.
3. **Tasks** — `tasks.md`: ordered, small checklist (migration → repo → API → UI → e2e).
4. **Implement per task**, in this order, testing each before the next:
   - **DB:** migration + schema (`design-database-schema`).
   - **Backend:** repository methods + endpoint + Zod validation (`build-rest-api`).
   - **Shared:** types/Zod schemas in `packages/shared`.
   - **Frontend:** component/page with loading/error/empty states (`build-frontend-component`).
   - **Tests:** unit + integration + e2e happy path (`write-tests`).
5. **Audit** — review the full diff against `04-review-checklist.md`. Run `pnpm check`.
6. **Done** — update tasks checkboxes; note any breaking changes.

## Output expectations
- Show diffs per task, not one giant dump.
- State assumptions made. Stop for review at risky steps.
