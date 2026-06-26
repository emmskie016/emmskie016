# Full‑Stack Dev — TypingMind AI Agent

A ready-to-use **Full Stack Developer** AI agent for [TypingMind](https://www.typingmind.com).
This folder contains everything you need to **connect** model providers, **create** the
agent, and **train** it (system prompt + knowledge base) so it behaves like a senior
full‑stack engineer.

> TypingMind is a "bring your own API key" chat UI. It does **not** fine‑tune models.
> "Training" an agent there means: a strong **system prompt** + a **knowledge base** (RAG)
> + the right **plugins/tools**. This pack gives you all three.

---

## What's in this folder

| File | Purpose |
|------|---------|
| `README.md` | This guide — connect, create, train, test. |
| `system-prompt.md` | The agent's system prompt. Paste into the agent's "Instructions" field. |
| `agent-config.json` | Reference config (name, model, params, plugins) you can mirror in the UI. |
| `knowledge-base/01-stack-and-conventions.md` | Your stack, conventions, do/don't rules. **Edit this.** |
| `knowledge-base/02-code-style.md` | Formatting, naming, testing, error-handling standards. |
| `knowledge-base/03-architecture-patterns.md` | Reference patterns (API, DB, auth, frontend). |
| `knowledge-base/04-review-checklist.md` | Checklist the agent uses for self-review & PR review. |

---

## Part 1 — Connect model providers

You chose to connect **both Claude (Anthropic) and OpenAI**, so you can switch models per task.

### A. Get API keys
- **Anthropic:** https://console.anthropic.com → *API Keys* → create key (`sk-ant-...`).
- **OpenAI:** https://platform.openai.com/api-keys → create key (`sk-...`).

### B. Add them in TypingMind
1. Open TypingMind → **Settings** (gear icon) → **API Keys / Model Providers**.
2. **Anthropic / Claude:** paste your `sk-ant-...` key. Enable the Claude models.
   - Recommended default for coding: **Claude Opus 4.8** (latest Opus — strongest agentic coding).
   - Cheaper/faster option: **Claude Sonnet 4.6** for high‑volume or quick edits.
3. **OpenAI:** paste your `sk-...` key. Enable the GPT models you want (e.g. the latest GPT‑4‑class model).
4. Click **Save / Test connection** — TypingMind validates each key.

> Tip: keys are stored locally in your browser (or your TypingMind Custom/Team backend),
> not sent to TypingMind's servers when you use the BYOK setup.

### C. Pick the default model
In the model dropdown (top of a chat), select your default. Use **Claude Opus 4.8** as the
agent's default and switch to GPT or Sonnet ad hoc when you want a second opinion or lower cost.

---

## Part 2 — Create the agent

TypingMind calls these **AI Agents** (older versions: "Characters" / "Custom Assistants").

1. Left sidebar → **Agents** (or **Characters**) → **Create Agent**.
2. **Name:** `Full‑Stack Dev`
3. **Model:** Claude Opus 4.8 (default). You can override per chat.
4. **Instructions / System Prompt:** open `system-prompt.md` in this folder, copy the whole
   thing, and paste it into the Instructions field.
5. **Model parameters** (Advanced settings):
   - Max tokens: `8000`+ (raise for long files; Claude 4.x supports large outputs).
   - Leave temperature at default. (Note: the latest Claude models ignore `temperature`/`top_p`;
     steer behavior through the prompt instead.)
6. Save.

See `agent-config.json` for a copy‑paste reference of these settings.

---

## Part 3 — Train the agent (knowledge base)

This is where the agent becomes *yours*. TypingMind's **Knowledge Base / Train AI** feature
embeds documents and retrieves relevant chunks at query time (RAG).

1. **Edit the knowledge files first** — especially `knowledge-base/01-stack-and-conventions.md`.
   Replace the placeholders with your real stack, repo conventions, and rules.
2. In TypingMind: open the **Full‑Stack Dev** agent → **Knowledge Base** (a.k.a. *Train* / *Documents*).
3. **Upload** all four files from `knowledge-base/`.
   - Or paste their contents as text documents if you prefer.
4. Wait for indexing/embedding to finish (status shows "Ready").
5. (Optional) Enable **"Always include knowledge base"** or set retrieval to automatic so the
   agent consults these docs on every relevant question.

> Keep the knowledge base small and high‑signal. RAG works best with focused, well‑structured
> docs (which is why these are split by topic). Re‑upload when your conventions change.

---

## Part 4 — Add tools / plugins (optional but recommended)

In the agent's **Plugins** tab, enable the ones that match your workflow:
- **Web Search / Web Browsing** — pull current docs, package versions, error messages.
- **Code execution / Sandbox** (if available on your plan) — run snippets, test output.
- **GitHub / HTTP request plugin** — fetch files, hit your APIs.
- **Image/Vision** — paste screenshots of UI bugs or error dialogs.

Only enable what you'll use — extra tools add latency and can dilute focus.

---

## Part 5 — Test it

Try these prompts after setup:

1. *"Scaffold a REST endpoint for `POST /users` following our conventions."*
   → Should reflect rules from your knowledge base.
2. *"Review this function for bugs and edge cases:"* (paste code)
   → Should use the review checklist (`04-review-checklist.md`).
3. *"Compare two approaches for handling auth tokens and recommend one."*
   → Should give a recommendation, not just options.
4. Switch the model to GPT and re‑ask #2 to get a second opinion.

If the agent ignores your conventions, confirm the knowledge base finished indexing and is
attached to *this* agent.

---

## Maintenance
- Update `knowledge-base/01-stack-and-conventions.md` whenever your stack changes, then re‑upload.
- Revisit `system-prompt.md` if the agent is too verbose / too terse / over‑engineers.
- Keep both providers' keys funded so model switching always works.
