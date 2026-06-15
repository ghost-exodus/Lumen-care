import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

# 1. Define the structural contract using Pydantic
class PrimaryCoverage(BaseModel):
    cover_name: str = Field(description="Name of the insurance coverage option")
    description: str = Field(description="Brief description of what is covered")

class WaitingPeriod(BaseModel):
    condition: str = Field(description="The medical condition or category")
    duration_months: int = Field(description="The waiting period duration in months")

class PolicyMetrics(BaseModel):
    grace_period: str
    free_look_period: str
    claim_settlement_time: str

class InsurancePolicySchema(BaseModel):
    policy_name: str
    insurance_company: str
    primary_covers: List[PrimaryCoverage]
    waiting_periods: List[WaitingPeriod]
    critical_exclusions: List[str]
    policy_metrics: PolicyMetrics

# 2. Extract function enforcing the schema
def extract_insurance_data(markdown_text: str):
    client = genai.Client(api_key=os.getenv("GEMINI_API"))

    with open("prompt.txt", "r") as f:
        system_prompt = f.read()

    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=markdown_text, 
        config=types.GenerateContentConfig(
            system_instruction=system_prompt, 
            response_mime_type="application/json",
            # This forces Gemini to follow your Pydantic schema exactly:
            response_schema=InsurancePolicySchema, 
        )
    )

    # response.text is guaranteed to be clean JSON matching InsurancePolicySchema
    return json.loads(response.text)