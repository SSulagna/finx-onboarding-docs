---
id: module-overview
title: Platform Module Overview
sidebar_label: Module Overview
---

# Platform Module Overview

The following FinX platform modules are directly involved in onboarding a new
client. Each module is owned by a single team and has explicit upstream and
downstream dependencies that are documented in the engineering registry.

| Module Name | Purpose | Dependencies | Owner Team |
| --- | --- | --- | --- |
| KYC Engine | Runs identity verification, sanctions, PEP, and adverse media checks. Produces a risk rating. | Document Vault, External screening providers | Compliance Platform |
| Account Provisioning | Creates tenant structures, primary and sub-accounts, and entitlement profiles. | Identity Service, KYC Engine | Platform Operations |
| Transaction Routing | Selects the correct rails and counterparty for each transaction based on client configuration. | Account Provisioning, Compliance Rules Engine | Payments Platform |
| Compliance Rules Engine | Evaluates transactions and events against configurable rule sets; generates alerts and holds. | KYC Engine, Audit Log | Compliance Platform |
| Notification Service | Delivers transactional and operational notifications via email, webhook, and SMS. | Account Provisioning, Identity Service | Client Experience |
| Reporting & Audit | Produces regulatory and operational reports; serves as the immutable audit trail. | All modules (read-only consumers) | Data Platform |
| Identity Service | Manages users, roles, API credentials, and OAuth clients. | None (foundational) | Identity & Access |
| Document Vault | Stores KYC and contractual documents with retention controls. | Identity Service | Compliance Platform |

## Notes

- The list above is the minimum surface area touched during onboarding. Other
  modules (for example, ledger and reconciliation) are dependencies of these
  modules but are not directly configured during onboarding.
- Module ownership is authoritative. Any change request goes to the owning
  team via the standard change process.

:::caution
Work in progress.
:::
