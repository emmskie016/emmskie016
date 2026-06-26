# Skill: debug-issue

## Steps
1. **Reproduce** or reason precisely about the failure. Get the exact error + conditions.
2. Gather evidence: logs, stack trace, recent diffs, inputs. Form a hypothesis.
3. Localize: narrow to the smallest failing unit (binary-search the code path / git history).
4. Find the **root cause** — not just the symptom.
5. Write a **failing test** that reproduces it (turns the bug into a regression guard).
6. Apply the **minimal fix** that addresses the cause.
7. Separate clearly: root cause → minimal fix → optional follow-up hardening.
8. Verify the test passes and nothing else broke (`pnpm check`).

## Rules
- Don't claim it's fixed unless the logic actually addresses the cause.
- Before running anything destructive to investigate, confirm it's safe.
- If the cause is environmental/data, say so rather than patching code blindly.

## Output
Root cause explanation, the regression test, the fix diff, and verification result.
