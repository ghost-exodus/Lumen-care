import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load the environment
load_dotenv()

# NOTICE: The global 'client = ...' line is GONE from here!

def extract_insurance_data(markdown_text: str):
    
    # Python won't execute this line until the function is actually called by the server
    client = genai.Client(api_key=os.getenv("GEMINI_API"))

    # (Note: Double check if this needs to be "src/prompt.txt" depending on where you saved it!)
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