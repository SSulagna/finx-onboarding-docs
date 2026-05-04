---
id: journey-map
title: Onboarding Journey Map
sidebar_label: Journey Map
---

# Onboarding Journey Map

The end-to-end retail onboarding journey. Steps can be re-ordered or
toggled via workflow and UI schema configuration.

## 1. Prospect Qualification

- **Inputs:** Country of residence/incorporation; business type.
- **Outcome:** Eligible/Ineligible with reason codes; optional case officer
  recommendation.
- **Service:** `finx-qualify-prospect-service-papi`

## 2. Personal / Entity Details

- **Individual:** Personal details, contact info, address.
- **Corporate:** Entity details; directors/executive management; authorized
  signatories; account users; shareholders.
- **Services:** `finx-customer-onboarding-service-papi`,
  `finx-shareholder-service-papi`

## 3. ID Verification (Optional)

- Third-party IDV provider (e.g., **Jumio**) for document and liveness
  checks.
- **Outcome:** Verified / Manual review / Fail with reason.

## 4. KYC / AML Screening

- **Provider:** ComplyAdvantage Mesh via
  `finx-amln-fraud-detection-adapter`.
- **Flow:** Create-and-screen sync workflow; receive webhook updates;
  persist scan history.
- **Outcome:**
  - No profiles → proceed.
  - Matches → configurable error.
  - Manual review → HITL task.

## 5. Case Management & Approvals

- Create application case; track `appForm` status.
- Human-in-the-loop approvals with SLA and escalation rules.

## 6. Account Creation

- **Core:** Thought Machine Vault Core account creation; retrieve accounts;
  set identifiers/status.
- **Payments:** Vault Payments link and instruments (when applicable).
- **Services:** `finx-celta-tm-account-service`,
  `finx-celta-tm-party-service`.

## 7. Document Signing

- Create documents; send DocuSign template; handle webhook callbacks.
- **Service:** `finx-celta-docusign-security`; Document Directory.

## 8. Account Funding

- Initiate funding flows or mark ready-for-use.
- Entitlements configured for maker-checker approvals where required.

## 9. Post-Onboarding

- Customer portal provisioning; optional onboarding checklist in BWB.

:::caution
Work in progress.
:::
