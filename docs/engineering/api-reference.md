---
id: api-reference
title: API Reference
sidebar_label: API Reference
---

# API Reference

This page is the entry point for the FinX onboarding API reference. The full,
machine-generated reference is produced from the OpenAPI specification and
will be embedded here via SpecFlow once the toolchain is wired up.

In the meantime, the table below lists the key onboarding endpoints. Endpoint
paths and request/response shapes in the OpenAPI spec are authoritative; this
page is a navigation aid only.

## Key onboarding APIs

| Endpoint | Method | Purpose | Auth Required |
| --- | --- | --- | --- |
| `/v1/onboarding/cases` | POST | Open a new onboarding case from an intake payload. | OAuth 2.0 |
| `/v1/onboarding/cases/{caseId}` | GET | Retrieve the current state and history of a case. | OAuth 2.0 |
| `/v1/onboarding/cases/{caseId}/documents` | POST | Upload a KYC document for the case. | OAuth 2.0 |
| `/v1/onboarding/cases/{caseId}/decisions` | POST | Submit a compliance decision (analyst-only). | OAuth 2.0 (scoped) |
| `/v1/onboarding/cases/{caseId}/go-live` | POST | Request production cutover for a case. | OAuth 2.0 |
| `/v1/clients/{clientId}` | GET | Retrieve a provisioned client tenant record. | OAuth 2.0 or API Key |
| `/v1/clients/{clientId}/accounts` | GET | List accounts under a client tenant. | OAuth 2.0 or API Key |
| `/v1/webhooks/subscriptions` | POST | Register a webhook subscription for onboarding events. | OAuth 2.0 |

## Generation pipeline

The reference is generated from the OpenAPI 3.1 specification maintained at
`finx/onboarding-api-spec`. SpecFlow renders the spec into Docusaurus-friendly
MDX as part of the docs build. Until that step is in place, this page serves
as a manual placeholder.

When the integration is live:

- Each endpoint will have its own page with full schemas and examples.
- Request and response examples will be runnable against the sandbox.
- Changelog entries will be derived from spec diffs.

:::caution
Work in progress.
:::
