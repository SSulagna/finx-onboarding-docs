---
id: test-strategy
title: Test Strategy
sidebar_label: Test Strategy
---

# Test Strategy

This page defines the testing strategy for FinX onboarding flows. The goal is
to catch regressions as early as possible, keep production releases routine,
and provide a clear definition of done at every test level.

## Testing philosophy

- **Shift left.** Most defects should be caught before code review by tests
  that run locally and in CI.
- **Test the contract, not the implementation.** Service tests assert
  behavior at the API and event boundary, not internal class structure.
- **Production-like data and topology** for higher test levels. Staging is
  expected to match production within documented gaps.
- **Determinism.** Flaky tests are quarantined within one business day and
  fixed or deleted within a week.
- **Owned by the producing team.** Each service team owns its tests at every
  level up to and including E2E for its own flows.

## Test levels

| Level | Scope | Tools | Owner |
| --- | --- | --- | --- |
| Unit | A single class, function, or module in isolation. | Jest, JUnit | Service team |
| Integration | A service exercised against its real datastore and stubbed external dependencies. | Jest, JUnit, Testcontainers | Service team |
| E2E | A full onboarding flow across multiple services in a deployed environment. | Cypress, Postman/Newman | Onboarding QA |
| UAT | Business-led acceptance against documented scenarios in staging. | Manual; tracked in the test management tool | Product / Client sponsor |

## Entry and exit criteria

### Unit
- **Entry.** Code change exists with a corresponding test plan in the PR.
- **Exit.** All unit tests pass; coverage on changed lines is at least 80%.

### Integration
- **Entry.** Unit tests pass; service builds successfully.
- **Exit.** Integration tests pass against a clean database; no warnings on
  schema compatibility checks.

### E2E
- **Entry.** All in-scope services deployed to the QA environment at the
  candidate version.
- **Exit.** All P0 and P1 scenarios in the
  [scenario catalog](./scenario-catalog.md) pass; no open P0 defects.

### UAT
- **Entry.** Release candidate deployed to staging; E2E sign-off recorded.
- **Exit.** Business stakeholders explicitly accept the release; any defects
  are tracked with agreed disposition.

:::caution
Work in progress.
:::
