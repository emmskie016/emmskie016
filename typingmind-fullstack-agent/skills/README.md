# Skills — reusable full‑stack playbooks

Each skill is a short, repeatable procedure for a common full-stack task. The agent loads the
relevant one to stay consistent across runs. Invoke by naming the skill, e.g.
*"Use the `build-rest-api` skill to add `POST /invoices`."*

| Skill | Use when |
|-------|----------|
| `scaffold-feature` | Starting any new feature end-to-end (spec → ship). |
| `design-database-schema` | Modeling new data / tables / migrations. |
| `build-rest-api` | Adding or changing a backend endpoint. |
| `build-frontend-component` | Building a UI component/page with all states. |
| `integrate-ai-feature` | Adding an LLM / RAG / agent capability into the app. |
| `write-tests` | Adding unit / integration / e2e coverage. |
| `debug-issue` | Diagnosing and fixing a bug or failure. |
| `security-audit` | Reviewing a change or surface for security issues. |
| `setup-cicd-deploy` | Wiring CI/CD and deployment. |
| `refactor-safely` | Improving code without changing behavior. |

How to add the skills to TypingMind: upload this `skills/` folder into the agent's Knowledge
Base alongside `knowledge-base/`, or paste the relevant skill into a chat when you need it.
