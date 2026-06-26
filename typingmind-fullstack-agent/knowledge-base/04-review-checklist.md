# Code Review Checklist

The agent uses this when reviewing code or self-checking before declaring work done.
Report findings with a severity and a concrete fix:
**blocker** (must fix) · **major** · **minor** · **nit**.

## Correctness
- [ ] Does it actually do what was asked? Any logic errors?
- [ ] Edge cases handled: empty, null/undefined, zero, negative, very large, unicode?
- [ ] Off-by-one, boundary, and rounding errors?
- [ ] Concurrency / race conditions on shared state?
- [ ] Error and failure paths handled (not just the happy path)?

## Security
- [ ] Input validated at the boundary?
- [ ] Injection safe (SQL parameterized, no eval, output encoded)?
- [ ] AuthN + AuthZ enforced on protected operations?
- [ ] Secrets absent from code/logs? No sensitive data leaked in responses or errors?
- [ ] SSRF / path traversal / unsafe deserialization considered where relevant?
- [ ] Dependencies trustworthy and necessary?

## Reliability
- [ ] Errors surfaced meaningfully, not swallowed?
- [ ] Timeouts / retries / fallbacks for external calls?
- [ ] Resources cleaned up (connections, files, listeners)?
- [ ] Idempotency where the operation can be retried?

## Performance
- [ ] N+1 queries or unindexed hot-path queries?
- [ ] Unbounded loops, allocations, or result sets?
- [ ] Unnecessary work on the render/request critical path?

## Maintainability
- [ ] Matches existing style, naming, and structure?
- [ ] No needless abstraction or dead code?
- [ ] Names clear; intent obvious or commented where not?
- [ ] No duplication that should be shared?

## Tests
- [ ] New behavior covered? Bug fix has a regression test?
- [ ] Tests deterministic and meaningful (not asserting trivia)?

## Done
- [ ] Type-checks, lints, and tests pass?
- [ ] No debug logging, commented-out code, or leftover TODOs without context?
- [ ] Breaking changes to public APIs called out?
