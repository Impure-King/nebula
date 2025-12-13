from fastapi import APIRouter, File, UploadFile, HTTPException
import os
from mistralai import Mistral
import base64

router = APIRouter(prefix="/ocr", tags=["ocr"])

@router.post("/extract")
async def extract_text_from_image(file: UploadFile = File(...)):
    """
    Extract text/markdown from an uploaded image using Mistral OCR.
    """
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="MISTRAL_API_KEY is not configured")

    try:
        # Read the file content
        contents = await file.read()
        
        # Encode to base64
        base64_image = base64.b64encode(contents).decode("utf-8")
        
        client = Mistral(api_key=api_key)
        
        # Call Mistral API
        ocr_response = await client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{base64_image}"
            },
            include_image_base64=False
        )
        
        # Extract markdown from the response
        # Note: Adjust extraction logic based on actual Mistral OCR response structure
        # Assuming the response has a 'pages' list with 'markdown' content
        markdown_content = ""
        if ocr_response.pages:
            for page in ocr_response.pages:
                markdown_content += page.markdown + "\n\n"
        
        return {"markdown": markdown_content.strip()}

    except Exception as e:
        print(f"OCR Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
