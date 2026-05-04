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

- [Executive Brief](./executive/brief) - For sponsors and steering committee members tracking strategy, milestones, and risks
- [Product & Business Guide](./product-business/guide) - For product managers and BAs mapping FinX to their bank's onboarding processes
- [Onboarding Journey Map](./product-business/journey-map) - For anyone who needs the step-by-step flow from lead to funded account
- [Module Overview](./product-business/module-overview) - For solution architects evaluating which FinX components fit their use case
- [Compliance & KYC Touchpoints](./product-business/compliance-kyc) - For compliance officers and risk teams reviewing control points

## What is FinX Client Onboarding?

FinX Client Onboarding is a composable, BIAN-aligned capability that
digitizes account opening and customer onboarding for banks. It combines
configurable UI journeys, workflow orchestration, BIAN service APIs, and
adapters to providers like **Thought Machine** (core), **ComplyAdvantage**
(KYC/AML), and **DocuSign** (e-signature).

## Key Concepts

- **BIAN-aligned service domains.** FinX uses the BIAN industry standard to define canonical APIs and data contracts, making integrations predictable across banks.
- **Business Abstraction Layer.** A target-state architecture where channels make a single Business API call instead of orchestrating multiple BIAN service calls themselves.
- **Conductor-based orchestration.** FinX uses Netflix Conductor to run BPMN-compliant workflows with Saga compensation and human-in-the-loop steps.
- **Schema Registry governance.** All API specs are versioned, auditable, and validated through a centralized registry with CI-enforced quality checks.

## Glossary

New to FinX terminology? Start with the [Glossary](./glossary).

:::info
This documentation is under active development.
:::
