# Skill: write-tests

## Steps
1. Identify the behavior and its edge cases (empty, null, boundary, large, concurrent, failure).
2. Pick the level: **unit** (logic), **integration** (endpoint + DB), **e2e** (user flow).
3. For a bug fix, first write a **regression test** that reproduces the bug, then fix.
4. Test behavior and contracts, not implementation details.
5. Keep tests deterministic: control clock, randomness, network; no real external calls in unit.
6. Use Vitest for unit/integration, Playwright for e2e. Mirror your project's setup.

## Checklist
- [ ] Happy path + at least the key failure/edge paths covered.
- [ ] No flakiness (no real time/network/random uncontrolled).
- [ ] Assertions are meaningful, not trivial.
- [ ] Test names describe the behavior.

## Output
The test file(s) and a one-line note on what each test guards.
