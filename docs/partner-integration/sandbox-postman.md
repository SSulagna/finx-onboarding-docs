---
id: sandbox-postman
title: Sandbox & Postman
sidebar_label: Sandbox & Postman
---

# Sandbox & Postman

Use the sandbox environments and collections below to explore APIs and validate payloads before formal onboarding.

## Environments

- **Demo/Sandbox:** public API hostnames per service (see Microservices Details)
- **Dev/QA/UAT:** provisioned via IaC and ArgoCD; API gateway stages and VPC links configured per environment

## Access checklist

1. Obtain Keycloak client credentials and OIDC realm details
2. Get API base URL and gateway stage for the target environment
3. Confirm required headers (`tenant_id`, channel context)
4. Import Postman collection and set environment variables
5. Validate one read-only endpoint before attempting write operations

## Postman collections

- FinX Demo APIs collection: Download

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
Do not reuse webhook URLs across environments. Register `CASE_CREATED`, `CASE_STATE_UPDATED`, and `WORKFLOW_COMPLETED` separately for each environment.
:::

## Test data guidance

- **Qualify Prospect:** ensure `country` and `business_type` tables are populated consistently across environments
- **KYC:** use partner-provided non-PII test personas or vendor demo data to trigger both pass and match scenarios
- **DocuSign:** use demo account and template IDs tied to the environment

## Troubleshooting

**401/403 from Kong or service**
Validate OIDC token audience and issuer, token expiry, and Keycloak client configuration. Confirm CORS and gateway stage mapping.

**Schema validation errors**
Compare payloads to the OpenAPI spec in the Schema Registry; avoid sending unknown required fields. If using Business APIs, ensure you are not mixing BIAN-level fields unintentionally.

**Downstream timeouts**
Check VPC link health, NLB target status, and any inter-region peering routes per Installation Manual.

## References

- Microservices Details
- Installation Manual
- FinX Glue - Architecture
- API & Naming Conventions
- Schema Registry & SoP
- Business Capability Target State
