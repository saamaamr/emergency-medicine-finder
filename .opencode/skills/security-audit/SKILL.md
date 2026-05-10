---
name: security-audit
description: OWASP-based security audit with vulnerability detection, PoC verification, and fix guidance
---

## Security Audit Process

1. **Recon** — Map attack surface, entry points, auth boundaries
2. **Scan** — Check OWASP Top 10 categories systematically
3. **Verify** — Attempt to confirm each finding with a proof of concept
4. **Prioritize** — Critical > High > Medium > Low based on exploitability
5. **Remediate** — Provide specific fix code for each finding

## OWASP Top 10 Checklist

- [ ] Broken Access Control (IDOR, privilege escalation)
- [ ] Cryptographic Failures (weak hashing, exposed secrets)
- [ ] Injection (SQL, NoSQL, OS command, XSS)
- [ ] Insecure Design (missing rate limiting, trust boundary violations)
- [ ] Security Misconfiguration (default creds, verbose errors)
- [ ] Vulnerable Components (outdated deps, known CVEs)
- [ ] Auth Failures (weak passwords, session fixation)
- [ ] Data Integrity Failures (unsigned data, CSRF)
- [ ] Logging Failures (missing audit trails, log injection)
- [ ] SSRF (internal network access)

## Deliverables

- Vulnerability report with severity, location, and PoC
- Fix code snippets for each finding
- Prioritized remediation roadmap
