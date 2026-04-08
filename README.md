

```markdown
# Intelligent Policy Analyzer

The **Intelligent Policy Analyzer** is an automated extraction engine designed to ingest complex insurance policy documents (PDFs) and instantly parse them into structured, actionable data. 

Insurance documents are notoriously dense, filled with jargon, and structurally complex. This software bridges the gap between raw legal text and clear, accessible insights by automatically isolating the exact metrics, coverages, and exclusions that matter most to users and analysts.

---

## 🧠 Core Analytical Capabilities

The engine is built to scan uploaded PDFs and intelligently extract data across four critical domains:

1. **Top-Level Policy Metrics**
   * **Grace Periods:** Identifies the exact timeframe allowed for late payments.
   * **Free Look Periods:** Extracts the trial window during which a policy can be canceled without penalty.
   * **Claim Settlement SLAs:** Pinpoints the stated turnaround time for claim processing.

2. **Coverage Architecture**
   * Breaks down the policy into its **Primary Coverages** (e.g., Inpatient Care, Daycare Procedures).
   * Extracts the specific **Sum Insured** details for each coverage bucket.
   * Summarizes the **Key Features** and limits associated with each primary coverage area.

3. **Temporal Restrictions (Waiting Periods)**
   * Identifies specific medical conditions or scenarios that are subject to waiting periods.
   * Extracts the exact duration (e.g., "24 months," "30 days") required before coverage activates for those specific conditions.

4. **Risk Identification (Critical Exclusions)**
   * Isolates the "Danger Zones" of the policy.
   * Compiles a clear, bulleted list of scenarios, conditions, or treatments that are strictly **not covered** under the policy terms, preventing unexpected out-of-pocket expenses.

---

## ⚙️ How It Works (The Pipeline)

1. **Document Ingestion:** The system accepts raw PDF policy documents (up to 10MB) via a streamlined interface.
2. **Payload Transmission:** The file is packaged as `FormData` and securely transmitted to the backend extraction API.
3. **Intelligent Parsing:** The backend processes the unstructured PDF text, utilizing extraction logic to identify patterns, clauses, and key-value pairs associated with insurance terminology.
4. **Structured Output:** The system returns a clean, standardized JSON object mapping the complex document into a strictly typed data schema.

---

## 🔌 API Reference & Data Schema

The software relies on a core backend endpoint to perform the heavy lifting. 

**Endpoint:** `POST /api/extract`  
**Content-Type:** `multipart/form-data`  
**Payload:** `file` (application/pdf)

### Expected JSON Response
The extraction engine guarantees the following structured output, which can be easily consumed by any frontend, database, or downstream analytics tool:

```json
{
  "insurance_company": "String (e.g., 'HealthGuard Inc.')",
  "policy_name": "String (e.g., 'Comprehensive Care Plus')",
  "policy_metrics": {
    "grace_period": "String",
    "free_look_period": "String",
    "claim_settlement_time": "String"
  },
  "primary_covers": [
    {
      "cover_name": "String",
      "sum_insured_details": "String",
      "key_features": [
        "String",
        "String"
      ]
    }
  ],
  "waiting_periods": [
    {
      "condition": "String",
      "duration": "String"
    }
  ],
  "critical_exclusions": [
    "String",
    "String"
  ]
}
```

---

## 🚀 Getting Started

While the core value is in the extraction backend, a lightweight React client is provided to interact with the API immediately.

### Prerequisites
* Node.js (v18+)
* A running instance of the Extraction Backend (default: `http://127.0.0.1:8000`)

### Installation & Execution

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/intelligent-policy-analyzer.git](https://github.com/yourusername/intelligent-policy-analyzer.git)
   cd intelligent-policy-analyzer
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Navigate to `http://localhost:3000`, upload a sample policy PDF, and view the extraction results.

---

## 🛠 Tech Stack

* **Frontend:** React, Tailwind CSS (for minimal, clean data presentation)
* **Backend Target:** FastAPI / Python (Expected backend for handling PDF parsing and extraction)
```
