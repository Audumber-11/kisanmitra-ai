"""Tests for weather and mandi service."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch

from app.services.weather_service import (
    get_current_weather,
    get_weather_forecast,
    get_mandi_prices,
    _calculate_disease_risk,
    _get_weather_recommendation,
)


class TestWeatherService:
    """Test suite for weather and mandi service."""

    def test_disease_risk_calculation_high(self):
        """Test high disease risk calculation."""
        risk = _calculate_disease_risk(
            humidity=85,
            rainfall=10,
            temp=28,
            weather_type="Rain",
        )
        assert "HIGH" in risk or "fungal" in risk.lower()

    def test_disease_risk_calculation_low(self):
        """Test low disease risk calculation."""
        risk = _calculate_disease_risk(
            humidity=45,
            rainfall=0,
            temp=25,
            weather_type="Clear",
        )
        assert "LOW" in risk

    def test_disease_risk_calculation_medium(self):
        """Test medium disease risk calculation."""
        risk = _calculate_disease_risk(
            humidity=75,
            rainfall=2,
            temp=30,
            weather_type="Clouds",
        )
        assert "MEDIUM" in risk or "monitor" in risk.lower()

    def test_weather_recommendation_rainfall(self):
        """Test recommendations for high rainfall."""
        rec = _get_weather_recommendation(
            humidity=50,
            rainfall=15,
            temp=25,
            weather_type="Rain",
            district="Pune",
        )
        assert "irrigation" in rec.lower() or "delay" in rec.lower()

    def test_weather_recommendation_high_temp(self):
        """Test recommendations for high temperature."""
        rec = _get_weather_recommendation(
            humidity=40,
            rainfall=0,
            temp=38,
            weather_type="Clear",
            district="Nashik",
        )
        assert "shade" in rec.lower() or "watering" in rec.lower() or "water" in rec.lower()

    def test_weather_recommendation_high_humidity(self):
        """Test recommendations for high humidity."""
        rec = _get_weather_recommendation(
            humidity=85,
            rainfall=0,
            temp=28,
            weather_type="Clouds",
            district="Pune",
        )
        assert "fungal" in rec.lower() or "air" in rec.lower()

    @pytest.mark.asyncio
    async def test_get_mandi_prices(self):
        """Test getting mandi prices."""
        prices = await get_mandi_prices(state="Maharashtra")

        assert len(prices) > 0
        assert all(p.state == "Maharashtra" for p in prices)
        assert all(p.price_per_quintal > 0 for p in prices)

    @pytest.mark.asyncio
    async def test_get_mandi_prices_filtered_by_commodity(self):
        """Test filtering mandi prices by commodity."""
        prices = await get_mandi_prices(state="Maharashtra", commodity="Tomato")

        assert len(prices) > 0
        for price in prices:
            assert "Tomato" in price.commodity

    @pytest.mark.asyncio
    async def test_get_mandi_prices_no_results(self):
        """Test no prices for nonexistent commodity."""
        prices = await get_mandi_prices(state="Maharashtra", commodity="NonExistent")
        assert len(prices) == 0
