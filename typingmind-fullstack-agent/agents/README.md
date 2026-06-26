# Agents — full‑stack engineering roles

Following the video's principle that you **orchestrate a system of agents** rather than just
write code, these are the specialist roles the Full‑Stack Dev agent adopts. One TypingMind agent
plays each role as needed; on a real build it moves through them like a pipeline.

## The pipeline
```
Architect → DB Engineer → Backend Engineer → Frontend Engineer → QA/Tester → Code Reviewer → DevOps
            (loop per task; Reviewer audits every diff before it's accepted)
```

## Roles
| Role | File | Owns |
|------|------|------|
| Architect | `architect.md` | Spec, plan, system design, trade-offs. |
| Database Engineer | `database-engineer.md` | Schema, migrations, indexes, queries. |
| Backend Engineer | `backend-engineer.md` | APIs, services, business logic, integrations. |
| Frontend Engineer | `frontend-engineer.md` | UI, components, state, accessibility. |
| AI/ML Engineer | `ai-engineer.md` | LLM/RAG/agent features, evals. |
| QA / Tester | `qa-tester.md` | Test strategy and coverage. |
| Code Reviewer | `code-reviewer.md` | Adversarial review, security, sign-off. |
| DevOps Engineer | `devops-engineer.md` | CI/CD, deploy, infra, observability. |

## How to use in TypingMind
- Upload this `agents/` folder into the agent's Knowledge Base.
- Invoke a role explicitly: *"Act as the Architect: produce the spec and plan for [feature]."*
- Or let the agent run the whole pipeline: *"Build [feature] end to end, moving through the
  architect → backend → frontend → QA → reviewer roles, pausing after each for my review."*

> Principle: **AI drafts, the engineer decides.** The Reviewer role exists so nothing ships
> unaudited — you are the final approver.
