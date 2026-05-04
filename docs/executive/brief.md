---
id: brief
title: Executive Brief - FinX Client Onboarding
sidebar_label: Executive Brief
---

# Executive Brief - FinX Client Onboarding

**Audience:** Executives, sponsors, and steering committee.
**Read time:** ~5 minutes.

## Value Proposition

FinX accelerates time-to-market by letting banks compose compliant onboarding journeys from reusable, pre-built modules instead of starting from scratch. The platform reduces integration complexity by collapsing many BIAN service calls into single Business API calls that handle orchestration, retries, and compensation internally. Compliance is governed by design through built-in KYC/AML screening, auditability, and human-in-the-loop controls at every critical step. The BIAN canonical model and adapter pattern future-proof the platform by decoupling channels from core banking systems and third-party vendors, so swapping a provider does not require reworking the integration surface.

## Current vs Target State

- **Current.** Channels orchestrate sequences across multiple BIAN APIs;
  adapters used per API.
- **Target.** Business Abstraction Layer exposes Business APIs (e.g.,
  Customer Onboarding, Account Opening) handling orchestration, retries,
  compensation, and unified responses.

## Scope and Modules

- Retail Onboarding Portal (web/mobile MFEs) and schema-driven UI
  orchestration.
- BIAN service APIs and adapters for: CIF/MSD party, Thought Machine
  Core/VP, ComplyAdvantage Mesh, DocuSign.
- Customer Portal and Bankers Workbench (review/approvals, operations).

## Milestones and Readiness

| Milestone | Status |
| --- | --- |
| CIF (Customer Information File) | Complete |
| MFE Onboarding (microfrontend journeys) | Complete |
| BIAN Service APIs | Complete |
| Savings Onboarding (end-to-end) | Complete |
| Bankers Workbench | In Progress |

Orchestration engine and observability stack are in place. Pipelines, databases, API gateway, and schema governance are operational.

## Top Risks and Mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Third-party integrations (Jumio/IDV, payments/funding) | High | Early vendor alignment; stubs and contract-first validation |
| Spec gaps for Bankers Workbench | Medium | Governance to finalize functional specs; progressive disclosure of scope |
| Infra bottlenecks | Medium | Pre-provisioning and shared demo environment; CI/CD standardization |

## Strategic Direction

Evolve **FinX Glue** from an integration platform to a business capability
platform with Business APIs and standardized journeys, improving partner
onboarding and journey consistency.

## Stakeholders and Ownership

- **Executive Sponsor.** [TBD]
- **Product Lead.** [TBD]
- **Engineering Lead.** [TBD]
- **Compliance Lead.** [TBD]

:::caution
Work in progress.
:::
