---
id: environment-matrix
title: Environment Matrix
sidebar_label: Environment Matrix
---

# Environment Matrix

FinX onboarding flows are validated across four environments. Each
environment has a defined purpose, access model, data policy, and owner.
Engineers and partners should pick the lowest environment that supports the
work they are doing.

| Environment | Purpose | Access | Data Policy | Owner |
| --- | --- | --- | --- | --- |
| Dev | Per-developer and per-team experimentation. Latest code; may be unstable. | Internal engineering only. SSO-gated. | Synthetic data only. Reset on demand. | Service teams |
| QA | Integrated testing across services. Runs the regression suite. | Internal engineering and QA. SSO-gated. | Synthetic data only. Reset weekly. | Onboarding QA |
| Staging | Pre-production validation, UAT, and partner dress rehearsals. Production-like topology. | Internal stakeholders and approved partners. SSO and partner OAuth. | Synthetic data only; never production PII. Reset monthly. | Platform Operations |
| Production | Live client traffic. | Authorized operators and approved partners. Strict change control. | Real client data. Subject to retention and privacy policies. | Platform Operations |

## Environment parity

The platform aims for staging to match production in:

- Service versions and configuration topology.
- Network and security boundaries.
- Observability stack (metrics, logs, traces).
- Auth gateway configuration and scopes.

## Known parity gaps

- **External providers.** Staging uses sandbox endpoints for screening
  providers; production uses live endpoints. Behavior under load may differ.
- **Data volumes.** Staging carries a fraction of production data volume.
  Performance tests must be run against the dedicated performance
  environment, not staging.
- **Geographic footprint.** Production is multi-region; staging is
  single-region by default.
- **Hardware class.** Some staging clusters run on smaller instance types to
  control cost; this is documented per service.

Any newly identified gap should be raised to Platform Operations and tracked
until the gap is closed or formally accepted.

:::caution
Work in progress.
:::
