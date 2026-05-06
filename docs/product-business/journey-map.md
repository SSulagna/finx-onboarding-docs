---
id: journey-map
title: Onboarding Journey Map
sidebar_label: Journey Map
---

# Onboarding Journey Map

This page walks through the FinX retail savings onboarding journey end to end, from prospect qualification to funded account. For each step, you will find the screen the customer sees, the fields captured, what happens behind the scenes, and how exceptions are handled. Use this as the canonical reference when mapping FinX to a bank's existing onboarding processes.

:::info
Screen references in this page correspond to the FinX Bank Figma design file. Figma links will be added once the file is shared externally. Contact the FinX design team for access.
:::

---

## Step 1: Prospect Qualification

**Module:** Retail Onboarding Portal  
**Screen:** Product Selection (finx-fe-cop-home-product-selection MFE)  
**Triggered after:** Customer clicks "Open Account" on the bank website  
**Configurable:** Yes. All dropdown values (product types, products, currencies, intended uses) are data-driven from FinX Glue internal lookup/master APIs and can be changed without code deployment.

### What the customer sees

The customer lands on the Product Selection screen where they choose the type of account they want to open. In the current release, only "Savings" is selectable as a product type; other options (Checking, Term Deposit, Loan) are visible but greyed out. After selecting Product Type, the customer selects a Product (only "Basic Savings" selectable), a Currency (CAD, EUR, GBP, INR, USD), and an Intended Use of Account from configurable dropdowns. If "Others" is selected for intended use, a free-text field appears (max 100 characters). The "Enroll Now" button remains disabled until all mandatory fields contain valid data. No customer information is captured or sent to any backend API on this screen.

:::caution
The platform-level `finx-qualify-prospect-service-papi` (POST /v1/checkEligibility) exists and determines whether a prospect qualifies to open an account based on country and business type. However, this service is NOT wired into the current FBSA retail savings journey. The first step is product/currency/intended-use selection, not an eligibility gate. The qualify prospect service is used in the corporate onboarding context (Celta Bank).
:::

### Fields captured

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| Select Type of Account | Dropdown | Yes | Values: Savings, Checking, Term Deposit, Loan. Only "Savings" selectable in current release; others greyed out. |
| Select Product | Dropdown (dependent) | Yes | Appears after Product Type selected. Values for Savings: Basic Savings, Premium Savings. Only "Basic Savings" selectable. Depends on Product Type. |
| Select Currency | Dropdown | Yes | Values: CAD, EUR, GBP, INR, USD. |
| Intended Use of Account | Dropdown | Yes | Values: Personal Savings, Emergency Fund, Future Investments, Salary Account, Bill Payments and Day-to-Day Transactions, Saving for a Specific Goal, Minor's Account/Educational Savings, Others. Dependent on Product Type + Product combination. |
| Intended Use (Other) | String | Yes (if "Others" selected) | Max 100 chars. Character set: A-Z, a-z, 0-9, special characters (TBD). Error displayed if >100 chars. |

### Behind the scenes

No external service call is made on this screen. FinX Glue internal lookup/master APIs provide the product, currency, and intended-use lists that populate the dropdowns. The data is fetched at screen load and no customer information is persisted until the next step.

### Exit conditions

- **Pass:** All mandatory fields contain valid data, "Enroll Now" button enables, customer proceeds to Application Initiation (Step 2).
- **Fail (recoverable):** Customer leaves fields empty or selects an unavailable product type. "Enroll Now" remains disabled. Customer can correct selections.
- **Fail (non-recoverable):** N/A. No failure scenario blocks the customer permanently at this step.

---

## Step 2: Personal Details Capture

**Module:** Retail Onboarding Portal  
**Screen:** Application Initiation ("Let's Get Started") + Personal Details (finx-fe-cop-retail-onboarding MFE, Steps 1 and 2.1)  
**Triggered after:** Customer clicks "Enroll Now" on the Product Selection screen  
**Configurable:** Yes. Email and phone validation patterns are configurable. Error messages (including the duplicate customer message) are configurable. Date of Birth format is configurable per country (MM-DD-YYYY or DD-MM-YYYY).

### What the customer sees

The journey proceeds through two screens. First, the Application Initiation screen ("Let's Get Started") where the customer enters their email and mobile number. On blur, each field triggers a de-duplication API call against the existing Customer Master. If a duplicate is found, a popup appears: "You seem to be already our customer. Kindly log into your Customer Portal for opening a new account." If no duplicate is found, an Application ID is generated and the customer proceeds to the Personal Details screen. On the Personal Details screen, the customer enters their name (first, optional middle, last) and date of birth. The "Next" button is enabled when all mandatory fields have valid data.

### Fields captured

**Application Initiation screen:**

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| Email ID | String | Yes | Regex validation (must contain @). On blur: API call to check existence in Customer Master. |
| Mobile Number Country Code | Dropdown | Yes | Select from country code list. |
| Mobile Number | Numeric string | Yes | 10 digits. On blur: API call for de-duplication against Customer Master. |
| Consent Checkbox | Boolean | Yes | Must be checked: "I consent to be contacted at the email id and phone number provided here." |

**Personal Details screen:**

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| First Name | String | Yes | Max 50 chars. Character set: A-Z, a-z, special chars (-, ', \_). Error messages for invalid data. |
| Middle Name | String | No | Same validation rules as First Name. |
| Last Name | String | Yes | Same validation rules as First Name. |
| Date of Birth | Date picker | Yes | All ages allowed. Format: dd/mm/yyyy. Date format configurable (MM-DD-YYYY or DD-MM-YYYY) depending on country. |

### Behind the scenes

On the Application Initiation screen, `finx-customer-onboarding-service-papi` performs a de-duplication check against existing customer data via the PartyReferenceDataDirectory BIAN SD. If no duplicate is found, an Application ID is generated and stored in the backend. On the Personal Details screen, no API calls are made; data is stored in local state (Pinia store). The BIAN mapping is `PartyReferenceDataDirectory/Register` for name fields and `PartyReferenceDataDirectory/:id/Reference/:referenceId/Update` for date of birth.

### Exit conditions

- **Pass:** All mandatory fields valid, no duplicate found. Customer proceeds to Identification Details (Step 3).
- **Fail (recoverable):** Duplicate customer detected. Popup shown with option to log in to existing Customer Portal. Customer can close the popup and correct data.
- **Fail (non-recoverable):** N/A. OTP/email verification is not in current scope.

---

## Step 3: Identity Verification (IDV via Jumio)

**Module:** Retail Onboarding Portal (data capture) + Backend Data Validation (IDV execution)  
**Screen:** Identification Details (Screen 3.2, finx-fe-cop-retail-onboarding MFE) for data capture; IDV runs as a backend process during Step 5 (Data Validation)  
**Triggered after:** Customer submits application on the Preview screen (Screen 4). IDV data is captured on Screen 3.2 but the Jumio check executes at the Data Validation stage.  
**Configurable:** Yes. Acceptable ID document types (Passport, Driving License, National ID Card) are configurable.

### What the customer sees

On the Identification Details screen (Screen 3.2), the customer selects an ID Type from a configurable dropdown (Passport, Driving License, National ID Card), enters the ID Number, Issuing State, Issue Date, Expiration Date, and Issuing Authority, then uploads front and back images of the document (max 2 MB; JPG, PNG, or PDF). A consent checkbox must be checked as a hard prerequisite for Jumio. The customer does not see the IDV results until the Application Decision screen (Step 6 of the journey), where they receive one of four outcomes: verification successful (proceeds to Congratulations page), manual review required ("please wait"), verification rejected (Sorry page), or verification could not be executed.

### Fields captured

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| ID Type | Dropdown | Yes | Values: Passport, Driving License, National ID Card. Hover tooltip shows ID Type information. Acceptable doc types configurable. |
| ID Number | String | Yes | Validation rules pending confirmation from FinX product team. |
| Issuing State | String | Yes | Validation rules pending confirmation from FinX product team. |
| Issue Date | Date picker | Yes | Must not be greater than present date. |
| Expiration Date | Date picker | Yes | Must be greater than Issue Date. |
| Issuing Authority | String | Yes | Validation rules pending confirmation from FinX product team. |
| Upload Document (front + back) | File upload | Yes | Max file size: 2 MB. Accepted types: JPG, PNG, PDF. Error messages for invalid files. |

### Behind the scenes

The IDV adapter executes a fully asynchronous, 10-step processing pipeline after the customer submits the application. The channel has no visibility into the internal steps; it only calls Initiate (to trigger) and Retrieve (to poll for result). The BIAN contract is `POST /PartyLifecycleManagement/:partyLifecycleManagementId/IdentityProofing/Initiate`. The adapter validates user consent immediately, creates a PLM Identity Proofing BQ record, calls the Document Directory to retrieve S3 URLs for front and back images, downloads images from S3, calls the Jumio Account Creation API (Workflow 2, which requires only front and back document images, not face/selfie), uploads both images to Jumio, calls Finalize Workflow, waits approximately 10-15 seconds, then calls Fetch Result to receive the decision block including risk score. The complete Jumio Account API response and Fetch Result response are stored verbatim in InstructionDescription for audit. AssessmentResult is derived from decision.risk.score: 0-30 = PASSED, 31-70 = WARNING, 71-100 = REJECTED, -1 = NOT_EXECUTED.

### Exit conditions

- **Pass:** Risk score 0-30 (PASSED). IDV successful, journey continues to Application Decision with positive outcome.
- **Fail (recoverable):** Risk score 31-70 (WARNING). System displays "Manual Review Required: please wait." However, manual review for IDV failures (FBSA-128) is NOT in first release scope. In the current implementation, if IDV is successful the journey moves forward; if unsuccessful, it does not allow the journey to move forward.
- **Fail (non-recoverable):** Risk score 71-100 (REJECTED) or -1 (NOT_EXECUTED). Journey stops. No documented retry mechanism exists. The PLM page does not describe a re-initiation flow. Escalation to Bankers Workbench for manual IDV verification (FBSA-128) is Proposed but not in first release scope.

---

## Step 4: KYC and AML Screening (ComplyAdvantage)

**Module:** Backend (finx-amln-fraud-detection-adapter)  
**Screen:** No customer-facing screen. Backend process triggered on submission.  
**Triggered after:** Customer clicks Submit on the Preview screen (Screen 4). Additionally, a preliminary screening triggers on each Preview click during Address Proof Documentation (Screen 3.4).  
**Configurable:** Yes. The error message shown to the customer when matches are found is configurable.

### What the customer sees

The customer does not see any screen during KYC/AML screening. This is an entirely backend process. The customer submitted their application on the Preview screen and waits for the Application Decision. If screening passes (no matches, low risk), the journey proceeds silently to Account Creation and the customer sees the Congratulations page. If screening finds matches, the customer sees a configurable error message and the application is marked as "Failed" with a hard stop.

### Fields captured

No fields are captured at this step. The screening uses the full customer profile already collected in previous steps:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| first_name | String (from Step 2) | Yes | Submitted from session data |
| last_name | String (from Step 2) | Yes | Submitted from session data |
| gender | String | Yes | Submitted from session data |
| date_of_birth | Object (day/month/year) | Yes | Submitted from session data |
| country_of_birth | ISO country code | Yes | Submitted from session data |
| nationality | Array of ISO codes | Yes | Submitted from session data |
| address | Array (residential + mailing) | Yes | Submitted from session data |
| contact_information | Object (email, phone) | Yes | Submitted from session data |
| personal_identification | Array (type, number, issuing_country) | Yes | Submitted from session data |

### Behind the scenes

The adapter calls the ComplyAdvantage Mesh API via POST `https://api.mesh.complyadvantage.com/v2/workflows/sync/create-and-screen`, a synchronous workflow that creates a customer record in ComplyAdvantage and screens them in a single call. The workflow executes 5 sequential steps: (1) customer-creation, (2) initial-risk-scoring (computes overall_value and overall_level: LOW-RISK, MEDIUM-RISK, or HIGH-RISK), (3) customer-screening against sanctions/PEP/adverse media (result: NO_PROFILES or PROFILES_FOUND), (4) alerting (generates alerts if matches found), (5) case-creation (creates compliance case if needed, otherwise SKIPPED). The decision logic uses two response fields: overall_level and screening_result. LOW-RISK + NO_PROFILES = APPROVED. LOW-RISK + PROFILES_FOUND = REVIEW_REQUIRED. MEDIUM-RISK (regardless of profiles) = REVIEW_REQUIRED. HIGH-RISK (regardless of profiles) = REJECTED. Three webhook events (CASE_CREATED, CASE_STATE_UPDATED, WORKFLOW_COMPLETED) are subscribed per environment via the adapter's webhook endpoint.

### Exit conditions

- **Pass:** LOW-RISK + NO_PROFILES. KYC response is clear, application marked as Success, journey proceeds to Application Decision and then Account Creation.
- **Fail (recoverable):** In the PLM target-state model, LOW-RISK + PROFILES_FOUND or MEDIUM-RISK would trigger a REVIEW_REQUIRED status with manual compliance review. However, in the current FBSA implementation, any matches result in a hard stop (see non-recoverable below). HITL manual review (FBSA-129) is NOT in first release scope.
- **Fail (non-recoverable):** Any matches found OR MEDIUM-RISK OR HIGH-RISK. Configurable error message displayed. Application marked as "Failed." Journey ends. No manual review flow exists in the first release. Escalation to Bankers Workbench compliance queue (FBSA-129) is Proposed but not implemented.

---

## Step 5: Account Creation (Thought Machine)

**Module:** Backend (finx-celta-tm-party-service, finx-celta-tm-account-service, customer-agreement BIAN SD)  
**Screen:** No customer-facing screen. Backend process.  
**Triggered after:** Application Decision is "Approved" (KYC + IDV both passed)  
**Configurable:** No. The account creation flow (V2 for FBSA retail savings) follows a fixed 4-step sequence. Product parameters (EntitlementOptionSetting) are applied via configuration but the creation sequence itself is not runtime-configurable.

### What the customer sees

The customer does not interact with any screen during account creation. This is an entirely backend operation triggered after the application decision passes. The customer next sees the Application Decision screen (Congratulations page) which displays their newly created Customer ID and Account Number.

### Fields captured

No new fields are captured. Account creation uses data already collected:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| customerReference (Party ID) | UUID | Yes | Generated by finx-celta-tm-party-service from collected customer data |
| productInstanceReference | String | Yes | "finx_current_account" or savings product ID from Product Selection |
| accountCurrency | ISO currency code | Yes | From Product Selection (Step 1) |
| accountStatus | String | Yes | ACCOUNT_STATUS_PENDING (V2 flow) |

### Behind the scenes

Four sequential operations execute: (1) Create Customer (Party) in Thought Machine Vault Core via `finx-celta-tm-party-service` (`POST /Party/Initiate`). (2) Create Account via `finx-celta-tm-account-service`. The FBSA retail savings journey uses the V2 flow: `POST /v2/accounts` with `ACCOUNT_STATUS_PENDING` (parameters empty at initiation), then parameters applied separately via `POST /v1/parameter-values:batchCreate` using the `account_id`, then account activated via `PUT /v2/accounts/:accountId` to change status from PENDING to `ACCOUNT_STATUS_OPEN`. (3) Record Customer Agreement (consent) via 3 sequential API calls: `POST /CustomerAgreement/Evaluate` (creates master consent record), `POST /CustomerAgreement/:customerAgreementId/PolicyTerms/Evaluate` (stores consent value when Application ID and Party ID are created), `PUT /CustomerAgreement/:customerAgreementId/Update` (updates party lifecycle status after successful onboarding). (4) Register in CustomerProductandServiceDirectory. The BIAN Savings Account SD (`finx-glue-savings-account-service`, BIAN v14) routes to `finx-glue-tm-account-adapter-service`.

### Exit conditions

- **Pass:** Customer created in TM, account created with ACCOUNT_STATUS_OPEN, consent recorded, Customer ID and Account Number returned. Journey proceeds to Congratulations page display and Credential Setup (Step 7).
- **Fail (recoverable):** Partial failure after account creation. The V2 flow provides a natural compensation boundary: accounts are created as PENDING and only activated to OPEN after all steps succeed. If a downstream step fails, the account can remain in PENDING status. Specific recovery steps are pending confirmation from the FinX engineering team.
- **Fail (non-recoverable):** Complete account creation failure. No documented Saga compensation flow exists in the current FBSA implementation. Orchestration is hand-coded in microservices. If account creation fails entirely, the journey stops at the Application Decision stage. Escalation path pending confirmation from the FinX engineering team.

---

## Step 6: Agreement Signing (DocuSign)

**Module:** Platform capability (finx-celta-docusign-security)  
**Screen:** Not applicable in current FBSA retail savings scope  
**Triggered after:** Not applicable in current FBSA retail savings scope  
**Configurable:** Not applicable in current FBSA retail savings scope

:::warning
DocuSign e-signature is NOT in the current FBSA retail savings onboarding scope. A Jira search for "docusign" across the entire FBSA project returned zero results. No FBSA Feature, Story, or sub-task wires DocuSign e-signature into the retail savings onboarding flow. The `finx-celta-docusign-security` service exists as a platform-level adapter used in the Celta Bank corporate onboarding context. It handles S3 document storage, MSD document CRUD, and DocuSign template sending/tracking, but only the S3 upload and MSD document CRUD functions are used in the FBSA retail savings journey (for uploading ID and address proof documents in Steps 3.2 and 3.4).
:::

### What the customer sees

This step is not present in the current FBSA retail savings onboarding journey. In the corporate onboarding context where DocuSign is used, the signing happens in DocuSign's external UI (not embedded in FinX). The recipient receives a signing invitation via email from DocuSign, views the document, and signs within the DocuSign interface.

### Fields captured

No customer input fields. The DocuSign integration sends pre-populated documents for signature:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| N/A | N/A | N/A | Not applicable in current FBSA retail savings scope |

### Behind the scenes

The platform capability works as follows (corporate onboarding context, not FBSA retail): (1) `POST /v1/documents/docusign/templates/send` sends a DocuSign template asynchronously. A tracking record is created in `docusign_template_tracking`. (2) DocuSign sends the signing invitation to recipients via email. (3) Recipient signs in DocuSign UI. (4) DocuSign sends a webhook event to an AWS Lambda function (`celta-docusign-s3-demo`) at `https://lx45xb2thh.execute-api.ap-south-1.amazonaws.com/demo/docusign/api/webhook`. The Lambda processes the event and updates the tracking records. (5) Channel polls `GET /v1/documents/docusign/envelopes/status?caseId=:caseId` for envelope signing status. The Customer Agreement consent recording (Step 5, FBSA-326) handles the regulatory consent requirement for retail savings onboarding without DocuSign e-signature.

### Exit conditions

- **Pass:** Not applicable in current FBSA retail savings scope.
- **Fail (recoverable):** Not applicable in current FBSA retail savings scope.
- **Fail (non-recoverable):** Not applicable in current FBSA retail savings scope.

---

## Step 7: Account Funding

**Module:** Retail Onboarding Portal (finx-fe-cop-retail-onboarding MFE)  
**Screen:** Credential Setup and Account Funding (Screen 7)  
**Triggered after:** Account Creation (Step 5) succeeds and Congratulations page is displayed  
**Configurable:** No. Business rules for password validation are TBD. Deposit field validation (numeric, non-zero, positive, max 999,999,999) is fixed.

:::warning
There is NO payment provider integration for account funding in the current FBSA retail savings onboarding. Per the Project Plan Risk Register (R-003): "Payments integration (funding): N/A as of now it appears. Just a UI screen." Impact: High. FBSA-53 has been Blocked/On-Hold since 2025-12-01. The deposit amount is captured on the UI but no actual payment is processed.
:::

### What the customer sees

The customer sees a screen with three fields: a pre-populated, non-editable Username (their email from Step 2), a Password field (encrypted while typing by default, with an eye icon for show/hide and a hover tooltip showing password requirements), and a "Make Your First Deposit" numeric field. The currency selected in Product Selection (Step 1) is displayed alongside the deposit field. The "Preview" button is enabled only after valid Password and First Deposit values are entered. The "Back" button is always enabled. Once the customer clicks "Done" after submission, they cannot return to the previous screen, even through the browser.

### Fields captured

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| Username | String (display only) | N/A | Auto-populated with Email ID from Step 2. Non-editable. |
| Password | String (masked) | Yes | Encrypted while typing by default. Eye icon for show/hide. Moderate password rules (business rules TBD). Hover tooltip shows password requirements. Error messages for invalid password. |
| Make Your First Deposit | Numeric | Yes | Numeric, non-zero, positive only. No decimals allowed. Max value: 999,999,999. Display with comma separation in US format. |

### Behind the scenes

Password registration is handled via `IssuedDeviceAdministration/Initiate` (registers the password) and `IssuedDeviceAdministration/:issuedDeviceAdministrationId/PasswordAssignment/:passwordAssignmentId/Update` (stores the password). For the deposit amount, the BIAN mapping table in FBSA-53 leaves the SD and endpoint columns blank with the remark: "Amount will be handled at the time of account creation." No payment gateway, bank transfer, ACH integration, or fund movement is executed. The platform has technical capability to execute postings (`finx-celta-tm-postings-service`, `POST /v1/posting-instruction-batches`) and payments (`finx-celta-tm-vaultpayment-service`), but these are not wired into the FBSA onboarding flow for initial deposits.

### Exit conditions

- **Pass:** Valid password and deposit amount entered. "Preview" button enables. Customer proceeds to final confirmation. No actual payment is processed in the current release.
- **Fail (recoverable):** Invalid password (business rule violation) or invalid deposit (0, negative, decimal, >999,999,999). Error messages displayed. "Preview" button remains disabled. Customer can correct values.
- **Fail (non-recoverable):** N/A in current implementation (since no actual payment is processed, there is no payment failure scenario). If payment provider integration is added in the future, posting rejection by TM (insufficient GL balance, invalid account status, smart contract validation failure) would constitute a non-recoverable failure requiring escalation to Bankers Workbench.

---

## Saga Compensation and Error Recovery

The FBSA retail savings onboarding journey currently uses hand-coded orchestration in microservices. Per the FinX Glue Testing Requirements: "We are currently not using Conductor OSS for orchestration, we are handcoding it in the microservices." No formal Saga patterns or compensation logic are implemented in the current release.

The sequential design of the current journey inherently prevents the most dangerous compensation scenarios. KYC/AML screening (Step 4) and IDV (Step 3) both run BEFORE account creation (Step 5). If either fails, the journey stops at the Application Decision stage and account creation never occurs. This means the scenario "KYC fails after an account has already been created in Thought Machine" cannot occur in the current implementation.

**Current error handling:**

- Errors in any orchestration step propagate correctly with context preserved (error response includes step context, correlation ID, and error code).
- Partial failures return an explicit error indicating incomplete state. No silent success on partial completion.
- The V2 account creation flow provides a natural compensation boundary: accounts are created with ACCOUNT_STATUS_PENDING and only activated to ACCOUNT_STATUS_OPEN after all subsequent steps succeed. If any step fails after account creation, the account can remain in PENDING status.

**Target-state architecture (documented but NOT implemented):**

- Conductor OSS Saga/compensation patterns with pre-built reversible and irreversible compensation templates
- Embedded checkpointing, undo logic, fallback routing, and state recovery
- HITL workflows for manual intervention when automated compensation is insufficient
- Centralized audit trail of compensations and recovery actions
- Configurable compensation and escalation rules at workflow level
- SRS requirements REQ-PROC-301 through REQ-PROC-304 define the formal Saga requirements

**Party Lifecycle Management as state anchor:** The PLM specification provides lifecycle phases, status tracking (In Progress, Completed, Failed), and the explicit pattern "close lifecycle only when ALL downstream service domains succeed." This is a Saga commit model waiting for a Conductor orchestrator to drive it.

---

## Configurability Reference

| Step | Workflow Configurable | Screen Configurable | Rules Configurable |
| --- | --- | --- | --- |
| Step 1: Prospect Qualification | No. Fixed as first step in journey. | Yes. All dropdown values (product types, products, currencies, intended uses) are data-driven from master APIs. | N/A. No business rules evaluated at this step. |
| Step 2: Personal Details Capture | No. Fixed sequence (Application Initiation then Personal Details). | Yes. Email/phone validation patterns configurable. Error messages configurable. DOB format configurable per country. | No. De-duplication logic is fixed (check Customer Master). |
| Step 3: Identity Verification | No. IDV always runs as part of Data Validation. | Yes. Acceptable ID document types configurable (Passport, Driving License, National ID Card). | No. Risk score thresholds (0-30/31-70/71-100) are defined in the PLM spec, not externalized to a rules engine. |
| Step 4: KYC and AML Screening | No. KYC always runs as part of Data Validation. | Yes. KYC failure error message is configurable. Acceptable address proof document types configurable. | No. Decision logic is a 6-scenario lookup table (risk level x screening result) defined in the PLM Qualification spec. Rules engine externalization is target state. |
| Step 5: Account Creation | No. Fixed 4-step V2 sequence (create PENDING, apply parameters, activate). | No. Backend-only, no customer-facing screen. | No. Account creation parameters applied via EntitlementOptionSetting but the creation flow itself is fixed. |
| Step 6: Agreement Signing | N/A. Not in current FBSA retail savings scope. | N/A. | N/A. |
| Step 7: Account Funding | No. Fixed as final step. | No. Password rules TBD. Deposit validation rules are fixed (numeric, non-zero, positive, max 999,999,999). | No. No payment processing rules exist (no payment provider integrated). |

---

## Related Pages

- [Module Overview](./module-overview)
- [Compliance & KYC Touchpoints](./compliance-kyc)
- [Engineering Architecture Overview](../engineering/architecture-overview)

:::caution
Work in progress. Field-level details and screenshots will be expanded as each step is verified with the FinX product team.
:::
