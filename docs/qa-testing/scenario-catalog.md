---
id: scenario-catalog
title: Scenario Catalog
sidebar_label: Scenario Catalog
---

# Scenario Catalog (child)

Scenario buckets tied to onboarding flows:

- Prospect & party: `/v1/checkEligibility`, `/v1/corporate-entity`, `/v1/individuals`, `/v1/case`.
- KYC/AML: ComplyAdvantage Mesh scans, webhook callbacks, case state changes.
- IDV (if in scope): Jumio happy path and failure paths.
- Account: `currentAccount/initiate`, retrieve, VP payment instruments.
- Documents: DocuSign template send, envelope lifecycle, document storage.
- Auth/RBAC, error handling, and resilience (downstream timeouts, partial failure + compensation).

Each scenario group is broken into:

- Happy path.
- Negative/boundary cases.
- Security/authz checks.
- Observability expectations (logs, metrics, traces to verify).

Clear markers for automation candidates vs manual exploratory.
