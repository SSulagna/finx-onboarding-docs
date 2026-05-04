---
id: compliance-kyc
title: Compliance and KYC Touchpoints
sidebar_label: Compliance & KYC
---

# Compliance and KYC Touchpoints

This page describes when and how compliance and KYC controls apply during
client onboarding. It is a product-level reference; the detailed control
implementation lives with the Compliance Platform team.

## Regulatory frameworks referenced

The following frameworks inform the FinX KYC/AML control set. The actual
applicability for any given client depends on the client's jurisdictions and
products in scope.

- **FATF Recommendations** — international AML/CFT baseline (placeholder).
- **FinCEN BSA program requirements** — U.S. customer identification and
  reporting obligations (placeholder).
- **EU AMLD (4th, 5th, 6th)** — EU anti-money laundering directives, including
  beneficial ownership requirements (placeholder).
- Local regulator guidance, where applicable (placeholder).

The mapping between framework requirements and platform controls is maintained
by the Compliance Platform team and is not duplicated here.

## KYC document checklist

The standard checklist for a corporate client is:

1. Certificate of incorporation or equivalent.
2. Articles of association or constitutional documents.
3. Register of directors and authorized signatories.
4. Beneficial ownership declaration (≥ 25% threshold by default).
5. Government-issued ID for each beneficial owner and signatory.
6. Proof of registered business address (dated within 3 months).
7. Source of funds / source of wealth declaration.
8. Regulatory licenses, where applicable to the client's activities.

Additional documents may be requested under enhanced due diligence (EDD).

## Onboarding touchpoints

| Phase | Compliance touchpoint | Output |
| --- | --- | --- |
| Pre-onboarding | Initial sanctions screening on the legal entity | Pass/refer decision |
| KYC & Compliance | Full document review, screening, risk rating | Risk rating, EDD decision |
| Account Setup | Entitlement and limit alignment to risk rating | Configured tenant |
| Integration | Review of any data-sharing or jurisdictional constraints | Integration constraints recorded |
| Go-Live | Final compliance attestation prior to production cutover | Recorded sign-off |

## Escalation path for compliance exceptions

1. **Case manager** raises an exception in the onboarding workflow with
   supporting evidence.
2. **Compliance analyst** reviews and either resolves or escalates within one
   business day.
3. **Compliance Officer** is the named decision-maker for medium- and
   high-risk exceptions and must record an explicit approve/reject.
4. **Compliance Committee** reviews any case where the Compliance Officer
   defers, or where regulator notification may be required.
5. All decisions, including the rationale, are written to the immutable
   audit log via the Reporting & Audit module.

:::caution
Work in progress.
:::
