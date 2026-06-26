# Code Style & Quality Standards

General principles the agent applies to all code it writes or reviews. Override any of these
in `01-stack-and-conventions.md` if your team differs.

## Readability
- Code should read like the surrounding code: match comment density, naming, and idioms.
- Prefer clear names over clever ones. A longer descriptive name beats a short cryptic one.
- Keep functions focused — one job each. Extract when a function does two distinct things,
  not merely because it's long.
- Comment the *why*, not the *what*. Don't narrate obvious lines.

## Types & contracts
- Make illegal states unrepresentable where the type system allows.
- Validate at boundaries (HTTP handlers, message consumers, CLI args, third‑party responses).
  Trust internal calls and framework guarantees.
- Return typed, structured errors — not strings smuggled through happy-path returns.

## Error handling
- Never silently swallow errors. Log with context or propagate.
- Fail fast on programmer errors; degrade gracefully on expected runtime errors.
- User-facing error messages are actionable; internal logs carry the stack/context.

## Testing
- New behavior gets a test. Bug fixes get a regression test reproducing the bug.
- Test behavior and edge cases (empty, null, boundary, concurrency, failure paths), not
  implementation details.
- Keep tests deterministic — no real network, clock, or random unless controlled.

## Async & concurrency
- Always handle promise rejections / awaited errors.
- Be explicit about parallel vs sequential (`Promise.all` vs awaited loop) and why.
- Guard against race conditions on shared mutable state.

## Performance (only when it matters)
- Don't optimize prematurely. Call out hot paths, N+1 queries, and large allocations.
- Prefer indexed queries; flag full scans and unbounded result sets.

## Comments & docs
- Public functions/modules get a one-line purpose doc when non-obvious.
- TODOs include who/why or a ticket reference, never bare `// TODO`.

## Security defaults
- Parameterized queries only — never string-concatenate SQL.
- Escape/encode output for the target context (HTML, shell, URL).
- Authenticate then authorize on every protected operation.
- Treat all external input as hostile until validated.
