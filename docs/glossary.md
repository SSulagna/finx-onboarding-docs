---
id: glossary
title: Glossary
sidebar_label: Glossary
---

# Glossary

Every definition below is sourced from FinX Confluence documentation. Terms are grouped by category for quick reference.

---

## FinX Products

| Term | Definition | Source |
| --- | --- | --- |
| **FinX Glue** | A next-generation banking integration and interoperability platform — a BIAN-aligned, cloud-native framework that accelerates digital transformation for banks and fintechs. It enables institutions to build, deploy, and operate secure, composable, and host-agnostic banking systems by unifying API management, event-driven data exchange, observability, and governance within a single ecosystem. At its core, FinX Glue abstracts the complexity of integrating with legacy cores, fintech platforms, and modern cloud services by offering pre-built accelerators, protocol adapters, and canonical data models that ensure interoperability and compliance. | *FinX Glue* |
| **FinX Glass** | The central operations interface for banks adopting composable and progressively modernized architectures through FinX Glue. Built on Modyo's composable front-end platform, FinX Glass serves as a single operational cockpit where bank users can monitor, manage, and orchestrate all components and services integrated into FinX Glue — from APIs, workflows, and fintech integrations to compliance and observability dashboards. Each capability in FinX Glue is surfaced as a micro front-end application (MFE/SPA) inside FinX Glass. GLASS is a bank operator portal, currently targeting Customer & Account Management (CAM) and Task Management (TM). | *Introduction to FinX Glass* |
| **CIF (Customer Information File)** | The FinX-CIF application and database that serves as the customer master data store. The `finx-glue-cif-adapter-service` integrates with FinX-CIF for customer creation, customer search, and customer updates. It also maintains Document Directory data, Customer Agreement data, and Customer Product Services data in the FinX-CIF database as different collections. CIF is the adapter target for Party Reference Data Directory, Customer Product & Service Directory, Customer Agreement, and Document Directory service domains. ADR decisions (ADR-FINX-CIF-001 through ADR-FINX-CIF-006) govern how the BIAN BOM maps to CIF data models. | *Finx Glue Services and Adapter details · ADR - Finx CIF* |
| **MSD (Master Service Data)** | The internal master data store used by FinX onboarding services. The `finx-customer-onboarding-service-papi` provides APIs for customer onboarding purposes into MSD, including corporate entity creation, individual creation, case management, and appForm status tracking. MSD is referenced as a dependency in the FinX-Celta Services List for onboarding, qualify-prospect, and shareholder services. | *Finx Microservices Details · FinX-Celta Services List* |

---

## BIAN Terms (FinX Context)

| Term | Definition | Source |
| --- | --- | --- |
| **Service Domain (SD)** | A discrete BIAN business capability boundary that owns a specific functional pattern applied to an asset (e.g., Current Account, Customer Management). FinX organizes Glue services, API catalogs, and governance by SD. All API and schema ownership, access control, and lifecycle policies are SD-scoped. | *BIAN Glossary and Standards - FinX Context* |
| **Control Record (CR)** | The primary business object managed by an SD and the focal point for operations (e.g., Customer, Current Account). CRs define top-level resources in OpenAPI specs and anchor persistence, orchestration, and policy tagging. | *BIAN Glossary and Standards - FinX Context* |
| **Behavior Qualifier (BQ)** | A subdivision of a CR describing a specific aspect or behavior (e.g., KYC, Statements, Amount Block). BQs appear as nested resources/operations in APIs. FinX may add sub-qualifiers while keeping alignment to the parent BQ semantics. | *BIAN Glossary and Standards - FinX Context* |
| **BIAN BOM (Business Object Model)** | The canonical, BIAN-aligned business information model that standardizes attributes and relationships across SDs. The BOM drives canonical schemas in the Schema Registry and powers transformations between canonical payloads and target systems. All BIAN implementations must treat the BOM as the authoritative source for data definitions, relationships, and constraints (ADR-FINX-CIF-001). | *BIAN Glossary and Standards - FinX Context · ADR - Finx CIF* |
| **BIAN API** | A canonical, SD-scoped business API that adheres to BIAN semantics using standard action terms: initiate, retrieve, update, execute, evaluate, control, register, notify. BIAN APIs are the contract of record in FinX. Platform and tenant variability is expressed via governed extensions, not API shape changes. | *BIAN Glossary and Standards - FinX Context* |
| **Non-BIAN API** | APIs not defined by BIAN but needed in practice. FinX classifies these as Extension APIs (SD-specific, e.g., Dedup) or Utility APIs (cross-cutting, e.g., notification, audit, reference data lookup). Non-BIAN APIs follow BIAN-style naming and governance. They are retired or mapped if BIAN introduces equivalents. | *BIAN Glossary and Standards - FinX Context* |
| **V0 Spec** | The unmodified base BIAN YAML committed as the initial baseline in the Schema Registry for an SD. Establishes lineage; FinX customizations start after V0 and are fully versioned. | *BIAN Glossary and Standards - FinX Context* |
| **x-bian-version** | A custom OAS extension indicating the upstream BIAN SD specification version the schema aligns to (e.g., 14.0.0), separate from technical SemVer. Updated only when the underlying BIAN release changes. | *BIAN Glossary and Standards - FinX Context* |
| **supplementaryData** | A governed extension envelope carried within BIAN payloads to include platform or tenant-specific attributes without changing canonical fields. Namespaced and versioned blocks validated against JSON Schema before processing or persistence. | *BIAN Glossary and Standards - FinX Context* |
| **Canonical Model** | The unified, BIAN-aligned representation of business data used across APIs, events, and transformations to avoid point-to-point models. Realized through the BOM and enforced by the Schema Registry and CI policies. | *BIAN Glossary and Standards - FinX Context* |

---

## Architecture & Platform Terms

| Term | Definition | Source |
| --- | --- | --- |
| **Business Abstraction Layer (BAL)** | The new architectural layer being introduced on top of the existing BIAN Service APIs and Adapter Framework. It exposes business capabilities — specifically Account Opening and Customer Onboarding — as single-call Business APIs. Responsibilities: orchestration, policy enforcement, state management, and unified response. Today, channels must orchestrate multiple BIAN API calls per journey. In the target state, channels call one Business API and FinX Glue handles all orchestration internally. BIAN APIs remain intact and are used internally. | *Transitioning FinX Glue to a Business Capability Platform: Current and Target States* |
| **Adapter** | A provider connector that maps canonical (BIAN) payloads to target systems (cores, fintechs, CRM) and protocols, enabling independent evolution. One adapter per target system. Adapters execute a 5-step pipeline: Read Target Config → Transform Request → Call Target API → Handle Response → Transform Response. Governed by the canonical model; no direct SD-to-system coupling. Two primary adapters: `finx-glue-cif-adapter-service` (target: FinX-CIF) and `finx-glue-tm-account-adapter-service` (target: TM Vault Core). | *BIAN Glossary and Standards - FinX Context · FinX Glue Architecture · Finx Glue Services and Adapter details* |
| **Schema Registry** | A version-controlled, GitHub-hosted repository of BIAN-aligned OAS YAML schemas — the single source of truth for all canonical data contracts. Uses a dual-version model: info.version (SemVer) and x-bian-version. Hosts V0 baselines and FinX-customized versions; enforces design-time and build-time validation via CI/CD. GitHub repo: `ust-finx-schema-registry`. | *BIAN Glossary and Standards - FinX Context · Schema Registry and SoP for onboarding new BIAN services in Glue* |
| **MFE (Micro Front-End)** | A self-contained UI module deployed as an independent component through Modyo CMS or CI/CD. In FinX Glass, each capability is surfaced as an MFE (also called SPA). MFEs are IIFE bundles injected into the same page DOM (not iframes), sharing window, same origin, and same cookies. Built with Vue 3 + TypeScript + Vite. Examples: `finx-fe-cop-retail-onboarding`, `finx-fe-bop-service-request-fulfillment`. | *Introduction to FinX Glass · ADR - Glass - Session Lifecycle Management (PCI-DSS 8.2.8)* |
| **Orchestration Layer** | The process and policy layer that composes SD APIs, Utility APIs, and adapters into business journeys while insulating BIAN contracts from backend specifics. Handles sequencing, error handling, compensation, and routing; keeps domain APIs stable. | *BIAN Glossary and Standards - FinX Context* |
| **Saga / Compensation Pattern** | Pre-built patterns in Conductor OSS for maintaining data integrity across distributed systems. Includes reversible and irreversible compensation templates with embedded checkpointing, undo logic, fallback routing, and state recovery. Domain-ready blueprints for onboarding, payments, lending, servicing, and operations. Centralized audit trail for compliance. | *Process & Orchestration* |
| **HITL (Human-in-the-Loop)** | Workflow task types in Conductor OSS that support human interventions for approvals, reviews, escalations, exception handling, and compliance-driven interventions. Features: SLA timers, auto-escalation, delegation, audit history; Workflow Workbench UI for review/approve/reject; role-based routing, assignment, queueing, and SoD-aware dual approvals. In onboarding: manual review queue for KYC matches. | *Process & Orchestration* |
| **SemVer (Semantic Versioning)** | The OAS info.version using MAJOR.MINOR.PATCH to track API evolution independently of BIAN releases. MAJOR for breaking changes, MINOR for additive compatibility, PATCH for fixes; validated in CI. Deprecation policy: minimum 3-month window, support latest minus 2. | *BIAN Glossary and Standards - FinX Context · FinX GLUE – API, Microservice Standards & Naming Conventions* |
| **Extension Registry** | The catalog of approved platform and tenant extension schemas with metadata (namespace, version, searchable fields, PII tags). Enforced at request/response time to prevent schema drift and data leaks. Platform extensions: `platform:ustfinx.{domain}.{cr/bq}`; tenant extensions: `tenant:{tenantId}.{domain}.{cr/bq}`. | *BIAN Glossary and Standards - FinX Context* |

---

## Infrastructure & Gateway

| Term | Definition | Source |
| --- | --- | --- |
| **Kong API Gateway** | The unified entry point for all north-south API traffic in FinX Glue. Provides WAF, caching, API traffic routing with policy-based enforcement, rate limiting, and security policies. Kong routes requests to Keycloak for authentication. Native OpenTelemetry and Prometheus plugins stream telemetry data to the observability stack. | *FinX Glue · FinX Glue Architecture* |
| **Keycloak** | Handles authentication via OIDC and User Federation, federating identity back to the client's IdP. Ensures access control remains anchored to the client's own identity infrastructure. In FinX Glass, the Finx-Glass realm issues access tokens (5-min TTL) and refresh tokens (30-min TTL) stored in HttpOnly cookies. | *FinX Glue Architecture · ADR - Glass - Session Lifecycle Management (PCI-DSS 8.2.8)* |
| **Istio Service Mesh** | East-west control for service-to-service authentication, encryption, routing, retries, and zero-trust enforcement within the FinX Glue platform. | *FinX Glue* |
| **Conductor OSS** | The orchestration backbone of FinX Glue, enhanced to support BPMN-compliant workflow definitions (JSON/YAML). Orchestrates microservices, APIs, events, human tasks, and UI steps. Supports process states: wait, resume, parallelization, branching, timers, retries, and escalations. ⚠️ Per TRD §5.4, orchestration is currently hand-coded in microservices; Conductor-driven runtime is target state. | *Process & Orchestration · FinX Glue Testing Requirements for QA and Test Team* |
| **Modyo** | The composable front-end platform used by FinX Glass for micro front-end hosting and orchestration. Supports deployment of React/Vue SPAs as independent components. Provides CMS, build/deploy pipeline, and module federation capabilities. | *Introduction to FinX Glass* |

---

## Third-Party Integrations

| Term | Definition | Source |
| --- | --- | --- |
| **Thought Machine (TM) / Vault Core** | The core banking system integrated via `finx-glue-tm-account-adapter-service`. Used for customer creation (`finx-celta-tm-party-service`), account lifecycle management (`finx-celta-tm-account-service` with V1/V2/VP variants), postings and balances (`finx-celta-tm-postings-service`), and Vault Payments (`finx-celta-tm-vaultpayment-service`). TM endpoints in us-east-1 (N. Virginia); FinX in ap-south-1 (Mumbai) with VPC peering. | *Finx Microservices Details · FinX-Installation Manual · Finx Glue Services and Adapter details* |
| **ComplyAdvantage (CA) / Mesh** | The KYC/AML screening provider integrated via `finx-amln-fraud-detection-adapter`. Supports individual, corporate, and beneficiary entity screening through the ComplyAdvantage Mesh API. Uses a create-and-screen synchronous workflow with webhook callbacks (CASE_CREATED, CASE_STATE_UPDATED, WORKFLOW_COMPLETED). Screens against OFAC, sanctions lists, PEPs, and adverse media. Transaction screening handled separately by `finx-complyadvantage-transaction`. Webhook subscription performed manually by contacting CA support. | *Finx Microservices Details · FBSA-20* |
| **Jumio** | Third-party IDV (Identity Document Verification) provider for document authenticity and liveness checks. Integrated for ID verification during onboarding (Passport, Aadhaar, Driving License). Outcome: Verified / Manual review / Fail with reason. ⚠️ Flagged as High risk in the project plan; manual review flow for IDV failures is not in first release scope. | *🗂️Project Plan – Onboarding and Portal Program · FBSA-14* |
| **DocuSign** | E-signature and document management provider integrated via `finx-celta-docusign-security`. Capabilities: S3 document upload with signed URLs, MSD document CRUD, DocuSign template sending, envelope status tracking, and webhook callbacks via AWS Lambda (`celta-docusign-s3-demo`). DB: `finx_docusign_db` (Liquibase). ⚠️ Platform capability but not currently wired into the retail savings onboarding Jira scope (FBSA). | *Finx Microservices Details* |

---

## Observability & Quality

| Term | Definition | Source |
| --- | --- | --- |
| **Observability Stack** | The integrated open-source framework comprising Prometheus (metrics/monitoring), Grafana (visualization/alerting), Loki + Promtail (centralized logging), and OpenTelemetry (distributed tracing). Each API call is tracked from Kong Gateway ingress through FinX Glue microservices and backend integrations. Logs captured in JSON format with correlation identifiers (trace_id, span_id). Serves as the data backbone for SRE, enabling SLI/SLO/SLA measurement and enforcement. | *Observability* |
| **SLI / SLO / SLA** | Service Level Indicators (measurable metrics: availability, latency, error rate), Service Level Objectives (targets, e.g., 99.9% uptime), and Service Level Agreements (contractual commitments). FinX defines error budgets and burn rate alerts: 1–2× Warning, 2–5× Critical, >10× Deployment freeze + rollback. | *SRE and Observability · Observability* |
| **Spectral** | OpenAPI linting tool used in CI for design-time validation of OAS YAML schemas. Part of the Schema Registry governance pipeline. Failures block PR merge. | *Schema Registry and SoP for onboarding new BIAN services in Glue* |
| **oasdiff** | Breaking-change detection tool used in CI for design-time validation. Compares OpenAPI spec versions to detect backward-incompatible changes. Failures block PR merge. | *Schema Registry and SoP for onboarding new BIAN services in Glue* |

---

## Environments

| Term | Definition | Source |
| --- | --- | --- |
| **DEV** | Development environment for feature development, integration work, and early-stage testing. Frequent CI/CD deployments. Some Kafka consumers/transforms run only in Dev. Infrastructure may be scaled down. | *FinX Environments* |
| **QA** | Quality Assurance environment for validating functional correctness across integrated components. All major FinX Glue components deployed. CI/CD promotes validated builds from DEV to QA. | *FinX Environments* |
| **PERF** | Performance environment for scalability, throughput, and stability validation under realistic load. Infrastructure topology similar to production-equivalent. | *FinX Environments* |
| **DEMO** | The production-equivalent environment for customers. All platform releases deployed here after passing earlier validation stages. Functions as the customer-facing environment. | *FinX Environments* |

---

## Governance Roles

| Term | Definition | Source |
| --- | --- | --- |
| **BIAN Team** | Owns specification domain knowledge, drives schema customizations, and raises PRs for schema changes. Responsible for identifying SD candidates, downloading base BIAN specs, and customizing on feature branches. | *Schema Registry and SoP for onboarding new BIAN services in Glue* |
| **Glue Team** | Owns the GitHub Schema Registry, performs the initial V0 commit of base BIAN specs, reviews PRs, and enforces technical standards. Responsible for CI pipeline configuration and deployment promotion. | *Schema Registry and SoP for onboarding new BIAN services in Glue* |
| **Maker / Checker** | User roles in the entitlement service for transaction approval workflows. Maker initiates transactions (part of a Maker Group with specific limits). Checker approves transactions (part of an Approval/Checker Group with upper and lower authorization limits). Dual-approval (4-eyes) supported. Managed via `finx-celta-entitlement-service`. | *Finx Microservices Details* |
