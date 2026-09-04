"""Test configuration and fixtures."""

import asyncio
import os
import sys
from unittest.mock import MagicMock, AsyncMock
from pathlib import Path

import pytest
import pytest_asyncio

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Set test environment
os.environ["APP_ENV"] = "development"
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_SERVICE_KEY"] = "test-key"
os.environ["GEMINI_API_KEY"] = "test-gemini-key"
os.environ["TWILIO_ACCOUNT_SID"] = "test-twilio-sid"
os.environ["TWILIO_AUTH_TOKEN"] = "test-twilio-token"
os.environ["TWILIO_PHONE_NUMBER"] = "+15551234567"
os.environ["TWILIO_WHATSAPP_FROM"] = "whatsapp:+15551234567"
os.environ["GOOGLE_CLOUD_PROJECT"] = "test-project"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./test-credentials.json"
os.environ["OPENWEATHERMAP_API_KEY"] = "test-weather-key"
os.environ["DEBUG"] = "true"


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def mock_db():
    """Create a mock Supabase database client."""
    mock = MagicMock()

    # Mock table operations
    mock_table = MagicMock()
    mock_table.select.return_value = mock_table
    mock_table.insert.return_value = mock_table
    mock_table.update.return_value = mock_table
    mock_table.upsert.return_value = mock_table
    mock_table.eq.return_value = mock_table
    mock_table.gte.return_value = mock_table
    mock_table.lte.return_value = mock_table
    mock_table.ilike.return_value = mock_table
    mock_table.order.return_value = mock_table
    mock_table.limit.return_value = mock_table
    mock_table.execute = AsyncMock(return_value=MagicMock(data=[], count=0))

    mock.table.return_value = mock_table

    # Mock storage
    mock_storage = MagicMock()
    mock_storage.upload.return_value = {"Key": "test-key"}
    mock_storage.get_public_url.return_value = "https://test.com/image.jpg"
    mock.storage.return_value = mock_storage

    return mock


@pytest_asyncio.fixture
async def mock_gemini_service():
    """Create a mock Gemini service."""
    mock = MagicMock()
    mock.generate_voice_advisory.return_value = (
        "टमाटर के पीले पत्तों के लिए नाइट्रोजन युक्त खाद का छिड़काव करें। "
        "मिट्टी की नमी बनाए रखें।"
    )
    mock.analyze_crop_disease = AsyncMock(
        return_value=MagicMock(
            plant_type="Tomato",
            disease_name="Late Blight",
            local_name="झुलसा रोग",
            confidence="high",
            symptoms=["Yellow leaves", "Brown spots"],
            treatment={
                "type": "fungicide",
                "name": "Metalaxyl",
                "dosage": "2g/l",
                "application_method": "Foliar spray",
                "timing": "Every 7-10 days",
            },
            preventive_measures=["Use resistant varieties"],
            resistant_varieties=["Pusa Ruby"],
            economic_impact="Can cause 50% loss if untreated",
        )
    )
    return mock


@pytest.fixture
def sample_farmer_data():
    """Sample farmer data for testing."""
    return {
        "id": "test-farmer-id-123",
        "phone": "+919876543210",
        "name": "Test Farmer",
        "language": "hindi",
        "village": "Test Village",
        "district": "Pune",
        "state": "Maharashtra",
    }


@pytest.fixture
def sample_voice_query():
    """Sample voice query data."""
    return {
        "audio_data": "dGVzdCBhdWRpbyBkYXRh",  # base64 encoded "test audio data"
        "phone": "+919876543210",
        "language": "hindi",
    }
