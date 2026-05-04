---
id: scenario-catalog
title: Scenario Catalog
sidebar_label: Scenario Catalog
---

# Scenario Catalog

This catalog lists the onboarding test scenarios that make up the regression
suite. Scenarios cover the happy path and the most common edge cases across
KYC, account setup, integration, and go-live. Each scenario has a stable ID
that is referenced in test plans and release notes.

| Scenario ID | Description | Type | Priority | Status |
| --- | --- | --- | --- | --- |
| ONB-001 | Happy path: low-risk corporate client onboards from intake to go-live without exceptions. | E2E | P0 | Active |
| ONB-002 | KYC referral: client triggers a manual review; analyst approves; flow resumes. | E2E | P0 | Active |
| ONB-003 | KYC rejection: sanctions match results in case rejection; audit log entries verified. | E2E | P0 | Active |
| ONB-004 | Document re-upload: invalid passport image rejected; valid re-upload accepted. | Integration | P1 | Active |
| ONB-005 | Beneficial owner update: change to ownership structure during KYC re-runs screening. | Integration | P1 | Active |
| ONB-006 | Account provisioning failure: downstream ledger error triggers compensation; case returns to a safe state. | E2E | P1 | Active |
| ONB-007 | Webhook delivery: `CaseStateChanged` events are delivered, signed, and retried on partner 5xx. | Integration | P1 | Active |
| ONB-008 | Token expiry mid-flow: partner integration handles 401 and retries with a fresh token. | Integration | P2 | Active |
| ONB-009 | Rate limit: partner exceeds sandbox rate limit; receives 429 with `Retry-After`; client backs off correctly. | Integration | P2 | Active |
| ONB-010 | Idempotent retry: duplicate intake submission with the same idempotency key results in a single case. | Integration | P1 | Active |
| ONB-011 | High-risk client EDD: enhanced due diligence path requires Compliance Officer approval before account setup. | E2E | P0 | Active |
| ONB-012 | Go-live cutover: production access enabled; first transaction succeeds within hypercare window. | UAT | P0 | Active |
| ONB-013 | Sandbox reset: scheduled reset clears tenant data; partner re-seeds via documented flow. | E2E | P2 | Active |
| ONB-014 | Concurrent cases: 50 cases opened in parallel; orchestrator processes all without state corruption. | Performance | P1 | Active |

## Maintenance

- New scenarios are proposed via PR against this catalog and reviewed by the
  Onboarding QA lead.
- Retired scenarios are kept in the catalog with status `Retired` so that
  historical references remain valid.

:::caution
Work in progress.
:::
