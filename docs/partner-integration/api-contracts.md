---
id: api-contracts
title: API Contracts
sidebar_label: API Contracts
---

# API Contracts

FinX Glue uses a strict URL, versioning, and governance model for both BIAN Service APIs and Business APIs. Partners should design against the published contracts and adhere to compatibility rules.

*Source: FinX GLUE – API, Microservice Standards & Naming Conventions*

## URL schema

```
/{namespace}/{api-type}/{version}/{service-domain}/{control-record-type}/{operation}
```

- `namespace`: enterprise API namespace (e.g., `api.ustfinx.com`)
- `api-type`: `public`, `internal`, or `utility`
- `version`: `v1`, `v2` (path-based for REST)
- `service-domain`: BIAN Service Domain in kebab-case (e.g., `customer-onboarding`)
- `control-record-type`: functional partition (e.g., `party-reference`)
- `operation`: BIAN-aligned verb (`initiate`, `retrieve`, `update`, `record`, `execute`)

**Case:** kebab-case (lowercase with hyphens) for all URL segments.

**Repository naming:** Mandatory `finx-glue-` or `finx-glass-` prefix. Allowed component types: service, platform, ui, infra. CI validates via regex: `^finx-glue-[a-z0-9-]+-(api|service|platform|ui|infra|codegen)$`

## Dual API Model (Current vs Target)

From *Transitioning FinX Glue to a Business Capability Platform: Current and Target States*:

- **Current state:** Channels call multiple BIAN Service APIs and manage sequencing, retries, and error handling themselves.
- **Target state:** Channels call single Business APIs (Account Opening, Customer Onboarding). FinX Glue handles all orchestration internally. BIAN APIs remain intact and are used internally by the abstraction layer; they may still be exposed selectively for advanced or internal use cases.

## Versioning and compatibility

- **Semantic Versioning** via OAS `info.version` (MAJOR.MINOR.PATCH)
- **x-bian-version** tracks upstream BIAN specification version (e.g., 14.0.0) independently
- **Safe changes** (MINOR/PATCH): optional fields with defaults, new endpoints, extended enums — no MAJOR bump required
- **Breaking changes** (MAJOR): removed/renamed fields, changed response structure, modified auth — requires MAJOR increment
- Evented and gRPC APIs follow topic-suffix and package naming versioning respectively
- **Deprecation window:** 3-month minimum; support latest minus 2; surfaced via `Deprecation: true` and `Sunset` response headers and release notes

## Schema governance

- All OpenAPI YAMLs are stored in the **Schema Registry** (`ust-finx-schema-registry` on GitHub) and include `info.version` and `x-bian-version`
- **Dual-version model:** `info.version` (SemVer for API evolution) and `x-bian-version` (BIAN specification version)
- **Two-team workflow:** BIAN Team owns spec domain knowledge and raises PRs; Glue Team owns the registry, reviews PRs, and enforces standards
- **CI validation:** Design-time (Spectral OAS lint + oasdiff breaking-change detection) and build-time (code generation conformance + contract tests + payload validation)
- Design-time failures block PR merge; build-time failures fail pipeline deployment
- Partners proposing new SDs or extensions follow the SoP with JIRA linkage

*Source: Schema Registry and SoP for onboarding new BIAN services in Glue*

For target state Business APIs, the same URL and versioning rules apply. The Business Abstraction Layer orchestrates underlying BIAN calls and returns a unified response.

## References

- FinX GLUE – API, Microservice Standards & Naming Conventions
- Schema Registry & SoP
- Transitioning FinX Glue to a Business Capability Platform: Current and Target States
