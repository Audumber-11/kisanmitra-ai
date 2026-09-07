"""Tests for voice service."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from app.services.voice_service import (
    process_voice_query,
    twilio_voice_webhook,
    get_or_create_farmer,
    LANGUAGE_NAMES,
    STT_LANGUAGE_CODES,
    TTS_LANGUAGE_CODES,
    _get_current_season,
)


class TestVoiceService:
    """Test suite for voice service."""

    def test_language_mappings(self):
        """Test that all supported languages are mapped."""
        assert "hindi" in LANGUAGE_NAMES
        assert "marathi" in LANGUAGE_NAMES
        assert "telugu" in LANGUAGE_NAMES
        assert "english" in LANGUAGE_NAMES

        assert "hindi" in STT_LANGUAGE_CODES
        assert "hindi" in TTS_LANGUAGE_CODES

        # Verify format
        assert "hi-IN" in STT_LANGUAGE_CODES.values()
        assert "mr-IN" in STT_LANGUAGE_CODES.values()

    def test_get_current_season(self):
        """Test season detection based on month."""
        season = _get_current_season()
        assert season in ["kharif", "rabi", "zaid"]

    @pytest.mark.asyncio
    async def test_get_or_create_farmer_existing(self):
        """Test retrieving an existing farmer."""
        mock_db = MagicMock()
        mock_table = MagicMock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute = AsyncMock(
            return_value=MagicMock(
                data=[{"id": "farmer-1", "phone": "+919876543210"}]
            )
        )
        mock_db.table.return_value = mock_table

        farmer = await get_or_create_farmer(mock_db, "+919876543210")

        assert farmer["phone"] == "+919876543210"
        assert farmer["id"] == "farmer-1"

    @pytest.mark.asyncio
    async def test_get_or_create_farmer_new(self):
        """Test creating a new farmer."""
        mock_db = MagicMock()
        mock_table = MagicMock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.insert.return_value = mock_table

        # First call returns empty (no existing farmer)
        # Second call (insert) returns new farmer
        mock_table.execute = AsyncMock(
            side_effect=[
                MagicMock(data=[]),  # No existing farmer
                MagicMock(data=[{"id": "new-farmer", "phone": "+919876543211"}]),
            ]
        )
        mock_db.table.return_value = mock_table

        farmer = await get_or_create_farmer(mock_db, "+919876543211", "marathi")

        assert farmer["id"] == "new-farmer"
        assert mock_table.insert.called

    @pytest.mark.asyncio
    async def test_process_voice_query_success(self, mock_db, mock_gemini_service):
        """Test successful voice query processing."""
        with patch(
            "app.services.voice_service.get_gemini_service",
            return_value=mock_gemini_service,
        ):
            # Use separate mock chains for farmers vs advisory_logs tables
            farmers_table = MagicMock()
            farmers_table.select.return_value = farmers_table
            farmers_table.eq.return_value = farmers_table
            farmers_table.execute = AsyncMock(
                return_value=MagicMock(
                    data=[{
                        "id": "farmer-1",
                        "phone": "+919876543210",
                        "language": "hindi",
                        "state": "Maharashtra",
                    }]
                )
            )

            logs_table = MagicMock()
            logs_table.insert.return_value = logs_table
            logs_table.execute = AsyncMock(
                return_value=MagicMock(data=[{"id": "log-1"}])
            )

            def table_side_effect(name):
                if name == "farmers":
                    return farmers_table
                if name == "advisory_logs":
                    return logs_table
                return MagicMock()

            mock_db.table = MagicMock(side_effect=table_side_effect)

            request = MagicMock()
            request.audio_data = "dGVzdA=="
            request.phone = "+919876543210"
            request.language = "hindi"

            response = await process_voice_query(request, mock_db)

            assert response.language == "hindi"
            assert response.query_id == "farmer-1"
            assert len(response.response_text) > 0

    @pytest.mark.asyncio
    async def test_twilio_webhook_returns_twiml(self, mock_db):
        """Test Twilio webhook returns proper TwiML."""
        mock_request = MagicMock()
        mock_request.form = AsyncMock(
            return_value={
                "From": "+919876543210",
                "To": "+15551234567",
                "CallSid": "CA123456",
            }
        )

        mock_db.table.return_value.select.return_value.eq.return_value.execute = AsyncMock(
            return_value=MagicMock(
                data=[{"id": "farmer-1", "phone": "+919876543210", "language": "hindi"}]
            )
        )

        result = await twilio_voice_webhook(mock_request, mock_db)

        assert "response" in result
        assert "Content-Type" in result["headers"]
        assert result["headers"]["Content-Type"] == "text/xml"
        assert "KisanMitra" in result["response"]
        assert "Gather" in result["response"]  # TwiML gather element
