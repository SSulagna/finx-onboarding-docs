---
id: sandbox-postman
title: Sandbox & Postman
sidebar_label: Sandbox & Postman
---

# Sandbox & Postman

Use the sandbox environments and collections below to explore APIs and validate payloads before formal onboarding.

## Environments

From *FinX Environments*:

| Environment | Purpose | Typical Activities |
| --- | --- | --- |
| **DEV** | Feature development, early-stage testing | API dev, contract validation, adapter testing, CI/CD validation, SAST/SCA scans |
| **QA** | Functional correctness across integrated components | E2E workflow testing, BIAN SD validation, API contract validation, regression, RBAC validation |
| **PERF** | Scalability, throughput, stability under load | Load testing (TPS), workflow concurrency, latency (p95/p99), infrastructure scaling, rate-limiting |
| **DEMO** | Production-equivalent for customers | Customer demos, integration showcases, security/observability/governance features, release readiness |

**Promotion Flow:** DEV → QA → PERF → DEMO

**Demo Gateway Base URL:** `https://finx-demo-api.fincuro.in`

## Access checklist

1. Obtain Keycloak client credentials and OIDC realm details
2. Get API base URL and gateway stage for the target environment
3. Confirm required headers (`tenant_id`, channel context)
4. Import Postman collection and set environment variables
5. Validate one read-only endpoint before attempting write operations

## Postman collections

- **FinX Demo APIs collection:** `Finx-Demo-APIs-1107.postman_collection.json`, containing all Demo API endpoints organized by service.

*Source: Finx Microservices Details*

## Representative endpoints

**Prospect & Party**

- `POST /v1/corporate-entity`
- `POST /v1/individuals`
- `POST /v1/case`
- `POST /v1/checkEligibility`

**Compliance / KYC**

- `POST /ca/v1/scan/individual`
- `POST /ca/v1/scan/corporate`
- `POST /ca/v1/scan/beneficiary`
- `POST /ca/v1/scan/entity/webhook/callback` (for vendor to call)

**Account & Payments**

- `POST /currentAccount/initiate`
- `GET /currentAccount/{partyReference}/retrieve`
- `POST /account/vp/v1/paymentInstruments/initiate`

**Documents**

- `POST /v1/documents`
- `POST /v1/documents/docusign/templates/send`

## Webhook subscriptions (AML Mesh)

Subscribe per environment to receive workflow updates back into FinX:

```http
POST https://api.us.mesh.complyadvantage.com/v2/webhooks
Content-Type: application/json

{
  "is_active": true,
  "name": "create-and-screen-workflow-completed",
  "type": "WORKFLOW_COMPLETED",
  "url": "https://finx-demo-api.fincuro.in/ca/v1/scan/entity/webhook/callback"
}
```

:::warning
Do not reuse webhook URLs across environments. Register `CASE_CREATED`, `CASE_STATE_UPDATED`, and `WORKFLOW_COMPLETED` separately for each environment. Webhook subscription for transaction screening is performed manually by contacting CA support.
:::

## Important notes

- **Kafka consumers/transforms run only in Dev.** Even when using Demo URLs, Kafka transformation occurs in Dev because Kafka has a single API endpoint configured for the stage environment.
- **ComplyAdvantage webhook subscription** for transaction screening is performed manually by contacting CA support.
- **Entitlement service** requires initial setup: create Maker and Checker roles via API after deployment on new environment.

*Source: Finx Microservices Details*

## Test data guidance

- **Product Selection:** ensure product/account/currency lookup master tables are populated consistently across environments
- **KYC:** use partner-provided non-PII test personas or vendor demo data to trigger both pass and match scenarios
- **DocuSign:** use demo account and template IDs tied to the environment

## Troubleshooting

**401/403 from Kong or service**
Validate OIDC token audience and issuer, token expiry, and Keycloak client configuration. Confirm CORS and gateway stage mapping. Authentication method across all services is Azure AD (except webhook endpoints which are excluded from auth).

**Schema validation errors**
Compare payloads to the OpenAPI spec in the Schema Registry; avoid sending unknown required fields. If using Business APIs, ensure you are not mixing BIAN-level fields unintentionally.

**Downstream timeouts**
Check VPC link health, NLB target status, and any inter-region peering routes (ap-south-1 to us-east-1 for Thought Machine). Refer to Installation Manual.

## References

- Finx Microservices Details
- FinX-Celta Services List
- FinX Environments
- Installation Manual
- FinX Glue - Architecture
- API & Naming Conventions
- Schema Registry & SoP
- Business Capability Target State
