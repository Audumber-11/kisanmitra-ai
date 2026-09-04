"""Gemini AI service for chat and vision capabilities."""

import json
from typing import Annotated, Any

import google.generativeai as genai
from google.generativeai import GenerationConfig, HarmBlockThreshold, HarmCategory
from pydantic import BaseModel, Field

from app.core.config import get_settings


# Gemini Prompt Templates
VOICE_ADVISORY_PROMPT = """You are KisanMitra AI, an expert agricultural advisor for Indian farmers.

A farmer from {state} asked in {language}: "{query}"

Respond as an expert farmer advisor:
- Use simple, practical language the farmer can understand
- Provide specific actions (fertilizers, seeds, timing)
- Include local relevance where possible
- Be concise (2-3 sentences max for voice response)
- If unsure, say: "Let me check with our agricultural experts in {district}"

Context:
- Farmer's location: {district}, {state}
- Current season: {season}
- Soil type: {soil_type}

IMPORTANT: Respond ONLY in {language}. Do not mix languages.
"""

CROP_DISEASE_PROMPT = """Analyze this crop disease image and respond ONLY with valid JSON:

{{
  "plant_type": "Name of the crop/plant",
  "disease_name": "Scientific name of the disease",
  "local_name": "Local/Hindi name if known",
  "confidence": "high/medium/low",
  "symptoms": ["symptom 1", "symptom 2"],
  "treatment": {{
    "type": "fungicide/insecticide/nematicide/organic",
    "name": "Specific product or treatment name",
    "dosage": "e.g., 2g per liter water",
    "application_method": "How to apply",
    "timing": "When to apply"
  }},
  "preventive_measures": ["measure 1", "measure 2"],
  "resistant_varieties": ["variety 1", "variety 2"],
  "economic_impact": "Brief note on potential losses if untreated"
}}

Be confident if diagnosis is clear. If uncertain, set confidence to "low" and list top 2 possibilities.
"""

REGENERATIVE_FARMING_PROMPT = """You are KisanMitra AI, a regenerative agriculture expert for Indian farming conditions.

Farmer details:
- Location: {district}, {state}
- Current crop: {current_crop}
- Soil type: {soil_type}
- Farm size: {farm_size} hectares
- Current season: {season}

Provide regenerative farming recommendations:
1. Cover crops suitable for the region
2. Crop rotation plan (next 3 seasons)
3. Bio-fertilizers and organic amendments
4. Reduced tillage practices
5. Estimated carbon sequestration potential

Format as structured advice in {language}, practical for small/marginal farmers.
"""


class VoiceAdvisoryRequest(BaseModel):
    """Request model for voice advisory."""

    query: str = Field(..., min_length=1, max_length=1000)
    language: Literal["hindi", "marathi", "telugu", "english"] = "hindi"
    state: str = "Maharashtra"
    district: str = ""
    soil_type: str = "black"
    season: str = "kharif"


class CropDiseaseResponse(BaseModel):
    """Response model for crop disease analysis."""

    plant_type: str
    disease_name: str
    local_name: str | None = None
    confidence: Literal["high", "medium", "low"]
    symptoms: list[str]
    treatment: dict[str, Any]
    preventive_measures: list[str]
    resistant_varieties: list[str]
    economic_impact: str | None = None


class GeminiService:
    """Service class for Gemini AI operations."""

    def __init__(self) -> None:
        """Initialize Gemini service with API key."""
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.vision_model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_voice_advisory(
        self,
        request: VoiceAdvisoryRequest,
    ) -> str:
        """Generate voice advisory response using Gemini Pro."""
        prompt = VOICE_ADVISORY_PROMPT.format(
            query=request.query,
            language=request.language,
            state=request.state,
            district=request.district or "your area",
            soil_type=request.soil_type,
            season=request.season,
        )

        generation_config = GenerationConfig(
            temperature=0.7,
            max_output_tokens=500,
            top_p=0.9,
            top_k=40,
        )

        # Safety settings for agricultural content
        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

        response = self.model.generate_content(
            contents=[{"parts": [{"text": prompt}]}],
            generation_config=generation_config,
            safety_settings=safety_settings,
        )

        return response.text

    async def analyze_crop_disease(
        self,
        image_data: bytes,
        mime_type: str = "image/jpeg",
    ) -> CropDiseaseResponse:
        """Analyze crop disease from image using Gemini Vision."""
        generation_config = GenerationConfig(
            temperature=0.1,
            max_output_tokens=1024,
            response_mime_type="application/json",
        )

        image_part = {
            "mime_type": mime_type,
            "data": image_data.decode("latin-1") if isinstance(image_data, bytes) else image_data,
        }

        response = self.vision_model.generate_content(
            contents=[
                {
                    "parts": [
                        {"text": CROP_DISEASE_PROMPT},
                        {"inline_data": image_part},
                    ]
                }
            ],
            generation_config=generation_config,
        )

        # Parse JSON response
        try:
            result = json.loads(response.text)
            return CropDiseaseResponse(**result)
        except (json.JSONDecodeError, ValueError) as e:
            # Return error response if parsing fails
            return CropDiseaseResponse(
                plant_type="Unknown",
                disease_name="Unable to analyze",
                local_name=None,
                confidence="low",
                symptoms=["Could not determine symptoms"],
                treatment={
                    "type": "unknown",
                    "name": "Consult local agricultural office",
                    "dosage": "N/A",
                    "application_method": "N/A",
                    "timing": "N/A",
                },
                preventive_measures=["Send a clearer image"],
                resistant_varieties=[],
                economic_impact=f"Analysis failed: {str(e)}",
            )

    def generate_regenerative_advice(
        self,
        language: str,
        state: str,
        district: str,
        current_crop: str,
        soil_type: str,
        farm_size: float,
        season: str,
    ) -> str:
        """Generate regenerative farming advice."""
        prompt = REGENERATIVE_FARMING_PROMPT.format(
            language=language,
            state=state,
            district=district,
            current_crop=current_crop,
            soil_type=soil_type,
            farm_size=farm_size,
            season=season,
        )

        generation_config = GenerationConfig(
            temperature=0.7,
            max_output_tokens=1500,
        )

        response = self.model.generate_content(
            contents=[{"parts": [{"text": prompt}]}],
            generation_config=generation_config,
        )

        return response.text


# Singleton instance
_gemini_service: GeminiService | None = None


def get_gemini_service() -> GeminiService:
    """Get or create the Gemini service singleton."""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service


from typing import Literal  # noqa: E402, F401
