---
id: guide
title: Product & Business Guide
sidebar_label: Guide Overview
---

# Product & Business Guide

**Audience:** Product managers, business analysts, customer experience, and
solution architects.

## Journey Summary

Retail savings onboarding from lead to funded account, with configurable
steps:

> Qualify prospect → Capture identity and profile → IDV (optional) →
> KYC/AML screening → Account creation → Agreement signing → Funding

## Modules at a Glance

- **Prospect Qualification.** Country/business-type checks; case officer
  recommendation.
- **Customer Onboarding.** Individual/Corporate creation in MSD, related
  individuals, case status.
- **Compliance & Risk.** ComplyAdvantage Mesh screening; sanction/OFAC checks.
- **Account Opening.** Thought Machine Core and Vault Payments integration.
- **Document & Signature.** Document Directory, DocuSign templates and
  webhooks.
- **Bankers Workbench.** Review, approve, exception handling (in-progress).
- **Observability & Governance.** Dashboards, schema registry, CI/CD
  controls.

## User Roles

FinX onboarding flows assume three primary user roles:

- **Retail Customer.** End user completing self-service onboarding through the Retail Onboarding Portal. Captures identity, completes IDV, signs documents, and funds the account.
- **Banker.** Bank employee reviewing flagged applications, handling exceptions, and approving cases through the Bankers Workbench. Operates in the human-in-the-loop step of the workflow.
- **Compliance Officer.** Reviews KYC/AML hits, handles sanctions screening exceptions, and approves or rejects cases that fail automated screening.

## Configurable Orchestration

FinX separates business logic from code through three configuration layers, so banks can adapt journeys without engineering releases.

- **Workflow steps.** BPMN-compliant workflow definitions in Conductor control step order, branching logic, timers, and compensation paths. Adding a new step or reordering existing ones is a workflow edit, not a code change.
- **UI screens.** Schema-driven UI lets product teams add, remove, or reorder onboarding screens by editing the screen schema. The MFE reads the schema at runtime.
- **Decision rules.** Eligibility checks, risk thresholds, and routing rules live in a rules engine. Compliance and product teams can update rules without involving engineering.

## What FinX Makes Measurable

The platform exposes the following operational signals once instrumented in a deployment:

- Funnel conversion through each onboarding stage
- Average time to onboard, end to end
- KYC pass and fail rates, with reason codes
- Exception volume and resolution SLA performance
- Drop-off heatmaps by step and screen

Specific dashboards and baseline metrics will be documented as deployments mature.

## Related Pages

- [Onboarding Journey Map](./journey-map.md)
- [Module Overview](./module-overview.md)
- [Compliance & KYC Touchpoints](./compliance-kyc.md)

:::caution
Work in progress.
:::
