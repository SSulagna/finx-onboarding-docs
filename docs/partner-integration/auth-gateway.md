---
id: auth-gateway
title: Partner Integration Guide
sidebar_label: Partner Integration Guide
---

# Partner Integration Guide

This guide enables external bank engineering teams and SI partners to integrate with FinX Glue for client onboarding and account opening. It focuses on environment access, authentication, gateway routing, API contracts, and self-service testing.

Use the child pages for hands-on setup and examples: [Authentication & Gateway](#authentication--gateway), [API Contracts](./api-contracts.md), and [Sandbox & Postman](./sandbox-postman.md).

## Who should use this

- Bank platform teams integrating channels to FinX Glue
- System integrators extending adapters or onboarding new BIAN Service Domains
- Security teams validating auth flows and API exposure

## What you get

- Standards-based integration via BIAN-aligned Service APIs and evolving Business APIs
- Config-driven adapters to Thought Machine (core and payments), ComplyAdvantage, DocuSign, and MSD/CIF
- Governed schemas and predictable versioning

## How to navigate

- Authentication & Gateway - Identity, OIDC, and routing
- API Contracts - URL schema, versioning, compatibility, and deprecation
- Sandbox & Postman - Environments, sample calls, and test data guidance

## Current vs. target integration paths

- **Current:** integrate to BIAN Service APIs; compose multi-call journeys in the channel
- **Target:** use Business APIs exposed by the Business Abstraction Layer for one-call orchestration (Customer Onboarding, Account Opening)

## References

- FinX Glue - Architecture
- API & Naming Conventions
- Schema Registry & SoP
- FinX Microservices Details
- FinX Installation Manual
- Business Capability Target State

---

# Authentication & Gateway

This section details how your identity systems connect to FinX Glue through Kong and Keycloak and how requests route to BIAN services and downstream adapters.

## Identity and authentication model

- **Gateway:** Kong is the single ingress for all API traffic
- **Authorization server:** Keycloak issues and validates tokens; supports OIDC and User Federation
- **Federation:** Keycloak federates back to your IdP (e.g., Okta, Keycloak, Azure AD) so your users authenticate with your enterprise identity

## High-level flow

1. Client obtains OIDC token from Keycloak (federated to your IdP)
2. Client calls Kong endpoint with Bearer token
3. Kong validates token and routes to the correct BIAN microservice based on path
4. BIAN microservice resolves the target adapter using config (Adapter Config.JSON)
5. Adapter transforms, calls downstream provider, normalizes response

## Headers and routing context

- `tenant_id` - resolves tenant-specific config and routing
- `bian_operation_id` - identifies the BIAN operation (e.g., `CurrentAccount_Initiate`)
- Channel/user context - forwarded in JWT claims and used for authorization

## Environment and network

- Ingress via AWS API Gateway or public DNS fronting Kong
- Private connectivity to downstream systems via VPC links and, where applicable, inter-region VPC peering (e.g., `ap-south-1` to `us-east-1` for Thought Machine)

:::caution
Coordinate with your FinX contact before exposing any production endpoints. Validate token lifetimes, CORS, and rate limits in lower environments first.
:::

## References

- FinX Glue - Architecture
- Installation Manual (networking, API gateway stages, VPC links)

## Changelog

Initial publication on May 4, 2026. Aligns with current state BIAN Service APIs and target state Business Abstraction Layer roadmap.

## Contacts

For access requests and integration reviews, assign an owner such as [Assign Owner] and loop in [Add Engineer] for gateway configuration and [Add Security POC] for OIDC/Keycloak.
