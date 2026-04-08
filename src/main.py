from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from dotenv import load_dotenv

# Load the secrets BEFORE importing our custom files
load_dotenv()
# Import the custom functions you just built!
from src.parser import get_markdown_from_pdf
from src.extract import extract_insurance_data

app = FastAPI()

# --- CORS CONFIGURATION (Security boilerplate) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For the MVP, we allow any frontend to connect
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUIREMENT 1: Define the Endpoint Route
@app.post("/api/extract")
async def process_insurance_document(file: UploadFile = File("C:\code\RAG")):
    
    # Save the uploaded file temporarily so LlamaParse can read it
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # REQUIREMENT 2: Parse the PDF
        markdown_text = await get_markdown_from_pdf(temp_file_path)

        # REQUIREMENT 3: Extract the Data
        extracted_json = extract_insurance_data(markdown_text)

        # REQUIREMENT 4: Return the Data
        return extracted_json

    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)