# Skill: build-frontend-component

## Steps
1. Define props with a typed interface; keep the component focused (one job).
2. Separate **server state** (TanStack Query) from **UI state** (local/useState).
3. Handle all three states explicitly: **loading**, **error**, **empty** — not just happy path.
4. Use shadcn/ui + Tailwind; match existing components' structure and tokens.
5. Forms: validate with the shared Zod schema; show field-level errors.
6. Accessibility: semantic HTML, labels, keyboard nav, focus management, ARIA only when needed.
7. Co-locate the component, its styles, and its test.

## Checklist
- [ ] No business logic in the component — push to hooks/services.
- [ ] Loading/error/empty rendered.
- [ ] Accessible and keyboard-usable.
- [ ] Memoize only where it measurably helps; avoid premature optimization.
- [ ] Test covers render + key interaction.

## Output
Component + hook (if any) + test, shown as diffs.
