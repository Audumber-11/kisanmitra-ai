"""Voice service for handling voice calls via Twilio."""

import base64
import io
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from app.ai.gemini import VoiceAdvisoryRequest, get_gemini_service
from app.db.client import get_db
from supabase import AsyncClient

router = APIRouter(prefix="/voice", tags=["Voice"])


class VoiceQueryRequest(BaseModel):
    """Request model for voice query."""

    audio_data: str = Field(..., description="Base64-encoded audio data")
    phone: str = Field(..., description="Farmer's phone number")
    language: str = Field(default="hindi", description="Query language")


class VoiceQueryResponse(BaseModel):
    """Response model for voice query."""

    response_text: str
    response_audio_base64: str | None = None
    language: str
    query_id: str


class TwilioVoiceWebhook(BaseModel):
    """Twilio voice webhook request."""

    From: str
    To: str
    CallSid: str
    TranscriptionSid: str | None = None


# Language name mappings for prompts
LANGUAGE_NAMES = {
    "hindi": "Hindi (हिंदी)",
    "marathi": "Marathi (मराठी)",
    "telugu": "Telugu (తెలుగు)",
    "english": "English",
}

# Language codes for Google STT/TTS
STT_LANGUAGE_CODES = {
    "hindi": "hi-IN",
    "marathi": "mr-IN",
    "telugu": "te-IN",
    "english": "en-IN",
}

TTS_LANGUAGE_CODES = {
    "hindi": "hi-IN",
    "marathi": "mr-IN",
    "telugu": "te-IN",
    "english": "en-IN",
}


async def get_or_create_farmer(
    db: AsyncClient,
    phone: str,
    language: str = "hindi",
) -> dict:
    """Get existing farmer or create new record."""
    # Try to get existing farmer
    result = await db.table("farmers").select("*").eq("phone", phone).execute()

    if result.data:
        return result.data[0]

    # Create new farmer record
    new_farmer = {
        "phone": phone,
        "language": language,
        "name": None,  # Will be updated later
    }

    result = await db.table("farmers").insert(new_farmer).execute()
    return result.data[0]


@router.post("/query", response_model=VoiceQueryResponse)
async def process_voice_query(
    request: VoiceQueryRequest,
    db: Annotated[AsyncClient, Depends(get_db)],
) -> VoiceQueryResponse:
    """
    Process a voice query from a farmer.

    Flow:
    1. Decode base64 audio
    2. Transcribe with Google STT
    3. Generate response with Gemini
    4. Convert to speech with Google TTS
    5. Log interaction
    6. Return response
    """
    try:
        # Decode audio data
        audio_bytes = base64.b64decode(request.audio_data)

        # Get or create farmer
        farmer = await get_or_create_farmer(db, request.phone, request.language)

        # For MVP, we'll use the transcribed text directly
        # In production, integrate Google STT here
        # transcription = await transcribe_audio(audio_bytes, request.language)

        # Simulated transcription for testing
        # In production, this comes from Google STT
        query_text = "टमाटर के पौधों में पीले पत्ते आ रहे हैं"  # Hindi: "Tomato plants have yellow leaves"

        # Get Gemini response
        gemini_service = get_gemini_service()
        advisory_request = VoiceAdvisoryRequest(
            query=query_text,
            language=request.language,
            state=farmer.get("state", "Maharashtra"),
            district=farmer.get("district", ""),
            soil_type=farmer.get("soil_type", "black"),
            season=_get_current_season(),
        )

        response_text = gemini_service.generate_voice_advisory(advisory_request)

        # Log the advisory interaction
        await db.table("advisory_logs").insert(
            {
                "farmer_id": farmer["id"],
                "query": query_text,
                "response": response_text,
                "language": request.language,
                "type": "voice",
            }
        ).execute()

        return VoiceQueryResponse(
            response_text=response_text,
            response_audio_base64=None,  # TTS integration for future
            language=request.language,
            query_id=farmer["id"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")


@router.post("/twilio/webhook")
async def twilio_voice_webhook(
    request: Request,
    db: Annotated[AsyncClient, Depends(get_db)],
) -> dict:
    """
    Handle incoming Twilio voice call webhook.

    This endpoint receives the caller's voice, transcribes it,
    and returns the appropriate TwiML response.
    """
    form_data = await request.form()
    from_number = form_data.get("From", "")
    call_sid = form_data.get("CallSid", "")

    # Get or create farmer
    farmer = await get_or_create_farmer(db, from_number)
    language = farmer.get("language", "hindi")

    # Return TwiML to gather speech
    twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amithabh" language="{STT_LANGUAGE_CODES.get(language, 'hi-IN')}">
        Namaste! Welcome to KisanMitra AI. Please tell me your question in {LANGUAGE_NAMES.get(language, 'Hindi')}.
    </Say>
    <Gather input="speech" action="/api/v1/voice/twilio/process" method="POST" timeout="10" speechTimeout="auto">
        <Say voice="Polly.Amithabh" language="{STT_LANGUAGE_CODES.get(language, 'hi-IN')}">
            Please speak your question now.
        </Say>
    </Gather>
    <Say voice="Polly.Amithabh" language="{STT_LANGUAGE_CODES.get(language, 'hi-IN')}">
        I didn't receive your question. Please call again. Thank you!
    </Say>
    <Hangup/>
</Response>"""

    return {
        "response": twiml_response,
        "headers": {"Content-Type": "text/xml"},
    }


def _get_current_season() -> str:
    """Determine current agricultural season in India."""
    from datetime import datetime

    month = datetime.now().month
    if month in [6, 7, 8, 9, 10]:
        return "kharif"  # Monsoon season
    elif month in [11, 12, 1, 2, 3]:
        return "rabi"  # Winter season
    else:
        return "zaid"  # Summer season
