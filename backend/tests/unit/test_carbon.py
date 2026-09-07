"""Tests for carbon credit service."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from app.services.carbon_service import (
    log_regenerative_practice,
    estimate_carbon_credits,
    generate_carbon_report,
    get_carbon_summary,
    get_available_practices,
    CARBON_FACTORS,
    PracticeLogEntry,
)


class TestCarbonService:
    """Test suite for carbon credit service."""

    def test_carbon_factors_have_all_practices(self):
        """Test that all regenerative practices are defined."""
        expected_practices = [
            "cover_crops",
            "reduced_tillage",
            "compost_application",
            "crop_residue_return",
            "agroforestry",
            "intercropping",
            "organic_farming",
            "biochar",
        ]

        for practice in expected_practices:
            assert practice in CARBON_FACTORS
            assert "low" in CARBON_FACTORS[practice]
            assert "medium" in CARBON_FACTORS[practice]
            assert "high" in CARBON_FACTORS[practice]
            assert CARBON_FACTORS[practice]["low"] > 0

    def test_carbon_factors_increase_with_intensity(self):
        """Test that carbon factors increase with intensity."""
        for practice, factors in CARBON_FACTORS.items():
            assert factors["low"] <= factors["medium"] <= factors["high"]

    def test_practice_log_entry_validation(self):
        """Test PracticeLogEntry validates input."""
        entry = PracticeLogEntry(
            farm_id="farm-1",
            practice_type="cover_crops",
            area_hectares=2.5,
            intensity="medium",
            start_date="2024-06-01",
            notes="Planted sunhemp",
        )

        assert entry.farm_id == "farm-1"
        assert entry.area_hectares == 2.5
        assert entry.intensity == "medium"

    def test_practice_log_entry_invalid_area(self):
        """Test that invalid area is rejected."""
        with pytest.raises(ValueError):
            PracticeLogEntry(
                farm_id="farm-1",
                practice_type="cover_crops",
                area_hectares=-1,  # Should fail
                start_date="2024-06-01",
            )

    def test_practice_log_entry_invalid_practice(self):
        """Test that invalid practice is rejected."""
        with pytest.raises(ValueError):
            PracticeLogEntry(
                farm_id="farm-1",
                practice_type="invalid_practice",  # Should fail
                area_hectares=1.0,
                start_date="2024-06-01",
            )

    @pytest.mark.asyncio
    async def test_log_regenerative_practice_success(self):
        """Test successfully logging a practice."""
        mock_db = MagicMock()
        mock_table = MagicMock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.insert.return_value = mock_table
        mock_table.execute = AsyncMock(
            side_effect=[
                MagicMock(data=[{"id": "farm-1", "area_hacres": 2.0}]),
                MagicMock(data=[{"id": "log-1"}]),
            ]
        )
        mock_db.table.return_value = mock_table

        entry = PracticeLogEntry(
            farm_id="farm-1",
            practice_type="cover_crops",
            area_hectares=2.0,
            intensity="high",
            start_date="2024-06-01",
        )

        result = await log_regenerative_practice(entry, mock_db)

        assert result["success"] is True
        assert result["estimated_tco2"] > 0  # 2.0 * 2.0 = 4.0 tCO2/year
        assert "message" in result

    @pytest.mark.asyncio
    async def test_log_practice_farm_not_found(self):
        """Test that missing farm raises 404."""
        from fastapi import HTTPException

        mock_db = MagicMock()
        mock_table = MagicMock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute = AsyncMock(return_value=MagicMock(data=[]))
        mock_db.table.return_value = mock_table

        entry = PracticeLogEntry(
            farm_id="nonexistent",
            practice_type="cover_crops",
            area_hectares=1.0,
            start_date="2024-06-01",
        )

        with pytest.raises(HTTPException) as exc_info:
            await log_regenerative_practice(entry, mock_db)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_estimate_carbon_credits(self):
        """Test carbon credit estimation."""
        # Build separate mock chains for farms and carbon_credit_logs tables
        logs_table = MagicMock()
        logs_table.select.return_value = logs_table
        logs_table.eq.return_value = logs_table
        logs_table.execute = AsyncMock(
            return_value=MagicMock(
                data=[
                    {
                        "practice": "cover_crops",
                        "area_hacres": 5.0,
                        "intensity": "medium",
                    }
                ]
            )
        )

        farms_table = MagicMock()
        farms_table.select.return_value = farms_table
        farms_table.eq.return_value = farms_table
        farms_table.execute = AsyncMock(
            return_value=MagicMock(data=[{"id": "farm-1", "area_hacres": 5.0}])
        )

        def table_side_effect(name):
            if name == "farms":
                return farms_table
            if name == "carbon_credit_logs":
                return logs_table
            return MagicMock()

        mock_db = MagicMock()
        mock_db.table = MagicMock(side_effect=table_side_effect)

        estimates = await estimate_carbon_credits("farm-1", mock_db, 5)

        assert len(estimates) == 1
        assert estimates[0].practice_type == "cover_crops"
        assert estimates[0].estimated_tco2_per_year == 5.0  # 1.0 * 5.0
        assert estimates[0].estimated_tco2_total == 25.0  # 5.0 * 5 years

    @pytest.mark.asyncio
    async def test_get_available_practices(self):
        """Test getting list of available practices."""
        practices = await get_available_practices()

        assert len(practices) >= 8
        practice_types = [p["type"] for p in practices]
        assert "cover_crops" in practice_types
        assert "agroforestry" in practice_types
