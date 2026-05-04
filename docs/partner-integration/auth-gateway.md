---
id: auth-gateway
title: Partner Integration Guide
sidebar_label: Partner Integration Guide
---

# Partner Integration Guide

This guide enables external bank engineering teams and SI partners to integrate with FinX Glue for client onboarding and account opening. It focuses on environment access, authentication, gateway routing, API contracts, and self-service testing.

:::tip Related reading
- For internal architecture context, see the [Engineering Architecture Overview](../engineering/architecture-overview).
- For sandbox access and Postman collections, see [Sandbox & Postman](./sandbox-postman).
:::

Use the child pages for hands-on setup and examples: [Authentication & Gateway](#authentication--gateway-1), [API Contracts](./api-contracts), and [Sandbox & Postman](./sandbox-postman).

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

- **Gateway:** Kong is the single ingress for all API traffic (north-south). Provides WAF, caching, API traffic routing with policy-based enforcement, rate limiting, and security policies.
- **Authorization server:** Keycloak issues and validates tokens; supports OIDC and User Federation
- **Federation:** Keycloak federates back to your IdP (e.g., Okta, Keycloak, Azure AD) so your users authenticate with your enterprise identity. Ensures access control remains anchored to the client's own identity infrastructure.
- **Authentication method across services:** Azure AD (except webhook endpoints which are excluded from auth)
- **FinX Glass tokens:** Finx-Glass Keycloak realm issues access tokens (5-min TTL) and refresh tokens (30-min TTL) stored in HttpOnly cookies (PCI-DSS 8.2.8 compliant)

*Source: FinX Glue - Architecture · ADR - Glass - Session Lifecycle Management (PCI-DSS 8.2.8)*

## High-level flow

1. Client environment (including IdP, LDAP directory, Client DB) originates request
2. Request → Kong API Gateway (unified entry point for all traffic)
3. Kong routes to Keycloak (OIDC + User Federation, federating identity back to client's IdP)
4. Authenticated request carries `tenant_id` and `bian_operation_id` (e.g., `CurrentAccount_Initiate`) → BIAN Microservice
5. BIAN microservice consults `Adapter Config.JSON` to resolve the correct `adapter_bian_api_url`
6. Adapter executes pipeline: Read Target Config → Transform Request → Call Target API → Handle Response → Transform Response
7. Response returns through the stack to client

*Source: FinX Glue - Architecture*

## Headers and routing context

- `tenant_id` - resolves tenant-specific config and routing
- `bian_operation_id` - identifies the BIAN operation (e.g., `CurrentAccount_Initiate`)
- Channel/user context - forwarded in JWT claims and used for authorization

## Environment details

| Environment | DB Server | DB Host URL | EKS Cluster |
| --- | --- | --- | --- |
| Dev | finx-celta-db-dev | finx-celta-db-dev.cu58to1elcic.ap-south-1.rds.amazonaws.com | finx-celta-cluster-dev |
| QA | celta-db-qa | celta-db-qa.cu58to1elcic.ap-south-1.rds.amazonaws.com | finx-celta-cluster-qa |
| UAT | celta-db-uat | celta-db-uat.cu58to1elcic.ap-south-1.rds.amazonaws.com | celta-eks-uat |

**Demo Gateway:** `https://finx-demo-api.fincuro.in` (used across all Demo endpoint URLs)

*Source: FinX-Celta Services List · Finx Microservices Details*

## Network topology

- FinX infrastructure in **ap-south-1** (Mumbai)
- Thought Machine endpoints in **us-east-1** (N. Virginia)
- Connected via VPC peering for cross-region access
- Ingress via AWS API Gateway or public DNS fronting Kong
- Private connectivity to downstream systems via VPC links

*Source: FinX-Installation Manual*

:::caution
Coordinate with your FinX contact before exposing any production endpoints. Validate token lifetimes, CORS, and rate limits in lower environments first.
:::

## References

- FinX Glue - Architecture
- Installation Manual (networking, API gateway stages, VPC links)
- ADR - Glass - Session Lifecycle Management (PCI-DSS 8.2.8)

## Changelog

Initial publication on May 4, 2026. Updated May 5, 2026 with verified environment details, auth method, and network topology from source documentation.

## Contacts

For access requests and integration reviews, assign an owner such as [Assign Owner] and loop in [Add Engineer] for gateway configuration and [Add Security POC] for OIDC/Keycloak.
