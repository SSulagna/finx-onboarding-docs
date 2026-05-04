---
id: orchestration-engine
title: Onboarding Orchestration Engine
sidebar_label: Orchestration Engine
---

# Onboarding Orchestration Engine

The onboarding orchestration engine is the stateful workflow service that
drives a client onboarding case from intake through go-live. It is the only
service authorized to advance the onboarding case state machine.

## Overview

- Implemented as a workflow engine on top of a durable event store.
- Each onboarding case is a long-running workflow instance keyed by case ID.
- Steps are defined declaratively; step handlers are stateless workers that
  call out to the relevant domain services (KYC Engine, Account Provisioning,
  etc.).
- Workflow definitions are versioned; in-flight cases continue to run on the
  workflow version they were started on.

## Step sequencing

The default onboarding workflow advances through these states:

1. `Intake` — case opened, intake form captured.
2. `KycInProgress` — KYC Engine actively running checks.
3. `KycComplete` — decision rendered, risk rating assigned.
4. `AccountProvisioning` — tenant and accounts being created.
5. `IntegrationInProgress` — sandbox issued, partner building.
6. `IntegrationComplete` — all in-scope test scenarios passed.
7. `GoLiveRequested` — production access requested.
8. `Live` — case closed; client is live in production.

Each transition is event-sourced. The orchestrator publishes a
`CaseStateChanged` event on every transition.

## Error handling and retry policy

- **Transient errors** (timeouts, 5xx responses) are retried with exponential
  backoff: 30s, 2m, 10m, 1h, then escalated.
- **Idempotency** is required of every step handler. The orchestrator passes a
  deterministic step token; handlers must use it to deduplicate.
- **Compensation** is defined for each forward step. On unrecoverable failure,
  the orchestrator runs the registered compensation actions in reverse order
  before failing the case.
- **Human-in-the-loop.** Steps that require human review (e.g., compliance
  exception) are modeled as wait states with explicit timeouts. A timeout
  raises an operational alert rather than failing the case.

## Monitoring and alerting

- **SLOs** are tracked per workflow version: success rate, p95 step duration,
  and time-in-state distributions.
- **Dashboards** expose case throughput, time-in-state, and error rates,
  segmented by client risk rating.
- **Alerts** fire on:
  - SLO burn rate over the rolling 1h window.
  - Any case stuck in a non-wait state for more than the step's configured
    timeout.
  - Compensation runs (any compensation is treated as a high-signal event).
- All alerts route to the Onboarding Platform on-call rotation.

:::caution
Work in progress.
:::
