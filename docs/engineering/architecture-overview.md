---
id: architecture-overview
title: Engineering Guide - FinX Client Onboarding
sidebar_label: Engineering Guide
---

# Engineering Guide - FinX Client Onboarding

**Audience:** Backend/Frontend Engineers, Architects, DevOps, QA.
**Purpose:** Provide implementation-grade documentation for building, integrating, and operating the FinX Client Onboarding capability using FinX Glue.

This guide is organized into five engineer-focused sections. Use the Table of Contents to jump to details, or open individual child pages for deep dives.

:::tip Related reading
- For the partner-facing integration model, see the [Partner Integration Guide](../partner-integration/auth-gateway).
- For testing strategy and environment matrix, see the [QA & Testing Guide](../qa-testing/test-strategy).
:::

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Microservices Registry](#2-microservices-registry)
  - [2.1 Onboarding and KYC](#21-onboarding-and-kyc)
  - [2.2 Account, Payments, and Documents](#22-account-payments-and-documents)
  - [2.3 Core Platform Utilities](#23-core-platform-utilities)
- [3. Schema Registry & SoP](#3-schema-registry--sop)
- [4. Orchestration Engine](#4-orchestration-engine)
- [5. API Reference](#5-api-reference)
  - [5.1 Prospect & Party](#51-prospect--party)
  - [5.2 Compliance & KYC](#52-compliance--kyc)
  - [5.3 Account & Payments](#53-account--payments)
  - [5.4 Documents & E-signature](#54-documents--e-signature)
  - [5.5 Entitlements (post-onboarding controls)](#55-entitlements-post-onboarding-controls)
- [References](#references)
- [Page Shortcuts](#page-shortcuts)

## 1. Architecture Overview

FinX Glue is a modular, config-driven interoperability layer that exposes BIAN-aligned microservices and adapters behind Kong + Keycloak, with Conductor-based orchestration and governed schemas. Client channels authenticate via OIDC and call BIAN or Business APIs. Requests traverse: Gateway/Auth -> BIAN Microservice (per Service Domain) -> Adapter (per target system) -> Downstream providers (e.g., Thought Machine, ComplyAdvantage, DocuSign).

Design principles: one microservice per BIAN Service Domain; one adapter per target system; configuration-driven routing and transformations; security via Keycloak; observability via Prometheus/Grafana/Loki.

Request flow: Kong -> Keycloak (OIDC/user federation) -> BIAN MS (resolves adapter via Adapter Config.JSON) -> Adapter pipeline (Target Config.JSON -> transform -> call -> normalize response) -> back to client.

Context propagation: tenant_id, bian_operation_id (e.g., CurrentAccount_Initiate), correlation IDs for tracing.

Configuration sources: FinX Config Service (config DB), Payload Transformer (JOLT), externalized Target and Adapter configs.

:::info Reference: Architecture diagram and detailed narrative
See FinX Glue - Architecture. The diagram `BIAN-Adapter-KC-Consolidated.drawio.png` shows the end-to-end stack and the config-driven adapter pattern.

Key excerpt: adapter pipeline steps include reading Target Config.JSON, transforming payload, invoking target API, handling and transforming target response back to BIAN format.

Target state evolution adds a Business Abstraction Layer that exposes single-call Business APIs (e.g., Account Opening) while keeping BIAN microservices internal.
:::

## 2. Microservices Registry

This section catalogs onboarding-relevant microservices with purpose, common endpoints, build/runtime details, and dependencies. For the full platform inventory, see the Finx Microservices Details and the FinX-Celta Services List.

### 2.1 Onboarding and KYC

**finx-customer-onboarding-service-papi**

- `POST /v1/corporate-entity`
- `POST /v1/individuals`
- `POST /v1/case`
- `GET /v1/appFormStatus/get?caseId={caseId}`

**finx-shareholder-service-papi** - Party roles in MSD: executive management, account users, authorized signatories, shareholders. Auth: Azure AD. Build: Gradle.

**finx-qualify-prospect-service-papi** - Prospect eligibility by country/business type; case officer recommendation. DB: `qualify_prospect_db` (Flyway). Auth: Azure AD. Build: Gradle.

**finx-amln-fraud-detection-adapter** - ComplyAdvantage Mesh entity screening (individual, corporate, beneficiary) with webhook callbacks; DB: `aml_fraud_db` (Liquibase); Build: Gradle. Webhook events per env: `CASE_CREATED`, `CASE_STATE_UPDATED`, `WORKFLOW_COMPLETED`.

**finx-complyadvantage-transaction** - CA transaction screening, webhooks, DB: `aml_fraud_db` (Liquibase). Build: Gradle.

### 2.2 Account, Payments, and Documents

**finx-celta-tm-party-service** - Thought Machine customer create/search/update.

**finx-celta-tm-account-service** - TM account lifecycle with V1/V2/VP variants (initiate/retrieve/status/update); Build: Gradle.

**finx-celta-tm-postings-service** - Postings and balances.

**finx-celta-tm-vaultpayment-service** - Vault Payments initiation and approval status tracking; stores reporting details in `finx_reports_db`.

**finx-celta-docusign-security** - S3 uploads, MSD Document CRUD, DocuSign templates/webhooks (Lambda `celta-docusign-s3-demo`). DB: `finx_docusign_db` (Liquibase). Build: Gradle.

### 2.3 Core Platform Utilities

**finx-config-service-sapi** and **finx-config-service-sapi-codegen** - Central config retrieval for adapters; DB-backed.

**finx-payload-transformer-service** - JOLT-based request/response transformations.

**finx-logger-service-sapi** - Centralized logging service.

**Kafka consumer/transformation services** - Dev-focused TM/VP topic consumption and storage to reporting DBs; not active across all envs.

:::note Environment and deployment references
FinX-Celta Services List contains ECR image references per env (Dev/QA/UAT) with cluster names and DB servers. Note: some Kafka consumers/transforms run only in Dev.
:::

## 3. Schema Registry & SoP

All BIAN-aligned API contracts are governed via a GitHub-hosted Schema Registry with dual-versioning and enforced CI validation. This is the authoritative source for OpenAPI YAMLs and their lifecycle.

**Dual-version model**

- `info.version` - technical API SemVer (MAJOR.MINOR.PATCH)
- `x-bian-version` - upstream BIAN spec version (e.g., 14.0.0)

Branching/tags: `main` (released), `develop` (integration), `feature/<sd>-<version>`, `release/<version>`, Git tags `v<version>`.

Workflow: BIAN Team raises SD onboarding JIRA -> Glue Team commits V0 base BIAN YAML -> BIAN Team customizes on feature branch -> PR to develop -> CI checks (Spectral, openapi-schema-validator, oasdiff) -> merge -> microservice generation/build-time schema conformance -> deploy -> promote to main and tag.

Failure handling: Design-time failures block PR; build-time failures fail pipeline and create JIRA linkage to schema version.

Repository structure: `schemas/<service-domain>/<version>/<sd>.yaml` plus `.spectral.yaml` and CI workflow.

**Non-negotiable:** Every onboarded SD must have `info.version`, `x-bian-version`, and a resolvable link to the registered YAML. Any row missing these in the Service Domain Registry remains Candidate/TBD until SoP onboarding completes.

## 4. Orchestration Engine

FinX Glue uses Conductor OSS as the core workflow engine, extended for BPMN-compliant definitions, Saga/compensation patterns, and human-in-the-loop (HITL) tasks. Onboarding journeys leverage configurable workflows and schema-driven UI orchestration to change step order/validation at runtime without redeployments.

Capabilities: wait/resume, parallelization, branching, timers, retries, escalations, role-based routing, SoD-aware approvals, HITL SLAs.

Saga/compensation: reversible/irreversible templates, checkpointing, undo logic, fallback routing, state recovery, centralized compensation audit.

UI orchestration: workflow + UI schema drive screen sequence, conditional navigation, validations, and runtime updates across web/mobile channels.

Observability: step-level SLIs (latency/success/retries), bottleneck analysis, failure heatmaps, correlation with downstream providers.

:::tip Onboarding workflow example (conceptual)
Qualify Prospect -> Capture Party/Related Individuals -> Optional IDV -> ComplyAdvantage screening -> Case/HITL approvals -> TM Party/Account creation -> DocuSign templates/signing -> Funding/Entitlements; compensation policies defined for failures at each checkpoint.
:::

## 5. API Reference

Representative, commonly used endpoints in the onboarding journey. All URLs are exposed via Kong; authentication is handled by Keycloak (OIDC). Naming and versioning follow FinX GLUE standards and the Schema Registry contracts. Use environment-specific base URLs and Kong routes as configured.

### 5.1 Prospect & Party

- `POST /v1/checkEligibility` - Qualify prospect; DB-backed validations on country and business type.
- `POST /v1/corporate-entity` - Create corporate in MSD.
- `POST /v1/individuals` - Create individual in MSD.
- `POST /v1/createRelatedIndividual` - Add related individuals (e.g., signatories, users).
- `POST /v1/case` - Create onboarding case; GET/PATCH for status and updates.

### 5.2 Compliance & KYC

- `POST /ca/v1/scan/individual` - ComplyAdvantage Mesh screening (entity stored and tracked).
- `POST /ca/v1/scan/corporate` - Corporate screening.
- `POST /ca/v1/scan/entity/webhook/callback` - Webhook endpoint (Mesh -> FinX Glue).
- `GET /ca/v1/entity/{entityId}` - Retrieve entity scan status.

### 5.3 Account & Payments

- `POST /currentAccount/initiate` - TM account creation (V1). Also V2: `POST /v2/account/initiate`.
- `GET /currentAccount/{partyReference}/retrieve` - Retrieve accounts for a customer (TM).
- `POST /account/vp/v1/initiate` - Account creation with Vault Payments linkage (VP V1/V2 variants available).
- `POST /payment/v1/transaction/initiate` - Initiate VP payment; GET/POST for approval status and details.

### 5.4 Documents & E-signature

- `POST /v1/documents/upload` - Upload to S3; `GET /v1/documents/signed-url`.
- `POST /v1/documents` - Create MSD document; PATCH/DELETE/GET for updates and queries.
- `POST /v1/documents/docusign/templates/send` - Send template; GET envelopes/status; webhook via AWS Lambda.

### 5.5 Entitlements (post-onboarding controls)

- `POST /entitlement/v1/user` - Create user; role assignments and checker/maker matrices.
- `POST /entitlement/v1/transaction/initiate` - Transaction validation and approval flows.

:::caution Important
Endpoint paths and versions evolve under SemVer rules. Always consult the Schema Registry (OpenAPI YAML) and Kong route catalog for the authoritative contract and environment base paths.
:::

## References

- FinX Glue - Architecture
- Finx Microservices Details (includes Postman collection)
- FinX-Celta Services List
- Schema Registry & SoP
- Process & Orchestration
- FinX GLUE - API, Microservice Standards & Naming Conventions
- FinX Service Domain & Microservice Registry
- Business Capability Platform Transition

## Page Shortcuts

- [Architecture Overview](#1-architecture-overview)
- [Microservices Registry](#2-microservices-registry)
- [Schema Registry & SoP](#3-schema-registry--sop)
- [Orchestration Engine](#4-orchestration-engine)
- [API Reference](#5-api-reference)
