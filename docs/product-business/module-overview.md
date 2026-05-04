---
id: module-overview
title: Module Overview
sidebar_label: Module Overview
---

# Module Overview

This section outlines the core modules and representative APIs used within
the onboarding journey. Exact endpoints and environments are managed via
**Kong/Keycloak** and governed by the **Schema Registry**.

## Prospect & Party Management

**Prospect Qualification**
- Check eligibility (country/business type).
- Data store: `qualify_prospect_db`; governance: ensure env parity.

**Customer Information File (CIF) / MSD Party**
- Corporate and Individual CRUD, related individuals, case and `appForm`
  status.
- Executive management, authorized signatories, account users,
  shareholders.

## Compliance & Risk

**ComplyAdvantage Mesh adapter**
- Individual / Corporate / Beneficiary screening; webhook callbacks;
  scan history.
- Webhook subscriptions per env: `CASE_CREATED`, `CASE_STATE_UPDATED`,
  `WORKFLOW_COMPLETED`.

**Transaction monitoring**
- Transaction screening and callbacks (post-onboarding / ongoing
  monitoring).

## Account Opening & Payments

**Thought Machine Vault Core**
- Create / search / update customer in Vault Core.

**Account services**
- Account initiation/retrieval; status/identifier updates; VP link/instruments.
- Variants: V1 / V2 and Vault Payments workflow.

## Documents & E-signature

**DocuSign integration**
- S3 upload / signed URL; MSD document CRUD; send template; status;
  webhook via AWS Lambda.

## Orchestration & UI

**Conductor OSS engine**
- BPMN-compliant workflows.

**Schema-driven UI orchestration**
- Runtime screen sequencing and validation.

## Entitlements & Controls

- Users / roles; maker-checker groups and limits.
- Transaction validation / approval; audit.

## Observability & Data

- Kafka consumers and transformation services (Dev focus) for TM/VP topics.
- Grafana / Prometheus / Loki dashboards for API / workflow health.

---

API and naming standards follow **FinX GLUE** conventions; service-to-target
mappings and transformations are config-driven via Adapter and Target
configuration JSONs.

:::caution
Work in progress.
:::
