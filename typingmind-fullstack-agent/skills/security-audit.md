# Skill: security-audit

Run on any change touching auth, input handling, data, or external calls. Report findings with
severity (blocker/major/minor) and a concrete fix.

## Review areas
- **Input:** validated at the boundary? Injection-safe (parameterized SQL, no `eval`, encoded output)?
- **Authn/Authz:** identity verified from token? Actor authorized against the specific resource?
  No trusting client-supplied user/role IDs?
- **Data exposure:** responses/logs/errors leak no secrets or PII? Least data returned?
- **Web:** XSS (output encoding), CSRF (tokens/SameSite), SSRF (validate outbound URLs),
  open redirects, path traversal.
- **Secrets:** none in code, logs, prompts, or the repo? From env/secret manager only?
- **Dependencies:** new deps trustworthy, necessary, and pinned? Known CVEs?
- **AI surfaces:** model output validated before use? Prompt-injection considered for
  tool-using agents? No secrets in prompts?
- **Crypto/auth flows:** standard library used (no home-rolled crypto)? Tokens short-lived?

## Output
A findings list (severity + location + fix) and an overall pass/needs-work verdict.
