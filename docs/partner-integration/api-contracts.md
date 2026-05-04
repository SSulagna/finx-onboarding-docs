---
id: api-contracts
title: API Contracts
sidebar_label: API Contracts
---

# API Contracts

FinX Glue uses a strict URL, versioning, and governance model for both BIAN Service APIs and Business APIs. Partners should design against the published contracts and adhere to compatibility rules.

## URL schema

```
/{namespace}/{api-type}/{version}/{service-domain}/{control-record-type}/{operation}
```

- `namespace`: enterprise API namespace (e.g., `api.ustfinx.com`)
- `api-type`: public, internal, or utility
- `version`: `v1`, `v2` (path-based for REST)
- `service-domain`: BIAN Service Domain in kebab-case (e.g., `customer-onboarding`)
- `control-record-type`: functional partition (e.g., `party-reference`)
- `operation`: BIAN-aligned verb (`initiate`, `retrieve`, `update`, `record`, `execute`)

## Versioning and compatibility

- Semantic Versioning via OAS `info.version`
- Backward-compatible changes allowed as MINOR/PATCH (add optional fields, add endpoints)
- Breaking changes require MAJOR increment
- Evented and gRPC APIs follow topic-suffix and package naming versioning respectively
- Deprecation window: 3 months; latest minus 2 supported; surfaced via response headers and release notes

## Schema governance

- All OpenAPI YAMLs are stored in the Schema Registry and include `info.version` and `x-bian-version`
- Changes flow via PR with CI validation (Spectral, oasdiff); merges trigger codegen and contract tests
- Partners proposing new SDs or extensions follow the SoP with JIRA linkage

For target state Business APIs, the same URL and versioning rules apply. The Business Abstraction Layer orchestrates underlying BIAN calls and returns a unified response.

## References

- API & Naming Conventions
- Schema Registry & SoP
