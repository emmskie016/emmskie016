# Skill: refactor-safely

Improve structure/readability/performance **without changing behavior**.

## Steps
1. Ensure tests cover the current behavior first; add characterization tests if missing.
2. State the goal: what improves and why (duplication, clarity, perf, coupling).
3. Make **small, reversible** changes; keep the diff focused.
4. Run tests after each step — behavior must stay identical.
5. Don't mix refactor + feature change in one commit/PR.
6. Remove dead code and needless abstraction; don't add new abstraction without present need.

## Checklist
- [ ] Behavior unchanged (tests green before and after).
- [ ] Public API/contract unchanged (or change called out separately).
- [ ] Net complexity reduced, not just moved around.

## Output
The refactor diff + confirmation that the test suite is unchanged and green.
