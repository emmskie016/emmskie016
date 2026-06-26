# Skill: integrate-ai-feature

For embedding an LLM / RAG / agent capability into the app (the "AI layer" of a full-stack AI app).

## Steps
1. Define the job precisely: input, desired output, success criteria, failure behavior.
2. Choose the surface: single LLM call (classify/summarize/extract) → simplest; tool-using
   workflow → multi-step; agent → only when the task is open-ended and worth it.
3. Keep the **provider behind an interface** so you can switch models (e.g. Claude ↔ GPT).
4. **RAG** (if grounding in your data): chunk → embed → store in `pgvector` → retrieve top-k →
   inject into the prompt. Cite sources.
5. **Structured output**: constrain responses to a schema (JSON schema / tool call) and validate.
6. Guardrails: validate/clean model output before use; handle refusals, timeouts, rate limits.
7. Never put secrets in prompts; never trust model output as code/SQL without checks.
8. Track cost + latency; cache stable prompt prefixes; stream long responses.
9. Test with fixed fixtures (deterministic) plus a few real-call smoke tests.

## Checklist
- [ ] Output validated against a schema before use.
- [ ] Failure paths handled (refusal, timeout, malformed output).
- [ ] No secrets/PII leaked into prompts or logs.
- [ ] Cost/latency observable; prompt caching where applicable.

## Output
The provider interface, the feature code, schema validation, and tests.
