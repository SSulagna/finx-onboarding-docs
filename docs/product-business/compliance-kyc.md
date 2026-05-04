---
id: compliance-kyc
title: Compliance & KYC Touchpoints
sidebar_label: Compliance & KYC
---

# Compliance & KYC Touchpoints

Compliance controls are embedded throughout the onboarding journey with
clear pass/fail and review states, governed by versioned schemas and
observable workflows.

## Control Points

- **Eligibility gate.** Country / business-type checks before PII collection.
- **IDV (optional).** Document and liveness verification per policy.
- **Sync KYC/AML screening.** ComplyAdvantage Mesh create-and-screen
  workflow.
- **Webhooks and monitoring.** Persisted scan status; automatic updates
  into the case timeline.
- **HITL escalations.** Manual review queue with SLA and SoD-aware
  approvals.
- **Compensation.** Orchestrated rollback or freeze actions when downstream
  steps already executed.

## KYC Screening Flow (Illustrative)

1. Submit customer payload to Mesh via
   `finx-amln-fraud-detection-adapter`.
2. Receive sync response with workflow status and risk score.
3. **Matches found** → configurable error to user; create HITL review task.
4. **Alerts raised** → case creation and compliance handling.
5. Webhook updates keep case status synchronized across environments.

## Policy & Orchestration

- **Rules engine** integration to externalize thresholds (risk-score,
  match-levels).
- **Workflow branches** enforce dual approvals and step-up verification
  where needed.
- **Audit trail.** Full lineage across API calls, workflow steps, and human
  actions.

## Data & Governance

- **Schema Registry.** Dual versioning (SemVer and `x-bian-version`) for
  traceability.
- **Design-time and build-time validation** (Spectral, oasdiff, contract
  tests).
- **Conformance** required for microservice generation and deployment.

## Related Architecture and Standards

- FinX Glue Architecture - Kong, Keycloak, BIAN microservices, adapter layer
- Business Capability Target State - Business Abstraction Layer and
  Business APIs
- Process & Orchestration - Conductor, Saga/compensation, HITL,
  schema-driven UI
- Schema Registry & SoP - Governance, CI validation, roles and RACI
- FinX Microservices - Services used across onboarding and operations
- Savings Account E2E Requirements - UI journey artifacts and open questions
- Jira: KYC Check (FBSA-20) - ComplyAdvantage Mesh request/response examples

## FAQ

**Q. Are BIAN service APIs or Business APIs the way forward?**
Both are available. Today, channels typically compose BIAN service APIs.
The target state introduces Business APIs (e.g., Account Opening) to
minimize orchestration in channels.

**Q. Can journey steps be reconfigured?**
Yes. Workflow definitions and UI schemas allow adding / removing /
reordering steps and changing validations via configuration.

**Q. How are API contracts governed?**
Through the Schema Registry: dual-versioning (SemVer and `x-bian-version`),
PR reviews, CI linting and diff checks, and build-time contract
enforcement.

## References

- Retail Onboarding - Individual Customer
- Project Plan - Onboarding and Portal Program
- FinX Bank Savings Account E2E Requirements
- FinX Glue Architecture
- Schema Registry & SoP
- Process & Orchestration
- FinX Microservices Details
- Jira FBSA-20: KYC Check

:::caution
Work in progress.
:::
