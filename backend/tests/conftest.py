"""Pytest configuration with lightweight mocks for test environment."""
import json
import pytest
import sys
import types
from unittest.mock import MagicMock, AsyncMock
# This avoids needing the full google-generativeai package (which requires grpcio,
# incompatible with Python 3.15 beta).

google_module = types.ModuleType("google")
google_module.__path__ = []
sys.modules["google"] = google_module

genai_module = types.ModuleType("google.generativeai")
sys.modules["google.generativeai"] = genai_module


class _HarmCategory:
    HARM_CATEGORY_HARASSMENT = "HARASSMENT"
    HARM_CATEGORY_HATE_SPEECH = "HATE_SPEECH"
    HARM_CATEGORY_SEXUALLY_EXPLICIT = "SEXUALLY_EXPLICIT"
    HARM_CATEGORY_DANGEROUS_CONTENT = "DANGEROUS_CONTENT"


class _HarmBlockThreshold:
    BLOCK_NONE = "BLOCK_NONE"
    BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH"
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE"
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE"


class _GenerationConfig:
    def __init__(self, **kwargs):
        self.kwargs = kwargs


class _GenerativeModel:
    def __init__(self, name):
        self.name = name
        self.generate_content_called = False
        self.last_prompt = None

    async def generate_content(self, contents=None, generation_config=None, safety_settings=None):
        self.generate_content_called = True
        self.last_prompt = contents
        mock_response = types.SimpleNamespace()
        mock_response.text = '{"plant_type": "Test Plant", "disease_name": "Test Disease", "local_name": null, "confidence": "high", "symptoms": ["Test symptom"], "treatment": {"type": "test", "name": "Test treatment", "dosage": "1ml", "application_method": "apply", "timing": "now"}, "preventive_measures": ["test measure"], "resistant_varieties": [], "economic_impact": null}'
        return mock_response


def _configure(api_key=None):
    pass


# Wire up the mock at module level so imports work immediately
genai_module.HarmCategory = _HarmCategory
genai_module.HarmBlockThreshold = _HarmBlockThreshold
genai_module.GenerationConfig = _GenerationConfig
genai_module.GenerativeModel = _GenerativeModel
genai_module.configure = _configure


# --- Supabase mock ---
supabase_module = types.ModuleType("supabase")
supabase_module.__path__ = []
sys.modules["supabase"] = supabase_module

supabase_client_module = types.ModuleType("supabase.client")
sys.modules["supabase.client"] = supabase_client_module

supabase_async_module = types.ModuleType("supabase.async_client")
sys.modules["supabase.async_client"] = supabase_async_module


class _AsyncClient:
    def __init__(self, *args, **kwargs):
        pass

    def table(self, name):
        return _TableMock(name)

    def close(self):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


class _TableMock:
    def __init__(self, name):
        self.name = name
        self._select = None
        self._eq = None
        self._upsert = None

    def select(self, *args, **kwargs):
        self._select = args[0] if args else "*"
        return self

    def eq(self, *args, **kwargs):
        self._eq = args
        return self

    def upsert(self, *args, **kwargs):
        self._upsert = args
        return _UpsertMock(args)

    async def execute(self):
        mock_result = types.SimpleNamespace()
        mock_result.data = [{}]
        return mock_result


class _UpsertMock:
    def __init__(self, args):
        self.args = args

    def execute(self):
        mock_result = types.SimpleNamespace()
        mock_result.data = [{}]
        return mock_result


class _ClientMock:
    @staticmethod
    def create_client(url, key):
        return _AsyncClient()

    @staticmethod
    def create_async_client(url, key):
        return _AsyncClient()


supabase_module.Client = _ClientMock
supabase_module.create_client = _ClientMock.create_client
supabase_module.AsyncClient = _AsyncClient

supabase_client_module.Client = _ClientMock
supabase_client_module.create_client = _ClientMock.create_client
supabase_async_module.AsyncClient = _AsyncClient
supabase_async_module.create_async_client = _ClientMock.create_async_client

# Mock redis module too
redis_module = types.ModuleType("redis")
redis_module.__path__ = []
sys.modules["redis"] = redis_module

redis_async_module = types.ModuleType("redis.asyncio")
sys.modules["redis.asyncio"] = redis_async_module

class _RedisMock:
    def __init__(self, *args, **kwargs):
        pass

redis_async_module.Redis = _RedisMock
redis_module.asyncio = redis_async_module

# Mock sentry_sdk
sentry_module = types.ModuleType("sentry_sdk")
sentry_module.__path__ = []
sys.modules["sentry_sdk"] = sentry_module

sentry_fastapi_module = types.ModuleType("sentry_sdk.integrations.fastapi")
sys.modules["sentry_sdk.integrations.fastapi"] = sentry_fastapi_module

class _SentryFastAPI:
    def __init__(self, app=None):
        pass

sentry_fastapi_module.SentryAsgiMiddleware = _SentryFastAPI
sentry_module.init = lambda *args, **kwargs: None

# Mock celery
celery_module = types.ModuleType("celery")
celery_module.__path__ = []
sys.modules["celery"] = celery_module
celery_module.Celery = lambda *args, **kwargs: types.SimpleNamespace(conf=types.SimpleNamespace(updates={}), config_from_object=lambda *a, **k: None, task=lambda f: f)

# Mock google cloud speech and texttospeech
google_cloud_module = types.ModuleType("google.cloud")
google_cloud_module.__path__ = []
sys.modules["google.cloud"] = google_cloud_module

speech_module = types.ModuleType("google.cloud.speech")
speech_module.__path__ = []
sys.modules["google.cloud.speech"] = speech_module

tts_module = types.ModuleType("google.cloud.texttospeech")
tts_module.__path__ = []
sys.modules["google.cloud.texttospeech"] = tts_module

# Mock twilio
twilio_module = types.ModuleType("twilio")
twilio_module.__path__ = []
sys.modules["twilio"] = twilio_module

twilio_rest_module = types.ModuleType("twilio.rest")
sys.modules["twilio.rest"] = twilio_rest_module

class _TwilioClient:
    def __init__(self, *args, **kwargs):
        pass
    messages = types.SimpleNamespace(create=lambda **kwargs: types.SimpleNamespace(sid="test"))

twilio_rest_module.Client = _TwilioClient


# --- Common test fixtures ---

@pytest.fixture
def mock_db():
    """Generic Supabase client mock with async-aware chaining."""
    db = MagicMock()
    table_mock = MagicMock()
    table_mock.select = MagicMock(return_value=table_mock)
    table_mock.insert = MagicMock(return_value=table_mock)
    table_mock.update = MagicMock(return_value=table_mock)
    table_mock.upsert = MagicMock(return_value=table_mock)
    table_mock.eq = MagicMock(return_value=table_mock)
    table_mock.ilike = MagicMock(return_value=table_mock)
    table_mock.execute = AsyncMock(return_value=MagicMock(data=[]))
    db.table = MagicMock(return_value=table_mock)
    return db


@pytest.fixture
def mock_gemini_service():
    """Mock GeminiService that returns canned responses."""
    from app.ai.gemini import CropDiseaseResponse

    service = MagicMock()

    # Build a real CropDiseaseResponse so Pydantic validation succeeds
    disease_response = CropDiseaseResponse(
        plant_type="Tomato",
        disease_name="Late Blight",
        local_name="झुलसा रोग",
        confidence="high",
        symptoms=["Dark spots on leaves", "White mold under leaves"],
        treatment={
            "type": "fungicide",
            "name": "Mancozeb",
            "dosage": "2g per liter water",
            "application_method": "Foliar spray",
            "timing": "Every 7-10 days",
        },
        preventive_measures=["Crop rotation", "Proper spacing"],
        resistant_varieties=["Pant Bahar"],
        economic_impact="20-30% yield loss if untreated",
    )

    # Mock vision model (for analyze_crop_disease which is async)
    vision_response = MagicMock()
    vision_response.text = disease_response.model_dump_json()
    vision_model = MagicMock()
    vision_model.generate_content = AsyncMock(return_value=vision_response)
    service.vision_model = vision_model

    # analyze_crop_disease is async and returns CropDiseaseResponse
    service.analyze_crop_disease = AsyncMock(return_value=disease_response)

    # generate_voice_advisory is sync and returns a string
    service.generate_voice_advisory = MagicMock(
        return_value="Apply neem oil spray twice a week."
    )
    return service


@pytest.fixture
def sample_farmer_data():
    """Sample farmer data for tests."""
    return {
        "id": "farmer-1",
        "phone": "+919876543210",
        "name": "Ravi Kumar",
        "language": "hindi",
        "state": "Maharashtra",
        "district": "Pune",
    }