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
  - [2.4 FinX Glue Services (BIAN Layer)](#24-finx-glue-services-bian-layer)
  - [2.5 Additional Platform Services](#25-additional-platform-services)
- [3. Schema Registry & SoP](#3-schema-registry--sop)
- [4. Orchestration Engine](#4-orchestration-engine)
- [5. API Reference](#5-api-reference)
  - [5.1 Prospect & Party](#51-prospect--party)
  - [5.2 Compliance & KYC](#52-compliance--kyc)
  - [5.3 Account & Payments](#53-account--payments)
  - [5.4 Documents & E-signature](#54-documents--e-signature)
  - [5.5 Entitlements (post-onboarding controls)](#55-entitlements-post-onboarding-controls)
  - [5.6 Beneficiary](#56-beneficiary)
  - [5.7 Account Closure](#57-account-closure)
  - [5.8 State Transitions](#58-state-transitions)
  - [5.9 Freeze/Unfreeze](#59-freezeunfreeze)
  - [5.10 Transaction Screening](#510-transaction-screening)
  - [5.11 Products](#511-products)
  - [5.12 Service Requests](#512-service-requests)
- [References](#references)
- [Page Shortcuts](#page-shortcuts)

## 1. Architecture Overview

FinX Glue is a modular, config-driven interoperability layer that exposes BIAN-aligned microservices and adapters behind Kong + Keycloak, with governed schemas. The platform's architecture is designed to be modular, config-driven, and secure — enabling seamless interoperability between a client's identity infrastructure and multiple downstream target systems.

:::warning Implementation Note
Conductor OSS is documented as the target orchestration engine (see §4 Orchestration Engine), but per *FinX Glue Testing Requirements for QA and Test Team*: "Please note we are currently not using Conductor OSS for orchestration, we are handcoding it in the microservices." Current orchestration is hand-coded in microservices.
:::

*Source: FinX Glue - Architecture*

**Design principles:**

The architecture follows a few key principles. The **one microservice per Service Domain** pattern keeps BIAN operations modular and independently deployable. The **one adapter per target system** pattern isolates integration logic, meaning changes to one target system have no impact on others. The **config-driven approach** — using external JSON configuration files for both adapter routing and target API specifications — means the system can be extended to new target systems without requiring code changes to the core platform.

*Source: FinX Glue - Architecture*

**Request flow:**

When a user initiates a request, it first passes through the **Kong API Gateway**, which serves as the unified entry point for all traffic. Kong routes the request to **Keycloak**, which handles authentication via OIDC and User Federation, federating identity back to the client's IdP. Once authenticated, the request — carrying contextual metadata such as `tenant_id` and `bian_operation_id` (e.g., `CurrentAccount_Initiate`) — is forwarded to the appropriate **BIAN Microservice**. The microservice consults the `Adapter Config.JSON` to resolve the correct `adapter_bian_api_url`. The **Adapter Microservice** then executes a structured transformation pipeline: (1) Read Target Configuration, (2) Transform Target Payload, (3) Call Target API, (4) Handle Target Response, (5) Transform Target Response. The transformed response travels back through the stack and is returned to the user.

*Source: FinX Glue - Architecture*

**Configuration sources:** FinX Config Service (config DB), Payload Transformer (JOLT), externalized Target and Adapter configs.

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

### 2.4 FinX Glue Services (BIAN Layer)

These are the BIAN-aligned Glue services that sit between Kong/Keycloak and the adapters. Each maps to a single BIAN Service Domain:

| Glue Service | Stubs Available? | Integrating Adapter | BIAN Version |
| --- | --- | --- | --- |
| finx-glue-current-account-service | Yes | finx-glue-tm-account-adapter-service | v13 |
| finx-glue-customer-agreement-service | Yes | finx-glue-cif-adapter-service | v14 |
| finx-glue-customer-product-and-service-directory-service | Yes | finx-glue-cif-adapter-service | v14 |
| finx-glue-document-directory-service | Yes | finx-glue-cif-adapter-service | v13 |
| finx-glue-party-reference-data-directory-service | Yes | finx-glue-cif-adapter-service | v13 |
| finx-glue-position-keeping-service | Yes | finx-glue-tm-account-adapter-service | v14 |
| finx-glue-savings-account-service | Yes | finx-glue-tm-account-adapter-service | v14 |
| finx-glue-term-deposit-service | Yes | finx-glue-tm-account-adapter-service | v14 |

**Adapter Services:**

| Adapter | Target Host | Purpose |
| --- | --- | --- |
| finx-glue-cif-adapter-service | FinX-CIF | Integrates with FinX-CIF for Customer creation, search, updates. Also maintains Document Directory data, Customer Agreement data, and Customer Product Services data in CIF database as different collections. |
| finx-glue-tm-account-adapter-service | TM Vault Core | Integrates with TM-VC to fetch Savings/Current Account details and transaction details. |

*Source: Finx Glue Services and Adapter details*

### 2.5 Additional Platform Services

| Service | Purpose | DB | Build | Source |
| --- | --- | --- | --- | --- |
| finx-celta-tm-beneficiary-service | Beneficiary CRUD + AML screening by transfer type (Internal → lookup existing scan; External → new AML scan triggered) | beneficiary_db | Maven | Finx Microservices Details |
| finx-celta-tm-product-service | Fetch product list and product version details from TM Vault Core | N/A | Gradle | Finx Microservices Details |
| finx-celta-state-transition-service | Account state transitions (open→closed), closure request initiation with doc upload, approval workflow, audit logs | finx_state_transition_db | Gradle | Finx Microservices Details |
| finx-celta-tm-freeze-service | Freeze/unfreeze accounts via TM restriction definitions | finx_freeze_db | Gradle | Finx Microservices Details |
| finx-celta-msd-party-service | Fetch MSD party user lists by ID or name | N/A | Gradle | Finx Microservices Details |
| finx-celta-servicerequest-service | Service request CRUD to MSD, reply messages with documents, category details | N/A | Gradle | Finx Microservices Details |
| finx-celta-tm-dormancy-service | Dormant account management: create/fetch dormant cases, set/remove dormancy, re-KYC doc upload | finx_reports_db | Gradle | Finx Microservices Details |
| finx-reports-service | Report generation by name (PDF/CSV), report parameter management | finx_reports_db | Maven | Finx Microservices Details |
| finx-scheduler-task-service | Scheduled task execution | scheduler_task_db | — | FinX-Celta Services List |

## 3. Schema Registry & SoP

All BIAN-aligned API contracts are governed via a GitHub-hosted Schema Registry with dual-versioning and enforced CI validation. This is the authoritative source for OpenAPI YAMLs and their lifecycle.

**Dual-version model**

- `info.version` - technical API SemVer (MAJOR.MINOR.PATCH)
- `x-bian-version` - upstream BIAN spec version (e.g., 14.0.0)

Branching/tags: `main` (released), `develop` (integration), `feature/<sd>-<version>`, `release/<version>`, Git tags `v<version>`.

Workflow: BIAN Team raises SD onboarding JIRA -> Glue Team commits V0 base BIAN YAML -> BIAN Team customizes on feature branch -> PR to develop -> CI checks (Spectral, openapi-schema-validator, oasdiff) -> merge -> microservice generation/build-time schema conformance -> deploy -> promote to main and tag.

Failure handling: Design-time failures block PR; build-time failures fail pipeline and create JIRA linkage to schema version.

Repository structure: `schemas/<service-domain>/<version>/<sd>.yaml` plus `.spectral.yaml` and CI workflow.

**Non-negotiable:** Per CI validation rules (§4.1 of the SoP), every schema YAML must include both `info.version` and `x-bian-version`. Design-time failures (missing fields, breaking changes) block PR merge. Any row missing these in the Service Domain Registry remains Candidate/TBD until SoP onboarding completes.

## 4. Orchestration Engine

:::warning Implementation Note
Per *FinX Glue Testing Requirements for QA and Test Team*: "Please note we are currently not using Conductor OSS for orchestration, we are handcoding it in the microservices." The capabilities below are documented target-state architecture built on Conductor OSS. Current onboarding flows use hand-coded microservice orchestration.
:::

FinX Glue uses Conductor OSS as the core workflow engine, extended for BPMN-compliant definitions, Saga/compensation patterns, and human-in-the-loop (HITL) tasks. Onboarding journeys leverage configurable workflows and schema-driven UI orchestration to change step order/validation at runtime without redeployments.

**Capabilities:** wait/resume, parallelization, branching, timers, retries, escalations, role-based routing, SoD-aware approvals, HITL SLAs.

**Saga/compensation:** reversible/irreversible templates, checkpointing, undo logic, fallback routing, state recovery, centralized compensation audit.

**UI orchestration:** workflow + UI schema drive screen sequence, conditional navigation, validations, and runtime updates across web/mobile channels.

**Observability:** step-level SLIs (latency/success/retries), bottleneck analysis, failure heatmaps, correlation with downstream providers.

### Decisioning & Rules Engine Integration

FinX Glue integrates decisioning into workflows, enabling dynamic branching based on business rules, product policies, risk scoring, eligibility, or regulatory checks. This externalizes logic from code, enabling quick changes that take effect without redeployment.

- Pluggable integration with Drools, DMN, Decision Tables, or FinX Lightweight Rules Engine
- Runtime evaluation of rules for routing, eligibility, validation, scoring, and exception handling
- Rules versioning, approval workflow, and SoD enforcement via FinX Governance
- A/B rule version testing and safe rollout controls
- Audit history of rule changes for compliance and RCA

*Source: Process & Orchestration*

:::tip Onboarding workflow example (conceptual)
Product Selection → Application Initiation → Information Collection (4 sub-steps) → Preview & Submission → Data Validation & Compliance Checks → Application Decision → Customer & Account Creation → Credential Setup & Funding; compensation policies defined for failures at each checkpoint.
:::

## 5. API Reference

Representative, commonly used endpoints in the onboarding journey. All URLs are exposed via Kong; authentication is handled by Keycloak (OIDC). Naming and versioning follow FinX GLUE standards and the Schema Registry contracts.

**Demo Gateway Base URL:** `https://finx-demo-api.fincuro.in`

**Environment-specific clusters:**

| Environment | EKS Cluster |
| --- | --- |
| Dev | finx-celta-cluster-dev |
| QA | finx-celta-cluster-qa |
| QA Recreation | celta-eks-qa |
| UAT | celta-eks-uat |

### URL Naming Convention

From *FinX GLUE – API, Microservice Standards & Naming Conventions*:

```
/{namespace}/{api-type}/{version}/{service-domain}/{control-record-type}/{operation}
```

- **Case:** kebab-case (lowercase with hyphens)
- **API Types:** `public`, `internal`, `utility`
- **BIAN Operations:** initiate, retrieve, update, record, execute (for BIAN APIs); normal verbs for non-BIAN APIs
- **Versioning:** SemVer path-based for REST (`/api/v1/...`), package name for gRPC, topic suffix for Kafka
- **Deprecation:** Minimum 3-month window, support latest minus 2, communicated via `Deprecation: true` and `Sunset` headers
- **Repository naming:** Mandatory `finx-glue-` or `finx-glass-` prefix. Allowed component types: service, platform, ui, infra. CI validates via regex: `^finx-glue-[a-z0-9-]+-(api|service|platform|ui|infra|codegen)$`

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

### 5.6 Beneficiary

- `POST /beneficiary/initiate` - Create beneficiary with AML screening.
- `GET /beneficiary/details` - Fetch beneficiary details.
- `GET /beneficiary/{id}/retrieve` - Retrieve by ID.
- `PATCH /beneficiary/{id}` - Update beneficiary.
- `GET /beneficiary/retrieve/scanStatus` - AML scan status for beneficiary.

### 5.7 Account Closure

- `POST /v1/accounts/closure-requests/initiate` - Initiate closure request.
- `GET /v1/accounts/closure-requests/approval-pending-list` - Pending approvals.
- `PATCH /v1/accounts/closure-requests/approve` - Approve closure.

### 5.8 State Transitions

- `POST /v1/transitions/account-requests` - Initiate account state transition.
- `PATCH /v1/transitions/account-requests/approvals` - Approve transition.
- `GET /v1/transitions/account-requests/audit-logs` - Transition audit trail.

### 5.9 Freeze/Unfreeze

- `POST /v1/restrictions` - Apply freeze restriction.
- `PUT /v1/restrictions/{id}` - Update/remove restriction.
- `POST /v1/restrictions/definitionsVersions` - Fetch restriction definition versions.

### 5.10 Transaction Screening

- `POST /ca/v1/transactions/scans/initiate` - Initiate transaction screening.
- `GET /ca/v1/transactions/scans/{id}` - Retrieve scan result.
- `POST /ca/v1/transactions/scans/callback` - Webhook callback.

### 5.11 Products

- `GET /v1/products` - List all products from TM Vault Core.
- `GET /v1/products/{productVersionId}` - Get product version details.

### 5.12 Service Requests

- `POST /v1/serviceRequest` - Create service request to MSD.
- `GET /v1/serviceRequest/fetchCategoryDetails` - Fetch SR categories.
- `GET /v1/serviceRequest/fetchServiceRequestCommunicationDetails` - Fetch SR communications.

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
