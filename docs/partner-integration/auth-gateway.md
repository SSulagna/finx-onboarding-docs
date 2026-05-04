---
id: auth-gateway
title: Authentication Gateway
sidebar_label: Auth Gateway
---

# Authentication Gateway

All partner traffic to the FinX platform terminates at the authentication
gateway. The gateway is responsible for credential validation, scope
enforcement, rate limiting, and request routing. No service is reachable from
outside the platform except through this gateway.

## Supported authentication methods

| Method | Use case | Notes |
| --- | --- | --- |
| OAuth 2.0 (client credentials) | Server-to-server partner integrations | Primary method; required for any write API |
| OAuth 2.0 (authorization code + PKCE) | Partner-hosted applications acting on behalf of an end user | Required for delegated user flows |
| API Key | Read-only, low-sensitivity endpoints during integration | Limited to non-PII, non-mutating endpoints |

API keys are not accepted for production write traffic.

## Gateway architecture

- **Edge layer** terminates TLS, enforces rate limits, and applies basic
  request validation.
- **Auth layer** validates JWTs, exchanges API keys for short-lived internal
  tokens, and resolves the calling principal and scopes.
- **Routing layer** forwards the request to the target service over an
  internal mTLS mesh.
- **Audit layer** writes a structured access log entry for every request,
  including principal, scopes, and target endpoint.

## First-time partner authentication

1. The partner is provisioned a sandbox `client_id` and `client_secret` by
   Partner Integration Engineering during Phase 4 of onboarding.
2. The partner POSTs to `/oauth/token` on the sandbox token endpoint with
   `grant_type=client_credentials` and the issued credentials.
3. The token endpoint returns a short-lived access token (default TTL: 1
   hour) scoped to the agreed APIs.
4. The partner attaches the access token as `Authorization: Bearer <token>`
   on subsequent API calls.
5. When the token nears expiry, the partner requests a new token using the
   same client credentials. Refresh tokens are not used in the client
   credentials flow.

For production, the same flow applies against the production token endpoint
once the partner is approved for go-live.

## Token lifecycle and refresh policy

- **Access token TTL:** 1 hour by default; configurable down to 15 minutes
  for high-risk partners.
- **Clock skew tolerance:** 60 seconds.
- **Rotation:** Client secrets must be rotated at least every 12 months.
  Rotation is a partner-initiated, gateway-supported flow with a 30-day
  overlap window.
- **Revocation:** Compromised credentials can be revoked immediately via the
  partner support process; revocation propagates to the gateway within 60
  seconds.
- **Scope enforcement:** Tokens carry explicit scopes; the gateway rejects
  any request whose target endpoint requires a scope not present on the
  token.

:::caution
Work in progress.
:::
