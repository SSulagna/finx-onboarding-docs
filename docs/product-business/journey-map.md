---
id: journey-map
title: Onboarding Journey Map
sidebar_label: Journey Map
---

# Onboarding Journey Map — Retail Savings Account

The end-to-end retail onboarding journey as defined in the FBSA project. The journey is structured around Feature-level Jira issues (FBSA-4 through FBSA-10), each containing stories and sub-tasks with Figma screens and BIAN API mappings. Steps can be re-ordered or toggled via workflow and UI schema configuration (target state).

---

## Step 1 — Product Selection ✅ MANDATORY

**Jira Feature:** [FBSA-4](https://ustfinx.atlassian.net/browse/FBSA-4) (Work-In-Progress) · **Story:** [FBSA-43](https://ustfinx.atlassian.net/browse/FBSA-43) (Ready for QA)

The customer selects a banking product from the bank's website. For the current scope, only "Savings" → "Basic Savings" is selectable. Other options (Checking, Term Deposit, Loan) are visible but greyed out.

| Field | Mandatory? | Notes |
| --- | --- | --- |
| Product Type | ✅ Yes | Dropdown: Checking, Savings, Term Deposit, Loan. Only "Savings" selectable in current release. Configurable. |
| Product | ✅ Yes | Dropdown dependent on Product Type: Basic Savings, Premium Savings. Only "Basic Savings" selectable. Configurable. |
| Currency | ✅ Yes | Dropdown: CAD, EUR, GBP, INR, USD. Configurable. |
| Intended Use of Account | ✅ Yes | Dropdown: Personal Savings, Emergency Fund, Future Investments, Salary Account, Bill Payments, Saving for a Specific Goal, Minor's/Educational Savings, Others. If "Others" → free-text (100 chars). Configurable. |

Clicking "Enroll Now" navigates to the Application Initiation screen.

No customer information is captured on this screen.

**BIAN Mapping:** FinX Glue internal lookup master APIs for product/account/currency lists.

**MFE:** `finx-fe-cop-home-product-selection`

---

## Step 2 — Application Initiation ("Let's Get Started") ✅ MANDATORY

**Jira Feature:** [FBSA-5](https://ustfinx.atlassian.net/browse/FBSA-5) (Work-In-Progress) · **Story:** [FBSA-46](https://ustfinx.atlassian.net/browse/FBSA-46) (Ready for QA) · **MFE Sub-task:** [FBSA-66](https://ustfinx.atlassian.net/browse/FBSA-66) (Done)

Captures basic contact information and performs de-duplication against existing customer data.

| Field | Mandatory? | Notes |
| --- | --- | --- |
| Email ID | ✅ Yes | Validated via regex. On blur: API call checks if email exists in Customer Master. |
| Phone Number (with country code) | ✅ Yes | Validated: 10 digits. On blur: API call for de-duplication. Patterns configurable. |
| Consent checkbox | ✅ Yes | User must consent before proceeding. |

- **If duplicate found:** Error message — "You seem to be already our customer. Kindly log into your Customer Portal for opening a new account." All messages configurable.
- **If no duplicate:** Application ID is generated and stored in backend. User proceeds to Information Collection.
- **Not in current scope:** OTP/email verification for phone/email validation.

**BIAN Mapping:** PartyReferenceDataDirectory → `/Reference/{referenceid}/Update` for de-duplication check.

**MFE:** `finx-fe-cop-retail-onboarding`

---

## Step 3 — Information Collection ✅ MANDATORY (4 sub-steps)

**Jira Feature:** [FBSA-6](https://ustfinx.atlassian.net/browse/FBSA-6) (Work-In-Progress)

Collects essential customer data through 4 sequential screens:

### Step 3.1 — Personal Details ✅ MANDATORY

**Story:** [FBSA-13](https://ustfinx.atlassian.net/browse/FBSA-13) (Ready for QA) · **MFE:** [FBSA-67](https://ustfinx.atlassian.net/browse/FBSA-67) (Done)

| Field | Mandatory? |
| --- | --- |
| First Name | ✅ Yes |
| Middle Name | ❌ Optional |
| Last Name | ✅ Yes |
| Date of Birth | ✅ Yes — date picker. Format configurable (MM-DD-YYYY or DD-MM-YYYY). All ages allowed. |

**BIAN Mapping:** PartyReferenceDataDirectory → `/Register` (name) and `/Reference/{referenceid}/Update` (DOB).

No API calls on this screen currently — data stored in state.

### Step 3.2 — Identification Details ✅ MANDATORY

**Story:** [FBSA-14](https://ustfinx.atlassian.net/browse/FBSA-14) (Ready for Dev) · **MFE:** [FBSA-68](https://ustfinx.atlassian.net/browse/FBSA-68) (Proposed)

Captures government-issued ID. Acceptable documents configurable — defaults: Passport, Driving License, National ID Card.

| Field | Mandatory? |
| --- | --- |
| ID Type | ✅ Yes |
| ID Number | ✅ Yes |
| Issuing State | ✅ Yes |
| Issue Date | ✅ Yes |
| Expiration Date | ✅ Yes |
| Issuing Authority | ✅ Yes |
| Upload Image | ✅ Yes |

Data sent to Jumio via FinX for IDV validation. Responses cached in Pinia Colada Query for later display.

**BIAN:** PartyReferenceDataDirectory → `/Reference/{referenceid}/Update` + DocumentDirectory/Register + internal S3 upload API.

### Step 3.3 — Contact Information ✅ MANDATORY

**Story:** [FBSA-16](https://ustfinx.atlassian.net/browse/FBSA-16) (Ready for Dev) · **MFE:** [FBSA-69](https://ustfinx.atlassian.net/browse/FBSA-69) (Proposed)

| Field | Mandatory? | Notes |
| --- | --- | --- |
| Email Address | Pre-filled | From Application Initiation screen. Non-editable. |
| Phone Number | Pre-filled | From Application Initiation screen. Non-editable. |
| Primary Address (Line 1, Line 2, City, State, ZIP, Country) | ✅ Yes | ZIP: numeric only. Country: alphabets only. |
| Mailing Address | ❌ Optional | Checkbox "Same as Primary Address". If unchecked → separate entry. |

### Step 3.4 — Address Proof Documentation ✅ MANDATORY

**Story:** [FBSA-71](https://ustfinx.atlassian.net/browse/FBSA-71) (Dev in Progress) · **MFE:** [FBSA-70](https://ustfinx.atlassian.net/browse/FBSA-70) (Done)

Captures a second government-issued document as address proof. Acceptable: Aadhaar Card, Utility Bill, Residence Registration Certificate, Bank Statement. Configurable.

| Field | Mandatory? |
| --- | --- |
| ID Type | ✅ Yes |
| ID Number | ✅ Yes |
| Issuing State | ✅ Yes |
| Issue Date | ✅ Yes |
| Expiration Date | ✅ Yes |
| Issuing Authority | ✅ Yes |
| Upload Image | ✅ Yes |

On each Preview click, data is sent to ComplyAdvantage for KYC screening. Results cached with Pinia Colada; invalidated on field change.

---

## Step 4 — Preview & Submission ✅ MANDATORY

**Story:** [FBSA-72](https://ustfinx.atlassian.net/browse/FBSA-72) (Work-In-Progress)

Read-only summary screen before application submission. Displays:

- Selected account: Account type, Product Name, Currency, Intended use
- Data collection: Personal data, Identification data, Contact data, Address proof
- Mailing address shown if different from primary; otherwise, note "Same as Primary Address"

**BIAN Mapping:** N/A — all data fetched from session cache.

On Submit, triggers Data Validation & Compliance Checks.

---

## Step 5 — Data Validation & Compliance Checks ✅ MANDATORY (backend)

**Jira Feature:** [FBSA-7](https://ustfinx.atlassian.net/browse/FBSA-7) (Proposed) · **Story:** [FBSA-20](https://ustfinx.atlassian.net/browse/FBSA-20) (Ready for Dev)

Backend process — no customer-facing screen. Two parallel checks:

| Check | Provider | Integration | Current Status |
| --- | --- | --- | --- |
| KYC/AML Screening | ComplyAdvantage | Via `finx-amln-fraud-detection-adapter` (ComplyAdvantage Mesh). Screens against OFAC, sanctions lists, PEPs, adverse media. | [FBSA-110](https://ustfinx.atlassian.net/browse/FBSA-110) (Done), [FBSA-124](https://ustfinx.atlassian.net/browse/FBSA-124) (Proposed) |
| ID Verification (IDV) | Jumio | Via Jumio API for document authenticity validation (Passport, Aadhaar, Driving License). | [FBSA-115](https://ustfinx.atlassian.net/browse/FBSA-115) (Done), [FBSA-125](https://ustfinx.atlassian.net/browse/FBSA-125) (Proposed) |

- **If KYC clear** (no matches): Mark as Success → proceed to Application Decision.
- **If KYC matches found:** Configurable error message → mark application as "Failed" → hard stop. ⚠️ Current scope: no manual review flow for matches. HITL escalation ([FBSA-129](https://ustfinx.atlassian.net/browse/FBSA-129)) is NOT in first release scope.
- **If IDV fails:** [FBSA-128](https://ustfinx.atlassian.net/browse/FBSA-128) — operator manual verification. "Not in the first scope."

---

## Step 6 — Application Decision ✅ MANDATORY (automated)

**Jira Feature:** [FBSA-8](https://ustfinx.atlassian.net/browse/FBSA-8) (Proposed) · **Story:** [FBSA-51](https://ustfinx.atlassian.net/browse/FBSA-51) (Work-In-Progress)

Based on KYC + IDV responses:

- **Success:** Internally triggers Customer and Account creation APIs (Step 7). Customer sees "Congratulations" page with Account Number and Customer ID, plus message: "Your welcome kit has been shared with you on your registered email and phone number via SMS."
- **Failure:** Customer sees "Sorry" page → journey ends.

Account Number from: `/CustomerProductandServiceDirectory/{id}/Product/Register`

---

## Step 7 — Customer & Account Creation ✅ MANDATORY (backend)

**Jira Feature:** [FBSA-9](https://ustfinx.atlassian.net/browse/FBSA-9) (Proposed) · **Consent:** [FBSA-326](https://ustfinx.atlassian.net/browse/FBSA-326) (Done)

| Operation | Target System | BIAN Service | API |
| --- | --- | --- | --- |
| Create Customer ID | Thought Machine Vault Core | `finx-celta-tm-party-service` | Create/Search/Update customer |
| Create Account | Thought Machine Vault Core | `finx-celta-tm-account-service` | currentAccount/initiate, retrieve, set identifiers/status |
| Consent Record | Customer Agreement SD | `customer-agreement` | POST /evaluate → POST /policy-terms/evaluate → PUT /update |

Customer ID created in bank backend system → Data creates Account Number in core banking → System displays "account created successfully"

All collected data and verification results stored in backend.

Vault Payments link and instruments applied when applicable (V1/V2/VP variants).

---

## Step 8 — Credential Setup & Account Funding ⚠️ PARTIALLY MANDATORY

**Jira Feature:** [FBSA-10](https://ustfinx.atlassian.net/browse/FBSA-10) (Design Completed) · **Story:** [FBSA-53](https://ustfinx.atlassian.net/browse/FBSA-53) (Blocked)

| Field | Mandatory? | Notes |
| --- | --- | --- |
| Username | Pre-filled | Email ID from "Let's Get Started" screen. Auto-populated. |
| Password | ✅ Yes | Encrypted while typing. Eye icon for show/hide. Moderate password rules. |
| First Deposit Amount | ✅ Yes | No decimal values allowed. Amount handled at time of account creation. |

**BIAN:** Password registration via `IssuedDeviceAdministration/Initiate`; password storage via `PasswordAssignment/{id}/Update`.

:::warning Key Finding on Funding
Per *🗂️Project Plan – Onboarding and Portal Program*: "Payments integration (funding) — N/A as of now it appears. Just a UI screen." There is no payment provider integration for the initial deposit in the current release. The deposit amount is captured on the UI screen and passed to account creation, but no actual payment gateway or bank transfer is executed. This is a UI placeholder for future integration.

**Status:** Blocked — FBSA-53 is currently in "Blocked" status.
:::

---

## Step 9 — Post-Onboarding Provisioning ❌ OPTIONAL / FUTURE

No dedicated Jira Feature. Inferred from project scope:

- **Customer Portal provisioning** — customer accesses accounts, transactions, payments via Customer Portal MFEs.
- **Optional onboarding checklist in Bankers Workbench** — [FBSA-253](https://ustfinx.atlassian.net/browse/FBSA-253) (Proposed) describes an "Applications" section for BWB users to manage applications by status (Approved, Declined, Pending Review).
- Entitlements configured for maker-checker approvals via `finx-celta-entitlement-service` where required.

---

## Summary: Current Page vs. Verified Journey

| Current Page Step | Verified Step Name | Key Differences Found |
| --- | --- | --- |
| "Qualify prospect" | Product Selection (FBSA-4) | Not a "qualification" — it's product/currency/intended-use selection. No eligibility check occurs here. |
| *(missing)* | Application Initiation (FBSA-5) | Missing from current page entirely. This is a distinct screen with de-duplication, consent, and Application ID generation. |
| "Capture identity and profile" | Information Collection (FBSA-6) | Maps to 4 sub-steps: Personal Details (3.1), Identification Details (3.2), Contact Information (3.3), Address Proof Documentation (3.4). Current page merges these into one step. |
| *(missing)* | Preview & Submission (FBSA-72) | Missing from current page. Critical pre-submission review screen. |
| "IDV (optional)" | Part of Data Validation & Compliance Checks (FBSA-7) | IDV and KYC are both backend processes within the same feature. IDV (Jumio) manual review is out of first scope. |
| "KYC/AML screening" | Part of Data Validation & Compliance Checks (FBSA-7) | Correct, but HITL escalation for KYC matches is NOT in first release (FBSA-129 = Proposed, out of scope). |
| *(missing)* | Application Decision (FBSA-8) | Missing from current page. Determines Congratulations vs. Sorry page based on KYC+IDV results. |
| "Account creation" | Customer & Account Creation (FBSA-9) | Correct. Now includes Customer Agreement (consent) APIs (FBSA-326, Done). |
| "Agreement signing" | *(Not in current retail onboarding scope)* | DocuSign is NOT part of the current retail savings onboarding Jira scope. Platform capability exists but no FBSA story connects it. |
| "Funding" | Credential Setup & Account Funding (FBSA-10) | No payment provider integration exists. Per R-003: "Just a UI screen." FBSA-53 is currently Blocked. |

:::info Critical Findings
1. **DocuSign / Agreement Signing** is NOT in the retail onboarding Jira scope. The platform has DocuSign integration, but no FBSA story connects it to the savings onboarding journey.
2. **Funding has no payment provider.** Risk R-003 explicitly says "Just a UI screen." The deposit amount is captured but no payment is processed. FBSA-53 is Blocked.
3. **"Qualify prospect" is actually "Product Selection."** There is no eligibility/qualification check in the current FBSA scope — the first step is product/currency selection, not a prospect eligibility gate. The `finx-qualify-prospect-service-papi` exists in the platform but is not wired into the current retail savings journey per Jira.
:::

---

*Sources: FBSA-1 through FBSA-10 (Features), FBSA-13/14/16/20/43/46/51/53/66-72/110/115/124/125/128/129/253/326 (Stories/Sub-tasks), 🗂️Project Plan – Onboarding and Portal Program, FinX Bank Savings Account E2E Requirements*
