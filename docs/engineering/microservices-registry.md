---
id: microservices-registry
title: Microservices Registry
sidebar_label: Microservices Registry
---

# Microservices Registry

This is the authoritative list of FinX microservices that participate in the
client onboarding flow. Services not listed here are not on the onboarding
critical path.

| Service Name | Responsibility | Upstream Dependencies | Downstream Dependencies | Repo | Owner Team |
| --- | --- | --- | --- | --- | --- |
| onboarding-orchestrator | Owns the onboarding case state machine and workflow execution. | api-gateway | kyc-engine, account-provisioning, notification-service, audit-log | `finx/onboarding-orchestrator` | Onboarding Platform |
| kyc-engine | Runs identity verification, sanctions, PEP, and adverse media screening. | onboarding-orchestrator, document-vault | risk-rating-service, audit-log | `finx/kyc-engine` | Compliance Platform |
| account-provisioning | Creates tenants, accounts, and entitlements. | onboarding-orchestrator, identity-service | ledger-service, audit-log | `finx/account-provisioning` | Platform Operations |
| identity-service | Manages users, roles, OAuth clients, and API credentials. | (none) | api-gateway, account-provisioning | `finx/identity-service` | Identity & Access |
| document-vault | Stores KYC and contractual documents with retention controls. | identity-service | kyc-engine, audit-log | `finx/document-vault` | Compliance Platform |
| compliance-rules-engine | Evaluates events against rule sets and raises alerts or holds. | event-bus | case-management, audit-log | `finx/compliance-rules-engine` | Compliance Platform |
| notification-service | Delivers email, webhook, and SMS notifications. | event-bus, identity-service | external email/SMS providers | `finx/notification-service` | Client Experience |
| audit-log | Append-only audit and event store; source of truth for reporting. | event-bus | reporting-service | `finx/audit-log` | Data Platform |
| api-gateway | TLS termination, rate limiting, authentication, request routing. | identity-service | all public-facing services | `finx/api-gateway` | Platform Edge |
| risk-rating-service | Computes and stores client risk ratings. | kyc-engine | onboarding-orchestrator, audit-log | `finx/risk-rating-service` | Compliance Platform |

## Conventions

- Each service has a single owning team; on-call follows the owner.
- Repos follow `finx/<service-name>`; mono-repos are not used at the service
  level.
- Cross-service contracts are defined in shared schema packages registered
  with the schema registry.

:::caution
Work in progress.
:::
