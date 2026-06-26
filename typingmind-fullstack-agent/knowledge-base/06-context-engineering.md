# Context Engineering & AGENTS.md

> Second core technique from the video: AI agents don't operate in isolation — they run inside
> a **structured execution environment** of context files, reusable skills, and tool-constrained
> access. Good context engineering is what makes an agent reliable.

## The context stack (most → least stable)
1. **System prompt** — the agent's role and operating rules (frozen). → `system-prompt.md`
2. **AGENTS.md** — project-level facts and guardrails the agent reads first. → `/AGENTS.md`
3. **Knowledge base** (RAG) — stack, conventions, patterns, this folder.
4. **Skills** — reusable task playbooks. → `skills/`
5. **Specs** — per-feature blueprints (volatile, task-specific). → `/docs/specs`

Keep stable context first and volatile context (the current task/spec) last. That's both good
prompting *and* good prompt-cache hygiene.

## AGENTS.md — the project guardrail file
A single Markdown file at the repo root that any AI tool (and any teammate) reads to understand
the project. Keep it short, factual, current. A starter template ships at `/AGENTS.md` in this
pack. It should contain:
- One-line project description.
- The stack (point to `01-stack-and-conventions.md`).
- Commands: install, dev, build, test, lint, typecheck.
- Conventions and "don'ts" the agent must respect.
- How to run and where things live (folder map).
- Definition of done.

> Update AGENTS.md whenever the project's facts change. Stale context = wrong code.

## Tool-constrained access (least privilege)
Only enable the tools the agent needs for the task:
- Reading/searching code, running tests, web search for current docs → safe, enable freely.
- Anything destructive (delete, force-push, drop data, deploy) → require explicit confirmation.
- Don't give an agent broad write/exec access for a read-only question.

## Context hygiene rules
- Give the agent the **reason** behind a request, not just the request — it connects the task
  to the right code instead of guessing intent.
- Point it at the relevant spec/skill/files; don't make it search the whole repo blindly.
- Re-ground long sessions: restate the current task and constraints when context drifts.
- Prefer many small, focused docs over one giant file (better retrieval).

## Skills (reusable playbooks)
A **skill** is a short, repeatable procedure for a common full-stack task (scaffold a feature,
design a schema, build an endpoint, write tests, audit security…). They live in `skills/` and
keep the agent consistent across runs. See `skills/README.md`.

## Sub-agent roles
For larger work, the agent reasons in distinct **roles** (architect → backend → frontend →
DB → QA → reviewer), each with its own focus. These are defined in `agents/` and let a single
TypingMind agent simulate a full engineering pipeline. See `agents/README.md`.
