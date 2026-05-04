---
id: guide
title: Product & Business Guide
sidebar_label: Guide Overview
---

# Product & Business Guide

**Audience:** Product managers, business analysts, customer experience, and
solution architects.

## Journey Summary

Retail savings onboarding from product selection to funded account, with configurable
steps:

> Product Selection → Application Initiation → Information Collection (4 sub-steps) → Preview & Submission → Data Validation & Compliance Checks → Application Decision → Customer & Account Creation → Credential Setup & Account Funding → Post-Onboarding Provisioning

See the [Onboarding Journey Map](./journey-map.md) for field-level detail, Jira traceability, and BIAN API mappings.

## Modules at a Glance

- **Product Selection.** Product type, currency, and intended-use selection from configurable dropdowns.
- **Application Initiation.** Contact capture, de-duplication check, consent, Application ID generation.
- **Information Collection.** Personal details, identification (IDV via Jumio), contact info, address proof documentation — 4 sequential screens.
- **Data Validation & Compliance.** ComplyAdvantage KYC/AML screening + Jumio IDV (backend, no customer-facing screen).
- **Customer & Account Creation.** Thought Machine Vault Core party/account creation; Customer Agreement (consent) APIs.
- **Credential Setup & Funding.** Username/password setup + first deposit amount (⚠️ no payment provider integration in current release — UI placeholder only).
- **Bankers Workbench.** Service request dashboard, review/approve, exception handling, user management (in-progress).
- **Observability & Governance.** Dashboards, schema registry, CI/CD controls.

## User Roles in FinX Client Onboarding

| Role | Where Defined | Verified Responsibilities |
| --- | --- | --- |
| Retail Customer (self-service) | FinX Bank Savings Account, FinX Bank | Self-service onboarding via Retail Onboarding Portal; enters personal/contact/ID details; uploads documents; views application status; accesses Customer Portal post-onboarding to view accounts, transactions, and make payments. MFE: finx-fe-cop-retail-onboarding, finx-fe-cop-home-product-selection. |
| Teller / Bank Employee (Banker's Workbench) | FBSA-76: Operator Authentication & Access, FBSA-81: Dashboard showing Summary View of Pending Requests, FBSA-214: User Management | Logs into Banker's Workbench with role-based landing page; views Service Request dashboard with tabs "Pending for My Approval" (count-based) and "All Service Requests"; searches/filters by Customer ID, SR Type, Originating System, Date Range. As Administrator role, manages users: create new users (Employee ID, Name, Email, Department, Roles), modify user roles/department/status, reset passwords. MFEs: finx-fe-bop-service-request-fulfillment, finx-fe-bop-customer-details, finx-fe-bop-employee-management, finx-fe-bop-reports. |
| Maker | Finx Microservices Details, FBSA-214: User Management | User role for initiating transactions. Part of a Maker Group with specific limits for initiating transactions of different types (internal/external/FX). Created via finx-celta-entitlement-service API. |
| Checker | Finx Microservices Details, FBSA-214: User Management | User role for approving transactions. Part of an Approval Group/Checker Group with upper and lower authorization limits for approving transactions of different types. Dual-approval (4-eyes) supported. |
| Operations User | Introduction to FinX Glass | Primary needs: Monitor services, resolve issues, restart workflows. FinX Glass value: Unified operational console, alert management. Role model includes: Ops Agent, Supervisor. |
| Compliance Officer | Introduction to FinX Glass | Primary needs: Track audit logs, monitor consent. FinX Glass value: Centralized compliance dashboard. In onboarding context: reviews KYC/AML screening matches via HITL manual review queue with SLA and SoD-aware approvals. |
| API Manager | Introduction to FinX Glass | Primary needs: Manage API lifecycle, analyze traffic. FinX Glass value: Real-time API insights, version control. |
| Business Product Owner | Introduction to FinX Glass | Primary needs: Track fintech integrations and performance. FinX Glass value: Service-level visualization and analytics. |

:::note
No dedicated UX research or persona documentation was found for the Retail Customer beyond the FinX Bank Savings Account E2E Requirements. The Banker's Workbench functional spec exists as individual Jira user stories (FBSA-76, FBSA-81, FBSA-214), not as a consolidated spec document.
:::

## Configurable Orchestration

FinX Client Onboarding is designed around three orchestration layers. These are documented as target-state capabilities built on Conductor OSS; current onboarding flows use hand-coded microservice orchestration (see *FinX Glue Testing Requirements for QA and Test Team*).

### Layer 1 — Workflow Engine (Conductor OSS at Core)

FinX Glue uses Conductor OSS as the orchestration backbone, enhanced to support BPMN-compliant workflow definitions (JSON/YAML) for modelling processes aligned with industry-standard notation. It orchestrates microservices, APIs, events, human tasks, and UI steps, enabling standardized, predictable, and reusable business processes across digital products and channels.

- BPMN-compliant workflow definitions represented as JSON/YAML for portability, versioning, and reuse
- Process states: wait, resume, parallelization, branching, timers, retries, and escalations
- Version-controlled workflow lifecycle management across environments
- **Saga & Compensation Patterns:** reversible and irreversible compensation templates with embedded checkpointing, undo logic, fallback routing, and state recovery; domain-ready blueprints for onboarding, payments, lending, servicing, and operations
- **HITL Workflows:** HITL task types with SLA timers, auto-escalation, delegation, and audit history; Workflow Workbench UI for review/approve/reject; role-based routing, assignment, queueing, and SoD-aware dual approvals

*Source: Process & Orchestration*

### Layer 2 — Schema-Driven UI & Configurable Experience Engine

Listed as FinX Glue Component #3 in *FinX Glue*:

> "Generates UI screens and forms from schemas; enables dynamic, configuration-based UI changes (screen order, rules, validations, field visibility) without code changes or redeployments; supports omni-channel reuse."

Implementation details from *Process & Orchestration*:

- UI experience derived from workflow and UI schema definitions
- UI steps, screens, and user actions orchestrated by workflow execution context
- Dynamic screen sequencing: reorder/add/remove screens through config, not code
- Rule-based UI behavior for eligibility, skip/branching, validation, and conditional display
- Consistent runtime updates across Web and Mobile channels, without redeployments

### Layer 3 — Decisioning & Rules Engine Integration

Confirmed as a real documented capability. From *Process & Orchestration*:

> "FinX Glue integrates decisioning into workflows, enabling dynamic branching based on business rules, product policies, risk scoring, eligibility, or regulatory checks. This externalizes logic from code, enabling quick changes that take effect without redeployment."

- Pluggable integration with Drools, DMN, Decision Tables, or FinX Lightweight Rules Engine
- Runtime evaluation of rules for routing, eligibility, validation, scoring, and exception handling
- Rules versioning, approval workflow, and SoD enforcement via FinX Governance
- A/B rule version testing and safe rollout controls
- Audit history of rule changes for compliance and RCA

The *Business Process and Orchestration* confirms DMN/rules engine integration is in scope for the orchestration platform requirements.

:::warning Implementation Note
The TRD §5.4 states orchestration is currently hand-coded in microservices. TR-ORC-02 ("Conditional branching must select the correct path based on business rules") and TR-ORC-03 ("Rules-based routing must select the correct downstream service/adapter") confirm the orchestration requirements exist and are testable, even if the runtime is not yet Conductor-driven.
:::

## What FinX Makes Measurable

### Metrics Available Today (Implemented)

These are backed by the existing Prometheus + Grafana + Loki observability stack, documented in *Observability* and *SRE and Observability*:

| Category | Metrics | Grafana Dashboard |
| --- | --- | --- |
| Application Monitoring | Request Rate (RPS), Response Time/Latency (p50/p95/p99), Error Rate (4xx/5xx), Throughput, Exception Rate, Failed Transaction Rate | App Services Dashboard |
| Infrastructure | Node outages, CPU/Memory/Network I/O per pod and container, FileSystem usage | Kubernetes cluster & pod dashboards |
| Database | CPU usage, storage utilization, active connections, query compile time, average read query time, successful transactions | DB monitoring panels |
| Kafka/Eventing | Online/Offline brokers, partition metrics, topic health (throughput, messages, offsets), consumption lag, producer/consumer errors | Kafka monitoring panels |
| Business Dashboard | Total requests submitted, total responses received, total success/failure count, percentage success/failure — filterable by time range and per client/organization | Monitoring, Logging and Observability |
| Distributed Tracing | End-to-end trace correlation (trace_id, span_id) across Kong → BIAN microservice → adapter → target system; log/trace/metric correlation in Grafana | Tempo/Jaeger integration |
| SRE / Reliability | SLIs (availability, reliability, latency, error rates, throughput), SLO targets (e.g., 99.9% uptime), error budgets, burn rate alerts (1-2× Warning, 2-5× Critical, >10× Deployment freeze + rollback) | SLO/SLA dashboards (REQ-OBS-413) |

**Performance quality gates** (from *FinX Glue Testing Requirements for QA and Test Team*):

| Metric | Threshold |
| --- | --- |
| API Response Time | ≤ 500ms (p95) |
| Throughput | ≥ 2,000 RPS |
| Latency (TTFB) | ≤ 100ms |
| Error Rate | ≤ 1% |
| CPU Utilisation (peak) | ≤ 75% |
| Memory Utilisation | ≤ 70% |
| Peak Load Capacity | ≥ 1,000 concurrent users |
| Scalability degradation | ≤ 10% at peak |

### Task Management KPIs (Defined, Tracking In Progress)

From *Task Management Dashboard*:

| KPI | Target | Status |
| --- | --- | --- |
| Average Task Completion Time | < 2 hours | ON TRACK |
| SLA Compliance Rate | 95% | NEEDS ATTENTION |
| Overdue Tasks Count | < 10 | AT RISK |
| First Contact Resolution Rate | 85% | ON TRACK |
| Team Utilization Rate | 70–85% | NOT STARTED |
| Compliance Review Turnaround | < 4 hours | NEEDS ATTENTION |

### Onboarding Journey Metrics (Aspirational — Not Yet Instrumented)

The following are valid target metrics for the Business Abstraction Layer and FinX Glass Phase 3+, but are not currently backed by existing Grafana dashboards or documented KPI specs:

- Conversion rate through onboarding funnel stages
- Average time to complete onboarding (end-to-end)
- KYC pass/fail rates and screening match volumes
- Exception/manual-review volume and resolution SLAs
- Drop-off heatmaps by onboarding step/screen

The *Process & Orchestration* page describes the target-state "Process Insights" capability: "Journey bottleneck analysis and failure pattern heatmaps; Correlation of workflow failures with downstream systems, APIs, events, or human steps; Insight-driven recommendations for workflow redesign, rule tuning, or UX changes." These will become available when Conductor OSS orchestration is activated for onboarding workflows.

## Related Pages

- [Onboarding Journey Map](./journey-map.md)
- [Module Overview](./module-overview.md)
- [Compliance & KYC Touchpoints](./compliance-kyc.md)

:::caution
Work in progress.
:::
