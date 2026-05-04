---
id: brief
title: Executive Brief - FinX Client Onboarding
sidebar_label: Executive Brief
---

# Executive Brief - FinX Client Onboarding

**Audience:** Executives, sponsors, and steering committee.
**Read time:** ~5 minutes.

## Value Proposition

FinX Glue is a next-generation banking integration and interoperability platform — a BIAN-aligned, cloud-native framework that accelerates digital transformation for banks and fintechs. It enables institutions to build, deploy, and operate secure, composable, and host-agnostic banking systems by unifying API management, event-driven data exchange, observability, and governance within a single ecosystem.

*Source: FinX Glue*

The platform delivers four strategic advantages:

| Advantage | Detail |
| --- | --- |
| Interoperability without lock-in | Connects legacy cores, modern banking platforms, and fintech ecosystems through canonical models, protocol adapters, workflows, and event streams — true host- and vendor-agnostic integration |
| Security, governance, and compliance by design | Policy-as-code, configurable workflow controls, SoD, service identity, lineage, consent management, and runtime validation aligned to PCI-DSS, GDPR, RBI, MAS TRM, ISO 27001 |
| Composable banking experiences | Reusable BIAN-aligned APIs, schema-driven UI flows, and intelligent orchestration let banks assemble new products and journeys rapidly without redevelopment |
| Intelligent process orchestration | Unified orchestration of APIs, events, human tasks, rules, and UI flows ensures consistent execution across digital touchpoints, back-office, and ecosystem integrations |

*Sources: FinX Glue · Transitioning FinX Glue to a Business Capability Platform: Current and Target States*

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

### Savings Account Onboarding — Delivery Milestones (Oct–Dec 2025)

| Milestone | Deliverables | Target Dates | Owner | Status |
| --- | --- | --- | --- | --- |
| Sprint 0 | Requirements finalisation | 24-Sep → 26-Sep 2025 | PO / BA | ✅ Completed |
| Design Phase | Architecture & UI design | 26-Sep → 28-Sep 2025 | Architecture team | ✅ Completed |
| Infrastructure Setup | Environments & pipelines | 28-Sep → 10-Oct 2025 | DevOps (arjun.vv) | ✅ Completed |
| CIF | CIF setup, data model config | 14-Oct → 29-Oct 2025 | Rishad MP / Avinash | ✅ Completed |
| MFE for Onboarding | Onboarding UI micro-frontends | 15-Oct → 23-Oct 2025 | Anshuman R Warrier | ✅ Completed |
| BIAN Services for Onboarding | Backend BIAN APIs | 20-Oct → 04-Nov 2025 | Shamsudheen P | ✅ Completed |
| Savings Onboarding | End-to-end savings flow | 28-Oct → 07-Nov 2025 | Backend Team | ✅ Completed |
| Customer Portal (MFE + BIAN) | Portal UI + BIAN services | 24-Oct → 04-Nov 2025 | Bhagyashree Koli / Karthi | ✅ Completed |
| Bankers Workbench (MFE + BIAN) | BWB UI + service integration | 10-Nov → 03-Dec 2025 | Full Team | ✅ Completed |
| Final Release | Prod deploy & monitoring | 10-Dec 2025 | Release Manager / DevOps | ✅ Completed |

*Source: Release Plan & Timeline — FinX Bank Savings Account · 🗂️Project Plan – Onboarding and Portal Program*

### FinX Glue Platform — Release Calendar (Jan–Jul 2026)

| Milestone | Date | Status |
| --- | --- | --- |
| Development Start | 07 Jan 2026 | ✔ Started |
| Scope Freeze | 17 Feb 2026 | ✔ Done |
| PI-1 (Core Feature Delivery) | Jan–Feb 2026 | ✔ Complete |
| PI-2 (Feature + Early Stabilization) | Feb–Apr 2026 | ✔ Complete |
| PI-3 (Stabilization + Hardening) | Apr–Jun 2026 | 🟩 In Progress |
| PI-4 (System Stabilization + Pre-Release) | Jun–Jul 2026 | 🟧 Upcoming |
| Code Freeze | 23 Jun 2026 | Planned |
| UAT & Go-Live Readiness | 24 Jun – 03 Jul 2026 | Planned |
| GO-LIVE | ⭐ 11 Jul 2026 | 🚀 Planned |

*Source: FinX Glue - Release Calendar — Jan to Jul 2026*

### FinX Glass — Release Calendar (Jan–Jul 2026)

| Milestone | Status |
| --- | --- |
| Phase 1 — Platform Setup (Modyo, SSO, shell) | ✅ Completed |
| Phase 2 — Micro FE platform + Glue integration | ✅ Completed |
| Phase 3 — Customer & Account Ops modules | 🟩 In Progress |
| Phase 4 — Hardening, analytics, compliance | Analysis started |
| Ver 0.1 → 04 Mar 2026 | ✅ Released |
| Ver 0.2 → 15 Apr 2026 | ✅ Released |
| Ver 0.3 → 28 May 2026 | 🟩 In Progress |
| Ver 0.4 → 24 Jun 2026 | Planned |
| GO-LIVE Ver 1 → 11 Jul 2026 | 🚀 Planned |

*Source: Introduction to FinX Glass*

## Top Risks and Mitigations

### Onboarding Program Risk Register

*From: 🗂️Project Plan – Onboarding and Portal Program & Release Plan & Timeline — FinX Bank Savings Account*

| ID | Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| R-001 | Jumio IDV integration | High | Follow up on Jumio API Documentation and making BIAN-compliant requests | Karthi, Avinash, Shamsudheen |
| R-002 | ComplyAdvantage integration | Medium | Follow up on CA API Documentation and making BIAN-compliant requests | Karthi, Avinash, Shamsudheen |
| R-003 | Payments integration (funding) | High | N/A as of now — appears to be just a UI screen | — |
| R-004 | Infra provisioning delays | Medium | Setup of Codegen from Chandrakiran Team and DevOps team | DevOps |
| R-005 | Missing product specs (BWB) | Medium | No missing requirements for RDO. Banker's Workbench not yet finalised. Waiting for confirmation from Liam | PO / BA |

### FinX Glue Release Risk Register

*From: FinX Glue - Release Calendar — Jan to Jul 2026*

| ID | Risk | Impact | Likelihood | RAG | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Holiday workforce reduction | Medium | High | 🟡 | Cross-shift planning | TPM | In Progress |
| R2 | Release scope creep | Medium | Medium | 🟡 | Strict change control | RM | Controlled |

### Testing Risks

*From: FinX Glue Testing Requirements for QA and Test Team*

| Risk | Severity | Impact | Mitigation |
| --- | --- | --- | --- |
| Changing BIAN contracts | High | Breaking changes invalidate test cases; regression spikes | Contract testing; schema review; backward compat in CI/CD |
| Adapter instability | High | 3rd-party differences cause false positives/negatives | Adapter-specific regression packs; controlled stubs |
| Security misconfiguration | Critical | Gateway/policy misconfig enables unauthorized access | Automated security checks in CI; RBAC/ABAC suites |
| Limited observability | Medium | Defects hard to triage; increased MTTR | Log/trace/metric validation in exit criteria |
| Demo environment risk | High | Demo treated as release-ready without validation | Mandatory smoke, regression subset, ops readiness checklist |
| Performance gap late | High | System fails under prod load, discovered too late | Dedicated Perf env; TR-PFT gates at Demo promotion |

## Strategic Direction

Evolve **FinX Glue** from an integration platform to a business capability
platform with Business APIs and standardized journeys, improving partner
onboarding and journey consistency.

## Stakeholders and Ownership

| Role | Name | Source |
| --- | --- | --- |
| Project Owners | Dushyant Bhatia, Vijaykumar Kunnath | FinX Bank Savings Account E2E Requirements |
| Program Driver / Release Manager | Prasad Muthudoss | Release Plan & Timeline — FinX Bank Savings Account · FinX Glue - Release Calendar — Jan to Jul 2026 |
| Product Owner (Squad 1) | Nirmal Satyendra | 🚀 FinX Glue Squad-1 Team Board |
| Program Manager | Nishant Virutkar | 🚀 FinX Glue Squad-1 Team Board |
| Tech Leads | Avinash, Nirmal Satyendra | FinX Bank Savings Account E2E Requirements |
| Squad Lead (Platform) | Shamsudheen Palattuthadathil | 🚀 FinX Glue Squad-1 Team Board |
| Design | Suma Ganesh, Laxmi Survase, Uma Vasant Avaghade | FinX Bank Savings Account E2E Requirements |
| QA | arun murthy | FinX Bank Savings Account E2E Requirements |
| DevOps | arjun.vv | 🗂️Project Plan – Onboarding and Portal Program |
| Stakeholders | Liam Leahy, Herbert Leonelli | Project Plan |

:::caution
Work in progress.
:::
