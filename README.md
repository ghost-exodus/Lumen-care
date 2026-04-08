````markdown
# Intelligent Policy Analyzer

An automated extraction engine that parses complex PDF insurance documents into structured, actionable JSON data.

![Hero Image / App Screenshot Here](placeholder-hero-image.png)

---

## 🧠 Core Capabilities

* **Policy Metrics:** Extracts Grace Periods, Free Look windows, and Claim SLAs.
* **Coverages:** Maps Primary Coverages, Sum Insured limits, and Key Features.
* **Waiting Periods:** Identifies specific medical conditions and their required wait durations.
* **Critical Exclusions:** Isolates scenarios and treatments strictly NOT covered.

---

## ⚙️ System Pipeline

![Architecture/Data Flow Diagram Here](placeholder-architecture-diagram.png)

1. **Ingest:** Upload raw PDF policy documents (up to 10MB).
2. **Process:** Backend parses unstructured text using extraction heuristics.
3. **Output:** Returns a strictly typed JSON schema for frontend/database consumption.

---

## 🔌 API Reference

**Endpoint:** `POST /api/extract`  
**Content-Type:** `multipart/form-data`  
**Payload:** `file` (application/pdf)

### Response Schema

```json
{
  "insurance_company": "String",
  "policy_name": "String",
  "policy_metrics": {
    "grace_period": "String",
    "free_look_period": "String",
    "claim_settlement_time": "String"
  },
  "primary_covers": [
    {
      "cover_name": "String",
      "sum_insured_details": "String",
      "key_features": ["String"]
    }
  ],
  "waiting_periods": [
    {
      "condition": "String",
      "duration": "String"
    }
  ],
  "critical_exclusions": ["String"]
}
````

-----

## 🚀 Quick Start

```bash
git clone [https://github.com/yourusername/intelligent-policy-analyzer.git](https://github.com/yourusername/intelligent-policy-analyzer.git)
cd intelligent-policy-analyzer
npm install
npm run dev
```

*Requires running extraction backend at `http://127.0.0.1:8000`*

-----

## 🛠 Tech Stack

  * **Frontend:** React, Tailwind CSS
  * **Backend Target:** FastAPI / Python

<!-- end list -->

```
```
