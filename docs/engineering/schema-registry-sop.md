---
id: schema-registry-sop
title: Schema Registry SOP
sidebar_label: Schema Registry SOP
---

# Schema Registry SOP

The schema registry is the system of record for all event schemas exchanged on
the FinX event bus. It enforces compatibility rules so that producers and
consumers can evolve independently without breaking downstream services.

## Purpose

- Provide a single, versioned definition for every event type.
- Enforce backward and forward compatibility on schema changes.
- Allow consumers to deserialize events without out-of-band coordination.
- Produce a discoverable catalog of events for new services and engineers.

## SOP: registering a new schema

1. **Draft the schema.** Author the Avro schema in the owning service repo
   under `schemas/`. Follow the platform naming convention
   `com.finx.<bounded-context>.<event-name>`.
2. **Self-review.** Verify required fields, default values, doc strings on
   every field, and conformance to the platform style guide.
3. **Open a schema PR.** Open a PR in the central `finx/schemas` repo with the
   new file. The PR description must include the producing service, expected
   consumers, and an example payload.
4. **Compatibility check.** CI runs a compatibility check against the registry
   in non-production. The PR cannot merge if compatibility fails.
5. **Architecture review.** A reviewer from the Platform Architecture group
   reviews the PR. For high-impact contracts, the producing team presents at
   the weekly contract review.
6. **Merge and publish.** On merge, CI publishes the schema to the
   non-production registry as a new version.
7. **Promote to production.** After the producing service is deployed to
   production, the schema is promoted to the production registry. Promotion
   is automated but gated on deploy success.
8. **Announce.** Post a short note in the platform engineering channel
   describing the new schema and its consumers.

## Versioning policy

- **Backward compatible** changes (adding optional fields with defaults,
  adding enum symbols at the tail) are allowed without a major version bump.
- **Forward compatible** changes (removing optional fields, adding required
  fields) require a major version bump and a coordinated migration with
  consumers.
- **Breaking changes** require a new schema name (e.g., `*.v2`) and parallel
  publishing for a deprecation window of at least one quarter.
- All schemas carry a semantic version: `MAJOR.MINOR.PATCH`. The registry
  enforces that producers cannot publish a major bump without explicit
  approval.

## Key schemas

| Schema Name | Version | Owner | Last Updated |
| --- | --- | --- | --- |
| com.finx.onboarding.CaseOpened | 1.3.0 | Onboarding Platform | 2026-03-12 |
| com.finx.onboarding.CaseStateChanged | 1.2.1 | Onboarding Platform | 2026-04-02 |
| com.finx.kyc.DecisionRendered | 2.0.0 | Compliance Platform | 2026-02-18 |
| com.finx.kyc.RiskRatingAssigned | 1.1.0 | Compliance Platform | 2026-03-25 |
| com.finx.account.AccountProvisioned | 1.4.0 | Platform Operations | 2026-04-15 |
| com.finx.notification.NotificationDispatched | 1.0.2 | Client Experience | 2026-01-20 |

:::caution
Work in progress.
:::
