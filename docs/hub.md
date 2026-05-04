---
id: hub
title: FinX Client Onboarding - Hub
sidebar_label: Hub
---

# FinX Client Onboarding - Hub

**Purpose:** This hub organizes everything related to client onboarding in
FinX, tailored for different audiences. Use the navigation below to jump to
the content that matches your role.

## Audience Navigation

This hub serves different stakeholders across the FinX organization. The audience labels below are drawn from roles defined in the FinX Glue Testing Requirements Document, FinX Glass User Personas, and FinX Glue Program cadences.

| Audience | Role in FinX (verified) | Start here |
| --- | --- | --- |
| Executives, Sponsors & Steering Committee | Clarify business expectations; approve scope and priorities; support release decisions; define acceptance criteria; confirm performance requirements (FinX Glue TRD - "Product Management" role) | [Executive Brief](./executive/brief) |
| Product Managers, Business Analysts & Solution Architects | Define product journeys, acceptance criteria, and functional requirements; own onboarding flow design and configurable orchestration decisions | [Product & Business Guide](./product-business/guide) |
| Backend/Frontend Engineers & Architects | Build testable services with defined interfaces; implement and maintain unit/component tests; fix defects within SLA; maintain API and mapping artifacts (FinX Glue TRD - "Engineering Team" role) | [Engineering Guide](./engineering/architecture-overview) |
| Operations Users | Monitor services, resolve issues, restart workflows - unified operational console and alert management (FinX Glass User Personas) | [Engineering Guide](./engineering/architecture-overview) |
| Compliance Officers | Track audit logs, monitor consent - centralized compliance dashboard (FinX Glass User Personas) | [Compliance & KYC Touchpoints](./product-business/compliance-kyc) |
| QA / Test Team | Own test planning and execution coordination; prepare and maintain test cases and regression packs; execute integration/system/regression/performance tests; report and track defects (FinX Glue TRD) | [QA & Testing Guide](./qa-testing/test-strategy) |
| DevOps / Platform Team | Maintain environments and deployment pipelines; enable test automation execution; ensure observability stack readiness (FinX Glue TRD) | [Engineering Guide](./engineering/architecture-overview) |
| Partner / SI Engineering Teams | External bank engineering teams and system integrators connecting to FinX Glue APIs; authenticate via OIDC/Keycloak federation | [Partner Integration Guide](./partner-integration/auth-gateway) |

*Role sources: FinX Glue Testing Requirements for QA and Test Team, Introduction to FinX Glass*

## What is FinX Client Onboarding?

FinX Client Onboarding is a composable, BIAN-aligned capability that
digitizes account opening and customer onboarding for banks. It combines
configurable UI journeys, workflow orchestration, BIAN service APIs, and
adapters to providers like **Thought Machine** (core), **ComplyAdvantage**
(KYC/AML), and **DocuSign** (e-signature).

## Key Concepts

### BIAN-Aligned Service Domains

FinX Glue structures all APIs around BIAN Service Domains (SDs) - discrete business capability boundaries that each own a specific functional pattern applied to an asset (e.g., Current Account, Savings Account). APIs follow BIAN semantics using Service Domains, Control Records (CRs), and Behavior Qualifiers (BQs). All API and schema ownership, access control, and lifecycle policies are SD-scoped. FinX currently has seven Implemented SDs (Current Account, Savings Account, Term Deposit, Customer Product & Service Directory, Customer Agreement, Document Directory, Position Keeping) and three Planned SDs (Party Lifecycle Management, Customer Offer, Product Directory), all aligned to BIAN version 14.0.0. One microservice is created per SD, and one adapter per target system.

*Sources: BIAN Glossary and Standards - FinX Context; FinX Service Domain and Microservice Registry Overview and Governance*

### Business Abstraction Layer (Target State)

The Business Abstraction Layer is the new architectural layer being introduced on top of the existing BIAN Service APIs and Adapter Framework. It exposes business capabilities - specifically Account Opening and Customer Onboarding - as single-call Business APIs. Its responsibilities are: orchestration, policy enforcement, state management, and unified response. Today, channels must orchestrate multiple BIAN API calls per journey, managing sequencing, retries, and error handling themselves. In the target state, channels call one Business API and FinX Glue handles all orchestration internally. BIAN APIs remain intact and are used internally by the abstraction layer; they may still be exposed selectively for advanced or internal use cases.

*Source: Transitioning FinX Glue to a Business Capability Platform: Current and Target States*

### Conductor-Based Orchestration

FinX Glue uses Conductor OSS as the orchestration backbone, enhanced to support BPMN-compliant workflow definitions (JSON/YAML) for modelling processes aligned to industry-standard notation. It orchestrates microservices, APIs, events, human tasks, and UI steps, supporting process states such as wait, resume, parallelization, branching, timers, retries, and escalations, with version-controlled workflow lifecycle management across environments. Key extensions include:

- **Saga & Compensation Patterns** - reversible and irreversible compensation templates with checkpointing, undo logic, fallback routing, and state recovery; domain-ready blueprints for onboarding, payments, lending, servicing, and operations.
- **Human-in-the-Loop (HITL)** - task types with SLA timers, auto-escalation, delegation, and audit history; Workflow Workbench UI for review/approve/reject; role-based routing, assignment, queueing, and SoD-aware dual approvals.
- **Decisioning & Rules Engine** - pluggable integration with Drools, DMN, Decision Tables, or FinX Lightweight Rules Engine; runtime evaluation for routing, eligibility, validation, scoring, and exception handling.
- **Schema-Driven UI Orchestration** - UI experience derived from workflow and UI schema definitions; dynamic screen sequencing (add/remove/reorder screens through config, not code); rule-based conditional navigation; consistent runtime updates across Web and Mobile channels without redeployments.

*Source: Process & Orchestration*

### Schema Registry Governance

The FinX Glue Schema Registry is a version-controlled, GitHub-hosted repository of BIAN-aligned OpenAPI Specification (OAS) YAML schemas. It acts as the single source of truth for all canonical data contracts governing APIs, events, and adapter interfaces. It uses a dual-version model: `info.version` (SemVer - MAJOR.MINOR.PATCH for API evolution) and `x-bian-version` (BIAN specification version, e.g., 14.0.0). Governance follows a two-team workflow: the BIAN Team owns specification domain knowledge, drives schema customisations, and raises PRs; the Glue Team owns the GitHub registry, performs the initial V0 commit of base BIAN specs, reviews PRs, and enforces technical standards. CI validation runs at two stages: design-time (OAS lint via Spectral, breaking-change detection via oasdiff, x-bian-version presence check) and build-time (code generation conformance, contract tests, payload schema validation). Design-time failures block PR merge; build-time failures fail pipeline deployment. A full RACI matrix governs all 11 lifecycle activities across BIAN Team, Glue Team, and DevOps.

*Source: Schema Registry and SoP for onboarding new BIAN services in Glue*

## Glossary

New to FinX terminology? Start with the [Glossary](./glossary).

:::info
This documentation is under active development.
:::
