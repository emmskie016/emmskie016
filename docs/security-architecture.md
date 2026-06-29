# AdPilot — Security Architecture & Hardening

> **Security design document** · v1.0 · Last updated: 2026-06-29
>
> AdPilot holds OAuth tokens that can **spend real advertising money** and
> contains customer PII (audiences, conversion data). Security is therefore a
> **product requirement, not a feature**. This document defines a
> defense-in-depth posture aiming to make the platform as resistant to
> compromise as practically possible.

---

## 1. Threat Model

### 1.1 What we protect
| Asset | Why it's high-value | Worst case |
|---|---|---|
| Meta / Google OAuth tokens & refresh tokens | Spend money, exfiltrate data | Attacker drains ad budgets, steals audiences |
| Customer PII (Custom Audiences, CAPI/Enhanced Conversions data) | GDPR/CCPA, reputational | Mass data breach, regulatory fines |
| Automation engine (writes to live ad accounts) | Moves money autonomously | Malicious budget changes, overspend |
| Billing data (handled by Stripe, not stored) | Financial fraud | Chargebacks, fraud |
| Internal secrets (API keys, DB creds, signing keys) | Pivot to everything | Full compromise |

### 1.2 Adversaries
- External attackers (credential stuffing, API abuse, supply-chain).
- Malicious / compromised tenants attempting cross-tenant access.
- Insider threats (employees, contractors).
- Compromised third-party dependencies or AI/LLM providers.

### 1.3 Key abuse cases (ads-specific)
- Stolen session → drains client ad spend or redirects traffic to malicious URLs via ad edits.
- Prompt injection into AI strategist/creative → unsafe automated actions.
- Tenant A reading Tenant B's metrics/audiences (broken object-level authZ).

---

## 2. Identity, Authentication & Sessions

- **MFA mandatory** for all accounts; TOTP + WebAuthn/passkeys; SMS only as last resort.
- **SSO / SAML / OIDC** for Agency & Enterprise; SCIM for provisioning/deprovisioning.
- **Passwords**: Argon2id hashing, breach-list (HIBP) checks, no arbitrary complexity rules, length-first.
- **Sessions**: short-lived JWT access tokens (≤15 min) + rotating refresh tokens; httpOnly + Secure + SameSite=strict cookies; bind sessions to device fingerprint; immediate revocation on logout/role change.
- **Brute-force defense**: progressive rate limiting, account lockout with exponential backoff, CAPTCHA on anomaly.
- **Step-up authentication** (re-auth / MFA challenge) required for high-risk actions: connecting an ad account, raising spend caps, deleting data, changing payment, inviting admins.

---

## 3. Authorization (the cross-tenant boundary)

- **RBAC + tenant isolation** enforced on every request. Roles: Owner, Admin, Editor, Analyst, Billing, Client (scoped).
- **Object-level authZ**: every query is scoped by `organization_id` / `workspace_id` at the data layer — never trust client-supplied IDs. Default-deny.
- **Row-Level Security (RLS)** in PostgreSQL as a second enforcement layer so a bug in app code can't leak across tenants.
- **Approval gates**: high-impact automated/manual actions (large budget changes, new campaigns) require a second approver in stricter modes.
- **Principle of least privilege** for service-to-service calls (scoped service accounts, short-lived creds).

---

## 4. Protecting Ad-Platform Tokens (crown jewels)

- Store OAuth/refresh tokens **encrypted at rest with envelope encryption**: per-tenant data keys wrapped by a master key in a **KMS/HSM** (AWS KMS, GCP KMS, or Vault Transit). Plaintext tokens never persisted.
- Tokens decrypted **only in memory**, only in the integration worker, only for the duration of a call.
- Request **minimum OAuth scopes** required; never request more than needed.
- **Automatic token rotation** and revocation; detect & alert on revoked/expired tokens.
- Use Meta **System Users** and Google **MCC** server-to-server patterns rather than long-lived user tokens where possible.
- Separate, locked-down **secrets store** for our own platform credentials (Vault / cloud secret manager) — no secrets in code, env files in git, or images.

---

## 5. The Automation Engine Spends Money — Guardrails

These are **security controls**, not just product features:
- **Hard spend caps** per ad account and per workspace; engine physically cannot exceed them.
- **Change-rate limiting**: max % budget change per action and per day.
- **Idempotency keys** on every write so retries can't double-apply.
- **Approval gates + dry-run/sandbox** for high-impact actions.
- **Global kill switch** to instantly halt all automated writes.
- **Full, immutable audit log** of every action (actor, reason, before/after, rollback pointer); tamper-evident (append-only / hash-chained).
- **Anomaly detection** on spend/velocity → auto-pause + alert on suspicious patterns (e.g., sudden 10× budget spike).

---

## 6. AI / LLM Security

- Treat all LLM I/O as **untrusted**. Sanitize and constrain.
- **Prompt-injection defenses**: the AI strategist cannot directly execute platform writes — it only *proposes* `ActionCommands` that pass through the same guardrails, authZ, and (when configured) human approval. No tool has unbounded power.
- Strict allow-list of actions the AI can propose; outputs validated against schemas.
- **PII minimization** to AI providers: never send raw customer PII; hash/strip where possible; use providers with zero-retention / no-training agreements (DPA in place).
- Creative outputs run through **policy & brand safety checks** before publish.
- Guard against data exfiltration via crafted creative/URLs (URL allow-listing, redirect checks).

---

## 7. Application & API Security

- **OWASP Top 10 / API Top 10** baseline. Input validation everywhere; parameterized queries (no string-built SQL); output encoding.
- **Strict CSP**, HSTS (preload), `X-Content-Type-Options`, `Referrer-Policy`, frame-ancestors deny, CSRF tokens for state-changing requests.
- **Rate limiting & WAF** at the edge; per-tenant + per-IP quotas; bot protection.
- **SSRF protection**: outbound requests (webhooks, image fetches) go through an allow-listed egress proxy; block link-local/metadata IP ranges.
- Webhooks: HMAC-signed payloads; verify signatures on inbound; rotate signing secrets.
- File/creative uploads: type/size validation, AV scanning, served from isolated origin, no executable content.
- API keys: scoped, hashed at rest, rotatable, revocable, with usage visibility.

---

## 8. Infrastructure & Network

- **Zero-trust networking**: private subnets, no public DB; services reachable only via internal mesh with mTLS.
- **Secrets** via KMS/Vault; never in images or env files; short-lived dynamic DB creds where possible.
- **Hardened containers**: minimal/distroless base images, non-root, read-only filesystem, dropped capabilities, seccomp/AppArmor.
- **IaC (Terraform)** with policy-as-code (OPA/Checkov) to prevent misconfig; no manual prod changes.
- **Encryption in transit** (TLS 1.2+ everywhere, internal mTLS) and **at rest** (DB, object store, backups, KMS-managed keys).
- **Network segmentation**: integration workers (which hold tokens) isolated from the public web tier.
- **DDoS protection** at the edge (CDN/WAF).

---

## 9. Data Protection & Privacy

- **Encryption at rest** for all datastores; field-level encryption for the most sensitive fields (tokens, PII).
- **Data classification** and handling policy; PII tagged and access-controlled.
- **Retention & deletion**: configurable retention; full GDPR/CCPA data export & "right to be forgotten" deletion across primary + warehouse + backups.
- **Backups**: encrypted, access-controlled, regularly **restore-tested**; immutable/object-locked to resist ransomware.
- **Data residency** options (EU region) for EU customers; clear sub-processor list.
- **Tenant data isolation** verified by automated tests in CI.

---

## 10. Secure Development Lifecycle (SDLC)

- **Code review required** on every change; no direct pushes to main; signed commits.
- **Automated security in CI**: SAST, dependency/SCA scanning, secret scanning (pre-commit + CI), container image scanning, IaC scanning, DAST against staging.
- **SBOM** generated per release; pinned dependencies; Dependabot/renovate with review.
- **Supply-chain**: verify package integrity, lockfiles, restrict postinstall scripts, use trusted registries; sign artifacts (Sigstore).
- **Secrets never committed** — enforced by pre-commit hooks and CI secret scanning + push protection.
- **Threat modeling** for new high-risk features; security review gate before launch.

---

## 11. Detection, Response & Operations

- **Centralized, immutable logging** (app, auth, admin, automation actions) with PII redaction; tamper-evident.
- **SIEM + alerting** on auth anomalies, cross-tenant access attempts, spend anomalies, privilege escalation, secret access.
- **Audit trail** for all admin and automated actions, queryable by customers for their own workspace.
- **Incident response plan**: defined severities, on-call, runbooks, breach-notification process (GDPR 72-hour), post-mortems.
- **Continuous monitoring** of platform API health, token validity, and quota.

---

## 12. Governance, Compliance & Assurance

- **Roadmap to SOC 2 Type II**; **ISO 27001** as the program matures.
- **GDPR / CCPA** compliance: DPA, sub-processor transparency, lawful basis, consent handling for audience/conversion data.
- **Platform policy compliance**: Meta Platform Terms & Data Use; Google Ads API RMF and Required Minimum Functionality; honor automated-change disclosure rules.
- **Vendor/sub-processor security reviews**; DPAs with all processors (incl. AI providers, Stripe).
- **Penetration testing**: independent pen test before GA and at least annually; continuous bug-bounty / responsible-disclosure program.
- **Security training** for all staff; least-privilege internal access with audited break-glass.

---

## 13. Security Controls Summary (quick reference)

| Layer | Primary controls |
|---|---|
| Identity | Mandatory MFA, passkeys, SSO/SCIM, step-up auth |
| AuthZ | RBAC + tenant scoping + Postgres RLS, default-deny |
| Tokens/Secrets | KMS/HSM envelope encryption, in-memory only, least scope |
| Money-movement | Spend caps, change-rate limits, approval gates, kill switch, idempotency |
| AI | No direct write power, schema-validated proposals, PII minimization, zero-retention DPAs |
| App/API | OWASP baseline, CSP/HSTS, WAF, SSRF/CSRF protection, signed webhooks |
| Infra | Zero-trust + mTLS, hardened/non-root containers, IaC policy-as-code |
| Data | Encryption at rest + field-level, residency, tested immutable backups |
| SDLC | Mandatory review, SAST/DAST/SCA/secret scanning, SBOM, supply-chain hardening |
| Ops | Immutable logging, SIEM, IR plan, pen tests, bug bounty |
| Governance | SOC 2 / ISO 27001 roadmap, GDPR/CCPA, platform-policy compliance |

---

## 14. Hardening Checklist (pre-GA gate)

- [ ] MFA enforced; passkeys supported; SSO/SCIM for Enterprise
- [ ] Postgres RLS enabled + automated cross-tenant isolation tests passing
- [ ] All OAuth tokens encrypted via KMS envelope encryption; plaintext never stored
- [ ] Spend caps, change-rate limits, approval gates & kill switch implemented and tested
- [ ] AI cannot execute writes directly; all actions pass guardrails + schema validation
- [ ] CSP/HSTS/security headers; CSRF + SSRF protections in place
- [ ] Secret scanning + push protection on the repo; no secrets in history
- [ ] SAST/DAST/SCA/container/IaC scanning wired into CI and passing
- [ ] Encrypted, restore-tested, immutable backups
- [ ] Centralized immutable logging + SIEM alerts on key anomalies
- [ ] Independent penetration test completed; criticals/highs remediated
- [ ] Incident response plan documented and dry-run tested
- [ ] DPAs signed with all sub-processors (incl. AI provider & Stripe)
- [ ] GDPR data export & deletion flows working end-to-end

---

*Security is continuous. Review this document quarterly and after any incident or major architecture change.*
