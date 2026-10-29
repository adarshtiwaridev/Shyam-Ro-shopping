---
name: cloudflare-security-audit
description: >-
  Conducts a comprehensive security audit of Cloudflare configurations and edge protections for web applications. Use when the user asks to review, audit, harden, or configure Cloudflare security, WAF, SSL/TLS, DDoS mitigation, rate limiting, DNS, or edge headers.
---

# Cloudflare Security Audit & Edge Hardening Guide

This skill provides a systematic framework and checklist for auditing and hardening the security posture of web applications fronted by Cloudflare (particularly Next.js and Vercel-deployed applications).

---

## 1. SSL/TLS Architecture & Encryption Review

### 1.1 SSL/TLS Encryption Mode
- **Requirement**: Must be set to **Full (Strict)**.
  - **Flexible Mode Risk**: Encrypts traffic only between visitor and Cloudflare. Traffic from Cloudflare to origin (e.g. Vercel) travels over unencrypted HTTP, leaving the application open to Man-in-the-Middle (MITM) attacks and cookie interception.
  - **Full (Strict) Mode**: Enforces end-to-end TLS encryption with valid CA-signed origin certificates (such as Vercel's automated Let's Encrypt certificates or Cloudflare Origin CA).

### 1.2 Minimum TLS Version & Ciphers
- **Minimum TLS Version**: Set to **TLS 1.2** or **TLS 1.3**.
- **TLS 1.3**: Enabled (enables 1-RTT/0-RTT handshake with modern AEAD ciphers).
- **0-RTT Consideration**: If 0-RTT Connection Resumption is enabled, ensure non-idempotent endpoints (POST, PUT, DELETE) reject replay attacks or configure Cloudflare to only allow 0-RTT on GET requests.

### 1.3 HSTS (HTTP Strict Transport Security)
Enforce HSTS at the Cloudflare edge to prevent SSL stripping attacks:
- **Status**: Enabled
- **Max-Age**: `31536000` (1 year minimum)
- **Include Subdomains**: Enabled
- **Preload**: Enabled (submit domain to hstspreload.org after testing)
- **Automatic HTTPS Rewrites**: Enabled
- **Always Use HTTPS**: Enabled

---

## 2. Origin Protection & DNS Security

### 2.1 Origin IP Obfuscation
- **Proxy Status**: All public web hostnames (`@`, `www`, `api`) must be **Proxied (Orange Cloud)**.
- **Direct Leak Prevention**:
  - Ensure development, staging, or direct IPs are not exposed via subdomains (`direct.domain.com`, `origin.domain.com`, `ftp.domain.com`, `mail.domain.com`).
  - MX and SPF records should not point directly to the web application server IP if email is handled elsewhere.
- **Origin Restriction (Vercel)**:
  - If using Vercel, ensure external requests bypass Cloudflare cannot reach the origin without Cloudflare IP validation or custom secret header validation (e.g., `x-origin-verify: <secret>` checked in Next.js middleware).

### 2.2 DNSSEC (Domain Name System Security Extensions)
- Ensure DNSSEC is enabled on the domain to prevent DNS spoofing and cache poisoning.
- Verify DS records are correctly registered with the domain registrar.

---

## 3. Web Application Firewall (WAF) & Rate Limiting

### 3.1 Managed Rulesets
- **Cloudflare Managed Ruleset**: Enable with sensitivity set to `High` or `Medium`.
- **Cloudflare OWASP Core Ruleset**: Enable with anomaly score threshold configured (Paranoia Level 1 or 2 for production).

### 3.2 Custom Rate Limiting Rules
Protect sensitive endpoints against brute force, credential stuffing, and volumetric denial of service:

| Protected Path | Recommended Limit | Window | Action | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | 5 requests | 1 minute | Block or Managed Challenge | Mitigate credential stuffing & brute force |
| `/api/auth/verify-otp` | 3 requests | 1 minute | Block (10 min) | Prevent OTP brute forcing |
| `/api/auth/reset-password` | 3 requests | 5 minutes | Managed Challenge | Prevent email enumeration and spam |
| `/api/payment/*` | 10 requests | 1 minute | Block or Managed Challenge | Mitigate payment gateway fraud / card testing |
| `/api/chat` | 10 requests | 1 minute | Managed Challenge / Block | Mitigate LLM token / API abuse |
| General `/api/*` | 60 requests | 1 minute | Rate Limit (Log / Challenge) | API scraping and exhaustion prevention |

### 3.3 Bot Management & Challenge Settings
- **Bot Fight Mode**: Enable (Super Bot Fight Mode for Pro/Business plans).
- **Security Level**: Set to `Medium` or `High`.
- **Challenge Passage**: Set to `30 minutes` or `1 hour` (avoids frustrating legitimate users).

---

## 4. Edge Security Headers & Transformations

Implement or audit HTTP security response headers via Cloudflare **Transform Rules > Modify Response Header** or Next.js configuration:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://lumberjack.razorpay.com; frame-src https://api.razorpay.com;
```

---

## 5. Security Audit Verification Commands

Use these CLI checks to audit the domain's live configuration:

### Check SSL Handshake, Protocol, and Cipher:
```bash
curl -Iv --tlsv1.3 https://<your-domain.com>
```

### Inspect Edge Response Headers (HSTS, Server, Caching):
```bash
curl -I https://<your-domain.com>
```
*Expected indicators:*
- `cf-ray: ...` (confirms traffic is traversing Cloudflare edge)
- `strict-transport-security: max-age=31536000...`
- `x-content-type-options: nosniff`

### Test Proxy and Direct IP Resolution:
```bash
nslookup <your-domain.com>
```
*Expected: Returns Cloudflare Anycast IPs (`104.x.x.x`, `172.67.x.x`), NOT origin or direct host IPs.*

### Test Rate Limiting Trigger (Dry Run / Test):
```bash
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<your-domain.com>/api/auth/login; done
```
*Expected: Successive requests return `429 Too Many Requests` or `403 Forbidden` once threshold is exceeded.*

---

## 6. Audit Report Checklist Template

When delivering a Cloudflare security audit to the user, produce an assessment covering:
- [ ] **SSL/TLS Mode**: Full (Strict) verified
- [ ] **Minimum TLS Version**: TLS 1.2+ verified
- [ ] **HSTS**: Header active with max-age >= 1 year
- [ ] **DNS Proxying**: All relevant DNS records are proxied (orange cloud)
- [ ] **DNSSEC**: Active and verified with registrar
- [ ] **WAF Managed Rules**: Enabled and tuned to avoid false positives
- [ ] **Endpoint Rate Limiting**: Sensitive auth and payment APIs guarded
- [ ] **Bot Protection**: Bot Fight Mode active
- [ ] **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy present
- [ ] **Origin Masking**: Origin IP not exposed in DNS or MX records

