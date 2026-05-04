---
id: api-contracts
title: API Contracts
sidebar_label: API Contracts
---

# API Contracts

In FinX, an **API contract** is the binding agreement between a producing
service and its consumers about the shape, semantics, and stability of an
API. Contracts are versioned, machine-checkable artifacts, not informal
documentation.

A contract covers:

- The OpenAPI specification (paths, methods, schemas, error model).
- The auth requirements and scopes per endpoint.
- The stability tier (see below).
- The deprecation policy and notice period.
- The set of approved consumers, where access is gated.

## Partner-facing API contracts

| Contract | Version | Stability | Notes |
| --- | --- | --- | --- |
| Onboarding Cases API | v1 | Stable | Open and track onboarding cases. |
| Documents API | v1 | Stable | Upload and retrieve KYC documents. |
| Clients API | v1 | Stable | Read provisioned client and account data. |
| Webhooks Subscription API | v1 | Stable | Register and manage webhook endpoints. |
| Reporting API | v1 | Beta | Pull onboarding and KYC reports. Schema may change. |
| Sandbox Reset API | v1 | Beta | Trigger sandbox data reset for the partner tenant. |
| Events Stream API | v0 | Experimental | Server-sent events stream of onboarding events. Not for production use. |

### Stability tiers

- **Stable.** Backward-compatible changes only. 12-month deprecation notice.
- **Beta.** Backward-compatible changes preferred; breaking changes possible
  with 90-day notice.
- **Experimental.** No stability guarantees. May be removed or changed without
  notice. Not approved for production traffic.

## Contract change management

1. **Proposal.** The owning team opens an RFC describing the change, the
   motivation, and the consumer impact.
2. **Compatibility classification.** The change is classified as backward
   compatible, breaking, or deprecating an existing surface. CI checks the
   spec diff against the classification.
3. **Consumer review.** For breaking or deprecating changes, all approved
   consumers are notified and given a defined response window.
4. **Approval.** Stable contracts require sign-off from the API Council.
   Beta contracts require sign-off from the owning team's tech lead.
5. **Rollout.** The new contract version is published to the sandbox first
   and validated by at least one partner before production rollout.
6. **Deprecation.** Deprecated versions remain available for the notice
   period and are documented with the planned removal date.

All contracts are versioned in a dedicated repo and published to the internal
contract catalog.

:::caution
Work in progress.
:::
