---
id: architecture-overview
title: Platform Architecture Overview
sidebar_label: Architecture Overview
---

# Platform Architecture Overview

FinX is an event-driven, microservices-based platform exposed through an
API-first surface. This page summarizes the high-level architecture relevant
to client onboarding.

## Architectural principles

- **API-first.** Every capability is exposed through a versioned, contract-tested API before any UI is built on top of it.
- **Event-driven.** Cross-service communication for state changes uses a
  durable event bus; synchronous calls are reserved for request/response use
  cases.
- **Microservices.** Each bounded context is owned by a single team and
  deployed independently.
- **Immutable audit.** Every state-changing event is persisted to the audit
  log; downstream analytics and reporting are derived from this log.
- **Least privilege.** All inter-service and partner traffic flows through the
  auth gateway with scoped credentials.

## High-level diagram

```text
        ┌────────────────────┐        ┌──────────────────────┐
        │  Partner / Client  │        │  Internal Operators  │
        └────────┬───────────┘        └──────────┬───────────┘
                 │ HTTPS                         │ HTTPS
                 ▼                               ▼
            ┌───────────────────────────────────────────┐
            │            Auth Gateway / API Edge        │
            └───────────────┬───────────────────────────┘
                            │
        ┌───────────────────┼─────────────────────────────┐
        ▼                   ▼                             ▼
  ┌───────────────┐  ┌──────────────────┐        ┌────────────────────┐
  │ Onboarding    │  │ KYC Engine       │        │ Account            │
  │ Orchestrator  │  │                  │        │ Provisioning       │
  └──────┬────────┘  └────────┬─────────┘        └──────────┬─────────┘
         │                    │                             │
         ▼                    ▼                             ▼
                    ┌─────────────────────┐
                    │     Event Bus       │
                    └──────────┬──────────┘
                               ▼
                  ┌──────────────────────────┐
                  │ Reporting & Audit Store  │
                  └──────────────────────────┘
```

This is a simplified view; the full service inventory is in the
[microservices registry](./microservices-registry.md).

## Technology stack

| Layer | Technology | Notes |
| --- | --- | --- |
| API edge | Kong / NGINX gateway | TLS termination, rate limiting, JWT validation |
| Service runtime | JVM (Kotlin/Java) and Node.js | Language choice is per-service, owned by the service team |
| Event bus | Apache Kafka | Topic-per-bounded-context; schemas governed by the schema registry |
| Schema registry | Confluent-compatible registry | Avro schemas, version-controlled |
| Datastores | PostgreSQL (transactional), S3-compatible object store (documents), Elasticsearch (search) | Per-service ownership; no shared databases |
| Orchestration | Onboarding orchestrator service | Stateful workflow engine with retry and compensation |
| Observability | OpenTelemetry, Prometheus, structured logs | Standard SDKs supplied as platform libraries |
| Identity | OAuth 2.0 / OIDC | Both internal and partner credentials |

## Data flow: a new client onboarding event

1. Partner or operator submits an onboarding intake via the API edge.
2. The auth gateway validates credentials and forwards to the Onboarding
   Orchestrator.
3. The orchestrator opens a case and emits an `OnboardingCaseOpened` event.
4. The KYC Engine consumes the event, performs screening, and emits a
   `KycDecisionRendered` event.
5. On a positive decision, Account Provisioning creates the tenant and emits
   `AccountProvisioned`.
6. The orchestrator advances the case state and notifies stakeholders via the
   Notification Service.
7. All events are persisted to the Reporting & Audit store for downstream
   reporting.

:::caution
Work in progress.
:::
