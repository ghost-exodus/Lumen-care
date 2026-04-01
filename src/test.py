import asyncio
from parser import get_markdown_from_pdf
from extract import extract_insurance_data 

async def run_test():
    # CHANGE THIS to the exact name of the PDF you put in your folder
    test_file_path = "Policy_Wordings_Surrosafe_Health_Insurance.pdf" 
    
    print(f"1. Sending '{test_file_path}' to LlamaCloud for parsing...")
    markdown_text = await get_markdown_from_pdf(test_file_path)
    
    if not markdown_text:
        print("❌ Failed to get markdown. Check your LlamaCloud API key and file path.")
        return

    print("2. Success! Now sending the markdown to Gemini for extraction...")
    final_json = extract_insurance_data(markdown_text)
    
    print("\n🎉 --- FINAL EXTRACTED DATA --- 🎉\n")
    print(final_json)

# This is the trigger that starts the whole process
asyncio.run(run_test())