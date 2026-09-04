"""Tests for crop disease detection service."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from app.services.disease_service import (
    analyze_crop_disease,
    get_disease_history,
    get_or_create_farmer,
    DiseaseAnalysisResponse,
)


class TestDiseaseService:
    """Test suite for disease detection service."""

    @pytest.mark.asyncio
    async def test_get_or_create_farmer_existing(self):
        """Test retrieving existing farmer."""
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

        assert farmer["id"] == "farmer-1"
        assert farmer["phone"] == "+919876543210"

    @pytest.mark.asyncio
    async def test_analyze_crop_disease_success(self, mock_gemini_service, sample_farmer_data):
        """Test successful crop disease analysis."""
        # Create mock file upload
        mock_file = MagicMock()
        mock_file.content_type = "image/jpeg"
        mock_file.filename = "test.jpg"
        mock_file.read = AsyncMock(return_value=b"fake-image-data")

        with patch(
            "app.services.disease_service.get_gemini_service",
            return_value=mock_gemini_service,
        ):
            mock_db = MagicMock()
            # Mock farmer lookup
            mock_table = MagicMock()
            mock_table.select.return_value = mock_table
            mock_table.eq.return_value = mock_table
            mock_table.insert.return_value = mock_table
            mock_table.execute = AsyncMock(
                return_value=MagicMock(data=[sample_farmer_data])
            )
            mock_db.table.return_value = mock_table

            # Mock storage
            mock_storage = MagicMock()
            mock_storage.upload.return_value = {"Key": "test-key"}
            mock_storage.get_public_url.return_value = "https://test.com/image.jpg"
            mock_db.storage.return_value = mock_storage

            response = await analyze_crop_disease(
                phone="+919876543210",
                file=mock_file,
                db=mock_db,
            )

            assert response.success is True
            assert response.data is not None
            assert response.data.plant_type == "Tomato"
            assert response.data.disease_name == "Late Blight"

    @pytest.mark.asyncio
    async def test_analyze_invalid_file_type(self):
        """Test that invalid file types are rejected."""
        from fastapi import HTTPException

        mock_file = MagicMock()
        mock_file.content_type = "application/pdf"
        mock_file.filename = "test.pdf"

        with pytest.raises(HTTPException) as exc_info:
            await analyze_crop_disease(
                phone="+919876543210",
                file=mock_file,
                db=MagicMock(),
            )

        assert exc_info.value.status_code == 400
        assert "Invalid file type" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_analyze_file_too_large(self):
        """Test that oversized files are rejected."""
        from fastapi import HTTPException

        mock_file = MagicMock()
        mock_file.content_type = "image/jpeg"
        mock_file.filename = "large.jpg"
        mock_file.read = AsyncMock(return_value=b"x" * (11 * 1024 * 1024))  # 11MB

        with pytest.raises(HTTPException) as exc_info:
            await analyze_crop_disease(
                phone="+919876543210",
                file=mock_file,
                db=MagicMock(),
            )

        assert exc_info.value.status_code == 400
        assert "too large" in str(exc_info.value.detail).lower()

    @pytest.mark.asyncio
    async def test_get_disease_history(self):
        """Test retrieving disease history."""
        mock_db = MagicMock()
        mock_table = MagicMock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.order.return_value = mock_table
        mock_table.limit.return_value = mock_table
        mock_table.execute = AsyncMock(
            return_value=MagicMock(
                data=[
                    {"id": "log-1", "type": "image", "response": "{}"},
                    {"id": "log-2", "type": "image", "response": "{}"},
                ]
            )
        )
        mock_db.table.return_value = mock_table

        history = await get_disease_history("farmer-1", mock_db, limit=10)

        assert len(history) == 2
        assert history[0]["id"] == "log-1"
