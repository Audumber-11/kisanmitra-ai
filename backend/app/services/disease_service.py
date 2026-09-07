"""Crop disease detection service using Gemini Vision."""

from typing import Annotated

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.ai.gemini import CropDiseaseResponse, get_gemini_service
from app.db.client import get_db
from supabase import AsyncClient

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


class DiseaseAnalysisRequest(BaseModel):
    """Request model for disease analysis."""

    phone: str
    image_url: str | None = None


class DiseaseAnalysisResponse(BaseModel):
    """Response model for disease analysis."""

    success: bool
    data: CropDiseaseResponse | None = None
    error: str | None = None
    query_id: str | None = None


async def get_or_create_farmer(
    db: AsyncClient,
    phone: str,
    language: str = "hindi",
) -> dict:
    """Get existing farmer or create new record."""
    result = await db.table("farmers").select("*").eq("phone", phone).execute()

    if result.data:
        return result.data[0]

    new_farmer = {
        "phone": phone,
        "language": language,
        "name": None,
    }

    result = await db.table("farmers").insert(new_farmer).execute()
    return result.data[0]


@router.post("/analyze", response_model=DiseaseAnalysisResponse)
async def analyze_crop_disease(
    phone: str,
    file: UploadFile = File(...),
    db: Annotated[AsyncClient, Depends(get_db)] = None,
) -> DiseaseAnalysisResponse:
    """
    Analyze crop disease from uploaded image.

    Flow:
    1. Validate image format
    2. Get or create farmer record
    3. Upload image to Supabase Storage
    4. Analyze with Gemini Vision
    5. Log interaction
    6. Return diagnosis
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )

    try:
        # Read file content
        content = await file.read()

        if len(content) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

        # Get or create farmer
        farmer = await get_or_create_farmer(db, phone)

        # Upload to Supabase Storage
        file_name = f"disease-images/{farmer['id']}/{file.filename}"
        storage = db.storage()
        storage.upload(file_name, content, {"content-type": file.content_type})

        # Get public URL
        image_url = storage.get_public_url(file_name)

        # Analyze with Gemini Vision
        gemini_service = get_gemini_service()
        analysis = await gemini_service.analyze_crop_disease(
            image_data=content,
            mime_type=file.content_type,
        )

        # Log the interaction
        await db.table("advisory_logs").insert(
            {
                "farmer_id": farmer["id"],
                "query": f"Image analysis: {file.filename}",
                "response": analysis.model_dump_json(),
                "language": farmer.get("language", "hindi"),
                "type": "image",
            }
        ).execute()

        return DiseaseAnalysisResponse(
            success=True,
            data=analysis,
            query_id=farmer["id"],
        )

    except HTTPException:
        raise
    except Exception as e:
        return DiseaseAnalysisResponse(
            success=False,
            error=str(e),
        )


@router.get("/history/{farmer_id}")
async def get_disease_history(
    farmer_id: str,
    db: Annotated[AsyncClient, Depends(get_db)],
    limit: int = 10,
) -> list[dict]:
    """Get disease analysis history for a farmer."""
    result = (
        await db.table("advisory_logs")
        .select("*")
        .eq("farmer_id", farmer_id)
        .eq("type", "image")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


@router.get("/common-diseases")
async def get_common_diseases(
    db: Annotated[AsyncClient, Depends(get_db)],
    crop_name: str | None = None,
) -> list[dict]:
    """Get common diseases database."""
    query = db.table("crop_diseases").select("*")

    if crop_name:
        query = query.ilike("crop_name", f"%{crop_name}%")

    result = query.execute()
    return result.data
