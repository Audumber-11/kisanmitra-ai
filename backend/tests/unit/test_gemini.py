"""Tests for Gemini AI service."""

import pytest
from unittest.mock import MagicMock, patch
import json

from app.ai.gemini import (
    GeminiService,
    VoiceAdvisoryRequest,
    CropDiseaseResponse,
    get_gemini_service,
)


class TestGeminiService:
    """Test suite for Gemini service."""

    def test_voice_advisory_request_validation(self):
        """Test VoiceAdvisoryRequest validates input correctly."""
        # Valid request
        request = VoiceAdvisoryRequest(
            query="टमाटर के पौधों में पीले पत्ते आ रहे हैं",
            language="hindi",
            state="Maharashtra",
            district="Pune",
            soil_type="black",
            season="kharif",
        )

        assert request.query is not None
        assert request.language == "hindi"
        assert request.state == "Maharashtra"

    def test_voice_advisory_request_invalid_language(self):
        """Test invalid language raises validation error."""
        with pytest.raises(ValueError):
            VoiceAdvisoryRequest(
                query="Test",
                language="invalid_language",  # Should fail validation
            )

    def test_voice_advisory_request_empty_query(self):
        """Test empty query raises validation error."""
        with pytest.raises(ValueError):
            VoiceAdvisoryRequest(query="", language="hindi")

    @patch("app.ai.gemini.genai")
    def test_generate_voice_advisory_success(self, mock_genai):
        """Test successful voice advisory generation."""
        # Mock Gemini response
        mock_response = MagicMock()
        mock_response.text = "टमाटर के पीले पत्तों के लिए नाइट्रोजन का छिड़काव करें।"

        mock_model = MagicMock()
        mock_model.generate_content.return_value = mock_response
        mock_genai.configure = MagicMock()
        mock_genai.GenerativeModel.return_value = mock_model

        service = GeminiService()
        request = VoiceAdvisoryRequest(
            query="टमाटर के पत्ते पीले क्यों हो रहे हैं?",
            language="hindi",
            state="Maharashtra",
            district="Pune",
        )

        response = service.generate_voice_advisory(request)

        assert "टमाटर" in response or "नाइट्रोजन" in response or len(response) > 0
        mock_model.generate_content.assert_called_once()

    def test_crop_disease_response_model(self):
        """Test CropDiseaseResponse model validation."""
        data = {
            "plant_type": "Tomato",
            "disease_name": "Late Blight",
            "local_name": "झुलसा रोग",
            "confidence": "high",
            "symptoms": ["Yellow leaves", "Brown spots"],
            "treatment": {
                "type": "fungicide",
                "name": "Metalaxyl",
                "dosage": "2g/l",
                "application_method": "Foliar spray",
                "timing": "Every 7-10 days",
            },
            "preventive_measures": ["Use resistant varieties"],
            "resistant_varieties": ["Pusa Ruby"],
            "economic_impact": "Can cause 50% loss",
        }

        response = CropDiseaseResponse(**data)
        assert response.plant_type == "Tomato"
        assert response.confidence == "high"
        assert len(response.symptoms) == 2

    def test_prompt_template_format(self):
        """Test that prompt template formats correctly."""
        from app.ai.gemini import VOICE_ADVISORY_PROMPT

        formatted = VOICE_ADVISORY_PROMPT.format(
            query="Test query",
            language="Hindi",
            state="Maharashtra",
            district="Pune",
            soil_type="black",
            season="kharif",
        )

        assert "Test query" in formatted
        assert "Hindi" in formatted
        assert "Pune" in formatted
        assert "Maharashtra" in formatted

    def test_singleton_pattern(self):
        """Test that get_gemini_service returns singleton."""
        with patch("app.ai.gemini.genai"):
            service1 = get_gemini_service()
            service2 = get_gemini_service()

            assert service1 is service2
