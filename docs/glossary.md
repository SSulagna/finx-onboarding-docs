---
id: glossary
title: Glossary
sidebar_label: Glossary
---

# Glossary

Key terms used across FinX documentation, organized alphabetically.

**Adapter.** A thin integration layer that translates between FinX's BIAN-aligned internal API format and the proprietary API of a downstream provider (e.g., Thought Machine, ComplyAdvantage). Each target system has its own adapter.

**BIAN (Banking Industry Architecture Network).** An industry consortium that defines a standard model of banking service domains and canonical API structures. FinX aligns its microservices to BIAN service domains for cross-bank consistency.

**BPMN (Business Process Model and Notation).** A standard for describing business workflows in a visual, machine-readable format. FinX uses BPMN-compliant definitions inside Conductor to model onboarding journeys.

**Business Abstraction Layer.** The target-state architecture in FinX where channels call a single Business API (e.g., "Customer Onboarding") instead of composing multiple BIAN service calls themselves. The abstraction layer handles orchestration, retries, and compensation internally.

**CIF (Customer Information File).** The master customer record in core banking. FinX creates and updates the CIF through the Party/MSD service during onboarding.

**ComplyAdvantage.** A third-party KYC/AML screening provider. FinX integrates with ComplyAdvantage Mesh to run entity screening, sanctions checks, and ongoing monitoring via webhook callbacks.

**Conductor.** Netflix Conductor OSS, a workflow orchestration engine. FinX uses it to define, execute, and monitor BPMN-compliant onboarding workflows with support for Saga compensation, HITL tasks, and parallel steps.

**DocuSign.** An e-signature platform. FinX integrates with DocuSign for agreement generation, template management, signing ceremonies, and webhook-based status tracking.

**HITL (Human-in-the-Loop).** A workflow step that pauses automated processing and routes work to a human operator (e.g., a banker or compliance officer) for review, approval, or exception handling before the workflow continues.

**IDV (Identity Verification).** The process of verifying that a customer is who they claim to be, typically through document capture and biometric checks. FinX integrates with providers like Jumio for IDV.

**Jumio.** A third-party identity verification provider that performs document validation and biometric matching. Used in the IDV step of onboarding when configured.

**Keycloak.** An open-source identity and access management server. FinX uses Keycloak as its authorization server for OIDC token issuance, user federation, and role-based access control across all API calls.

**Kong.** An API gateway that serves as the single ingress point for all FinX API traffic. Kong handles routing, rate limiting, and token validation before forwarding requests to the appropriate BIAN microservice.

**KYC / AML (Know Your Customer / Anti-Money Laundering).** Regulatory processes that verify customer identity and screen for sanctions, politically exposed persons, and financial crime risk. FinX automates these through ComplyAdvantage and rule-based screening.

**MFE (Microfrontend).** A frontend architecture pattern where the UI is composed of independently deployable modules. FinX uses schema-driven MFEs for onboarding screens so product teams can configure screens without code changes.

**MSD (Master Service Domain).** The BIAN service domain responsible for maintaining master records (e.g., Party/Customer). In FinX, the MSD stores the canonical customer profile.

**OFAC (Office of Foreign Assets Control).** A US Treasury department that maintains sanctions lists. FinX screening checks customer data against OFAC lists as part of KYC/AML compliance.

**Saga Pattern.** A distributed transaction pattern where each step in a workflow has a corresponding compensation action. If a later step fails, earlier steps are rolled back through their compensating actions. FinX uses Saga patterns in Conductor workflows.

**Schema Registry.** A centralized repository of versioned OpenAPI specifications for all FinX BIAN service domains. Specs are validated through CI (Spectral, oasdiff) and serve as the single source of truth for API contracts.

**Service Domain.** A BIAN concept representing a discrete area of banking capability (e.g., Current Account, Party, KYC). Each FinX microservice maps to one BIAN service domain.

**Thought Machine Vault.** A cloud-native core banking platform. FinX integrates with Thought Machine for account creation, balance management, and payment processing through dedicated adapters.

:::caution
Glossary is under active development. Submit additions or corrections through the documentation backlog.
:::
