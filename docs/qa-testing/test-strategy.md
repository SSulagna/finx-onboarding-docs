---
id: test-strategy
title: QA & Testing Guide
sidebar_label: Test Strategy
---

# QA & Testing Guide (parent)

- Purpose and audience (QA, engineering, DevOps, release, security).
- Scope and out-of-scope, explicitly aligning to Glue's synchronous APIs only and excluding UI/eventing, derived from:
  - FinX Glue Testing Requirements for QA and Test Team
- Summary of required test types (unit, component, contract, API, integration, system, regression, performance, security, resilience).
- Roles & responsibilities and key deliverables tables.
- Links back into Partner Integration, Engineering Guide, and Environments.

## Test Strategy (child)

- Test objectives specifically for client onboarding + account opening flows.
- In-scope: BIAN APIs, orchestration, adapters, security, observability, CI/CD quality gates.
  Out-of-scope: UI, async topics, CDC, production data use (mirroring the TRD).
- Detailed test types section (mapped to TRD test groups) using the table structure from:
  - FinX Glue Testing Requirements for QA and Test Team
- Entry/exit criteria per phase (Dev -> QA -> PERF -> DEMO) and a distilled release readiness checklist reusing the TRD's performance and quality gates.
- CI/CD pipeline gates (code review, unit, coverage, SAST/SCA/DAST, contract validation, smoke, regression, performance, observability) adapted for onboarding services.
- Risk & mitigation table tuned to onboarding (changing BIAN contracts, adapter instability for ComplyAdvantage/Jumio/DocuSign/TM, limited observability, demo risk).
