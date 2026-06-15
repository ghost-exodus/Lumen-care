# Lumen Care


https://github.com/user-attachments/assets/391f82a7-4405-4b2d-bc17-e1cee3c9bc70






An AI-powered tool that reads health insurance policy documents and converts them into a clear, structured summary of coverage, exclusions, waiting periods, and key policy metrics.

addressing a real and widespread problem: insurance policy documents are long, dense, and written in language that makes it difficult for the average person to understand what they are actually buying.

## The Problem

Health insurance disputes rarely happen at the point of sale. They happen at the point of claim, when a customer discovers that a condition, treatment, or scenario they assumed was covered is explicitly excluded in the policy wording.

This is not always accidental. A policy document can run to fifty or more pages of dense legal and medical terminology, with critical exclusions and waiting periods written in the same tone and format as routine clauses. Marketing materials and insurer websites are not a reliable substitute for the policy document itself, because they are written to highlight selling points rather than to surface limitations. The legal text that actually governs a claim is the policy wording document, not the brochure.

This creates an information asymmetry. The insurer has full clarity on what is and is not covered. The policyholder, in most cases, does not.

## What Lumen Care Does

Lumen Care takes the actual policy wording PDF as input and produces a structured breakdown of the document, including:

- Policy metrics: grace period, free-look period, and claim settlement timeline
- Primary coverages: cover names, sum insured details, and key features
- Waiting periods: specific medical conditions and the duration before they are covered
- Critical exclusions: scenarios and treatments that are explicitly not covered

The output is a strictly typed JSON object, which the frontend renders as a readable dashboard.

This does not replace professional financial or legal advice, and it does not replace reading the policy document. It is a tool to help a person quickly understand what is in front of them, so that informed questions can be asked before a policy is purchased or a claim is filed.

## How It Works

1. A user uploads a policy wording PDF through the frontend.
2. The backend sends the file to LlamaCloud, which parses the PDF into structured markdown.
3. The markdown is passed to Google's Gemini model along with a fixed extraction prompt, which returns a structured JSON object matching a predefined schema.
4. The frontend renders this JSON as a dashboard, separating coverage, exclusions, waiting periods, and policy metrics into distinct, scannable sections.

## Why This Approach

Most insurance comparison tools work from marketing pages, brochures, or insurer-provided summaries. Lumen Care works directly from the policy wording document, which is the binding legal text. This is the deliberate design choice that differentiates it: the source of truth is the contract, not the advertisement.

Separating exclusions and waiting periods into their own dedicated sections, rather than leaving them embedded in dense paragraphs, is intentional. These are the clauses that matter most at claim time and are typically the easiest to miss on a first read.

## Tech Stack

**Frontend**
- Next.js (React)
- Tailwind CSS
- Framer Motion

**Backend**
- Python, FastAPI
- LlamaCloud (PDF to markdown parsing)
- Google Gemini (`gemini-2.5-flash`) for structured data extraction

## API

**Endpoint:** `POST /api/extract`
**Content-Type:** `multipart/form-data`
**Payload:** `file` (PDF)

**Response schema:**

```json
{
  "policy_name": "string",
  "insurance_company": "string",
  "primary_covers": [
    {
      "cover_name": "string",
      "sum_insured_details": "string",
      "key_features": ["string"]
    }
  ],
  "waiting_periods": [
    {
      "condition": "string",
      "duration": "string"
    }
  ],
  "critical_exclusions": ["string"],
  "policy_metrics": {
    "grace_period": "string",
    "free_look_period": "string",
    "claim_settlement_time": "string"
  }
}
```

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A LlamaCloud API key
- A Google Gemini API key

### Backend

```bash
git clone https://github.com/ghost-exodus/Lumen-care.git
cd Lumen-care
pip install -r requirements.txt
```

Create a `.env` file in the project root based on `.env.example`:

```
LLAMA_CLOUD_API_KEY="your_llamacloud_key"
GEMINI_API="your_gemini_key"
```

Run the backend:

```bash
uvicorn src.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and expects the backend to be running at `http://127.0.0.1:8000`.

## Current Status

This is an early-stage MVP . It demonstrates the core pipeline: PDF ingestion, structured extraction, and a readable presentation layer. It is not yet production-ready and has known limitations (see below).

## Known Limitations

- No automated test suite.
- Extraction quality depends entirely on the underlying model's output and is not validated against the schema before being returned to the frontend.
- CORS is currently open to all origins, and the backend URL is hardcoded in the frontend.
- No persistence layer; results exist only for the current session.
- No authentication, rate limiting, or file size enforcement on the API.
- A `requirements.txt` is not yet included in the repository.

## Disclaimer

Lumen Care is an informational tool intended to help users understand the structure and content of their policy documents. It is not a substitute for advice from a licensed insurance advisor, and users should always refer to their official policy document and insurer for final confirmation of coverage.

## License

To be determined.
