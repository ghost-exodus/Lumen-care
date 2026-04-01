import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API"))

def extract_insurance_data(markdown_text: str):
    
    with open("prompt.txt", "r") as f:
        system_prompt = f.read()

    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=markdown_text, 
        config=types.GenerateContentConfig(
            system_instruction=system_prompt, 
            response_mime_type="application/json"
        )
    )

    final_data = json.loads(response.text)
    return final_data