---
id: sandbox-postman
title: Sandbox and Postman Collection
sidebar_label: Sandbox & Postman
---

# Sandbox and Postman Collection

The FinX sandbox is a fully isolated environment that mirrors the production
API surface. Partners use it during the integration phase to build and test
against stable contracts before requesting production access.

## Accessing the sandbox

1. Complete Phases 1–3 of onboarding (intake, KYC clearance, account setup).
2. Partner Integration Engineering issues a sandbox `client_id` and
   `client_secret` to the partner's primary technical contact.
3. The base URL for the sandbox is `https://sandbox.api.finx.local`
   (placeholder; the real URL is shared in the credentials handoff).
4. Use the OAuth 2.0 client credentials flow described in
   [Auth Gateway](./auth-gateway.md) to obtain an access token.

## Sandbox limitations

- **No real-money settlement.** All transactions are simulated.
- **Synthetic data only.** Do not upload real PII or production KYC documents
  to the sandbox.
- **Reduced rate limits.** Sandbox limits are lower than production; they
  exist to surface batching and backoff bugs early.
- **Feature parity is best-effort.** A small number of features (for example,
  jurisdiction-specific rails) may be stubbed in the sandbox.
- **Data reset.** Sandbox tenant data is reset on a regular schedule (default
  every 14 days). Partners are notified by email 48 hours before each reset.
  An on-demand reset can be requested via the Sandbox Reset API.

## Postman collection

A Postman collection is published alongside each major release of the
partner-facing APIs. The collection includes:

- A pre-configured environment template with placeholders for `client_id`,
  `client_secret`, and `base_url`.
- A pre-request script that handles OAuth token acquisition and caching.
- One folder per API (Onboarding Cases, Documents, Clients, Webhooks,
  Reporting).
- Example requests for each endpoint, including error cases.

> The collection link is to be added once the publishing pipeline is live.
> Until then, request the latest collection from Partner Integration
> Engineering.

## Common integration test scenarios

| Scenario | Description |
| --- | --- |
| Happy-path onboarding | Open a case, upload all required documents, walk through to `Live`. |
| KYC referral | Submit a case that triggers a manual review, then resolve it. |
| Document re-upload | Upload an invalid document, receive a rejection, re-upload a valid one. |
| Webhook delivery | Subscribe to `CaseStateChanged`, verify delivery and signature. |
| Token expiry | Use an expired token; verify 401 and successful retry after refresh. |
| Rate limit | Exceed the sandbox rate limit; verify 429 with `Retry-After`. |
| Idempotent retry | Resend a `POST` with the same idempotency key; verify single effect. |

:::caution
Work in progress.
:::
