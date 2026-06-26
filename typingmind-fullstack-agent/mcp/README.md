# MCP tools for the Full‑Stack Dev agent

Your TypingMind **MCP Connector** (the `npx @typingmind/mcp ...` process showing **Ready** at
`http://localhost:50880`) lets the agent use real tools instead of only chatting. This is the
"tool‑constrained access" piece of the 2026 workflow (`knowledge-base/06-context-engineering.md`).

## What the connector is (and isn't)
- ✅ It runs MCP **tool servers** on your machine and exposes them to your TypingMind agents.
- ❌ It is **not** an API for creating agents or uploading the knowledge base. Do that in the
  browser using `../typingmind-IMPORT.md`.
- The connector listens on `localhost`, so it's only reachable from your own machine — a remote
  assistant can't call it for you.

## Setup
1. Keep the connector running (your screenshot shows it Ready — good). It was started with:
   `PORT=50880 npx @typingmind/mcp <your-token>`
2. In TypingMind: **Settings → Advanced/Connectors → MCP Connectors** → open your connector →
   **Edit Config** (the MCP servers JSON).
3. Paste the contents of `typingmind-mcp-servers.json`, then **replace every `<...>` placeholder**
   (project path, GitHub token, DB URL). Delete any server you don't need.
4. Save and let the connector restart the servers. Status should return to **Ready**.
5. In the **Full‑Stack Dev** agent → **Plugins/Tools**, enable the MCP tools now exposed by the
   connector (filesystem, git, github, fetch, postgres).

## Prerequisites on your machine
- **Node.js** (for `npx` servers: filesystem, github, postgres).
- **uv** for the Python servers (`git`, `fetch`): https://docs.astral.sh/uv  (gives you `uvx`).
- A **fine‑grained GitHub PAT** scoped to the repos you want, if using the `github` server.
- A **read‑only** Postgres role for the `postgres` server (don't hand the agent write access to a DB).

## Least privilege (matches the agent's rules)
- Point `filesystem` at **one** project root — the agent can't escape it.
- Use a **read‑only** DB role; let writes happen through migrations/code you review.
- The agent's system prompt already requires confirmation before destructive actions — keep that.

## Suggested servers by task
| Server | Gives the agent |
|--------|-----------------|
| filesystem | read/edit project code, scaffold files |
| git | diffs, history, commits |
| github | PRs, issues, cross-repo code search |
| fetch | current docs, package versions, error lookups |
| postgres | schema introspection + read queries |

Add more later (e.g. a Playwright/browser server for e2e, a Docker server for infra) the same way.
