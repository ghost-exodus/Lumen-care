import os
from llama_cloud import AsyncLlamaCloud

async def get_markdown_from_pdf(file_path: str):
    
    client = AsyncLlamaCloud(api_key=os.getenv("LLAMA_CLOUD_API_KEY"))

    with open(file_path, "rb") as f:
        file_obj = await client.files.create(file=f, purpose="parse")

     
    result = await client.parsing.parse(
        file_id=file_obj.id,
        tier="fast",
        expand=["markdown_full"],
        version="latest"
    )

    return result.markdown_full