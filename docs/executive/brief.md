---
id: brief
title: Executive Brief - FinX Client Onboarding
sidebar_label: Executive Brief
---

# Executive Brief - FinX Client Onboarding

**Audience:** Executives, sponsors, and steering committee.
**Read time:** ~5 minutes.

## Value Proposition

- **Accelerate time-to-market.** Launch compliant savings onboarding in
  weeks by composing reusable modules.
- **Reduce integration complexity.** Move from many BIAN calls per journey
  to a single Business API call (target state).
- **Governed compliance.** Built-in KYC/AML screening, auditability, and
  human-in-the-loop controls.
- **Future-proof.** BIAN canonical model and adapter pattern decouple
  channels from core and vendors.

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

- Orchestration engine and observability stack in place.
- MFE onboarding and BIAN services tracked with clear dependencies.
- Technical readiness includes pipelines, databases, API gateway, and
  schema governance.

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

:::caution
Work in progress.
:::
