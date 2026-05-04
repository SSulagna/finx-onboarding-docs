---
id: journey-map
title: Client Onboarding Journey Map
sidebar_label: Journey Map
---

# Client Onboarding Journey Map

This page describes the end-to-end onboarding journey as a sequence of five
phases. Each phase has explicit entry criteria, key activities, exit criteria,
and a single accountable owner.

## Phase 1: Pre-onboarding

- **Entry criteria**
  - Signed commercial term sheet or letter of intent.
  - Designated client sponsor and primary technical contact.
- **Key activities**
  - Capture intake form (legal entity, jurisdictions, products in scope).
  - Initial scoping review with Product and Compliance.
  - Assign onboarding case ID and case manager.
- **Exit criteria**
  - Intake form complete and reviewed.
  - Onboarding case opened in the workflow tracker.
- **Owner:** Onboarding Case Manager.

## Phase 2: KYC & Compliance

- **Entry criteria**
  - Onboarding case open.
  - Required KYC document checklist shared with the client.
- **Key activities**
  - Collect and verify KYC documentation.
  - Run sanctions, PEP, and adverse media screening.
  - Assign client risk rating; trigger EDD if required.
- **Exit criteria**
  - Compliance Officer approval recorded.
  - Risk rating assigned and stored against the client record.
- **Owner:** Compliance Operations.

## Phase 3: Account Setup

- **Entry criteria**
  - Compliance approval from Phase 2.
- **Key activities**
  - Provision tenant and primary account structures.
  - Configure entitlements, limits, and notification preferences.
  - Issue sandbox credentials to the client integration team.
- **Exit criteria**
  - Tenant active in non-production with valid sandbox credentials.
  - Account configuration peer-reviewed.
- **Owner:** Platform Operations.

## Phase 4: Integration

- **Entry criteria**
  - Sandbox credentials issued.
  - Integration scope agreed (APIs, webhooks, file feeds).
- **Key activities**
  - Client implements against the sandbox.
  - Joint integration tests using the scenario catalog.
  - Contract reviews and final sign-off on API versions in use.
- **Exit criteria**
  - All in-scope integration test scenarios passed.
  - Production access request approved.
- **Owner:** Partner Integration Engineering.

## Phase 5: Go-Live

- **Entry criteria**
  - Integration phase complete and signed off.
  - Operations runbook acknowledged by the client.
- **Key activities**
  - Production credentials issued.
  - Controlled cutover with monitoring in place.
  - Hypercare window with daily check-ins.
- **Exit criteria**
  - Stable production traffic for the agreed hypercare period.
  - Go-live sign-off recorded by the client sponsor and Operations Lead.
- **Owner:** Operations Lead.

:::caution
Work in progress.
:::
