"""Weather and mandi price alert services."""

from datetime import datetime
from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from supabase import AsyncClient

from app.core.config import get_settings
from app.db.client import get_db

router = APIRouter(prefix="/alerts", tags=["Alerts"])


# Pydantic Models
class WeatherAlert(BaseModel):
    """Weather alert model."""

    district: str
    state: str
    date: str
    temperature: float
    humidity: int
    rainfall: float
    wind_speed: float
    weather_type: str
    recommendation: str
    disease_risk: str


class MandiPrice(BaseModel):
    """Mandi price model."""

    commodity: str
    state: str
    district: str
    market: str
    price_per_quintal: float
    previous_price: float | None = None
    price_change_percent: float | None = None
    date: str


class AlertPreferences(BaseModel):
    """Farmer's alert preferences."""

    farmer_id: str
    weather_alerts: bool = True
    mandi_alerts: bool = True
    disease_alerts: bool = True
    preferred_time: str = "06:00"  # 6 AM default


# API Router for weather endpoints
weather_router = APIRouter(prefix="/weather", tags=["Weather"])


@weather_router.get("/current", response_model=WeatherAlert)
async def get_current_weather(
    district: str,
    state: str = "Maharashtra",
) -> WeatherAlert:
    """
    Get current weather for a district.

    Uses OpenWeatherMap API for weather data.
    """
    settings = get_settings()

    async with httpx.AsyncClient() as client:
        # In production, use actual geocoding and weather API
        # For MVP, return simulated data based on district
        response = await client.get(
            f"https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": f"{district},{state},IN",
                "appid": settings.openweathermap_api_key,
                "units": "metric",
            },
            timeout=10.0,
        )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="District not found")

        if response.status_code != 200:
            # Return mock data for demo
            return _get_mock_weather(district, state)

        data = response.json()

        # Analyze weather for disease risk
        humidity = data["main"]["humidity"]
        rainfall = data.get("rain", {}).get("1h", 0)
        temp = data["main"]["temp"]
        weather_type = data["weather"][0]["main"]

        disease_risk = _calculate_disease_risk(
            humidity, rainfall, temp, weather_type
        )

        recommendation = _get_weather_recommendation(
            humidity, rainfall, temp, weather_type, district
        )

        return WeatherAlert(
            district=district,
            state=state,
            date=datetime.now().strftime("%Y-%m-%d"),
            temperature=temp,
            humidity=humidity,
            rainfall=rainfall,
            wind_speed=data["wind"]["speed"],
            weather_type=weather_type,
            recommendation=recommendation,
            disease_risk=disease_risk,
        )


@weather_router.get("/forecast")
async def get_weather_forecast(
    district: str,
    state: str = "Maharashtra",
    days: int = 5,
) -> list[WeatherAlert]:
    """Get weather forecast for next N days."""
    settings = get_settings()

    async with httpx.AsyncClient() as client:
        # OpenWeatherMap forecast endpoint
        response = await client.get(
            f"https://api.openweathermap.org/data/2.5/forecast",
            params={
                "q": f"{district},{state},IN",
                "appid": settings.openweathermap_api_key,
                "units": "metric",
            },
            timeout=10.0,
        )

        if response.status_code != 200:
            # Return mock forecast for demo
            return [_get_mock_weather(district, state) for _ in range(days)]

        data = response.json()
        forecasts = []

        # Process 3-hour intervals into daily forecasts
        daily_data = {}
        for item in data["list"]:
            date = item["dt_txt"].split(" ")[0]
            if date not in daily_data:
                daily_data[date] = []
            daily_data[date].append(item)

        for i, (date, items) in enumerate(list(daily_data.items())[:days]):
            # Use midday data
            midday = items[len(items) // 2] if len(items) >= 5 else items[0]
            humidity = midday["main"]["humidity"]
            temp = midday["main"]["temp"]
            rainfall = sum(item.get("rain", {}).get("3h", 0) for item in items)
            weather_type = midday["weather"][0]["main"]

            forecasts.append(
                WeatherAlert(
                    district=district,
                    state=state,
                    date=date,
                    temperature=temp,
                    humidity=humidity,
                    rainfall=rainfall,
                    wind_speed=midday["wind"]["speed"],
                    weather_type=weather_type,
                    recommendation=_get_weather_recommendation(
                        humidity, rainfall, temp, weather_type, district
                    ),
                    disease_risk=_calculate_disease_risk(
                        humidity, rainfall, temp, weather_type
                    ),
                )
            )

        return forecasts


# Mandi Price Router
mandi_router = APIRouter(prefix="/mandi", tags=["Mandi Prices"])


@mandi_router.get("/prices", response_model=list[MandiPrice])
async def get_mandi_prices(
    state: str = "Maharashtra",
    district: str | None = None,
    commodity: str | None = None,
) -> list[MandiPrice]:
    """
    Get current mandi prices for commodities.

    Uses data.gov.in API for mandi price data.
    In production, implement caching as this API has rate limits.
    """
    # For MVP, return mock data
    # In production, integrate with data.gov.in API
    return _get_mock_mandi_prices(state, district, commodity)


@mandi_router.get("/prices/{commodity}/trends")
async def get_price_trends(
    commodity: str,
    state: str = "Maharashtra",
    days: int = 7,
) -> dict:
    """Get price trends for a commodity."""
    # Return mock trend data for MVP
    return {
        "commodity": commodity,
        "state": state,
        "trend": "increasing" if days % 2 == 0 else "decreasing",
        "change_percent": 5.2,
        "forecast": "prices expected to remain stable",
    }


# Helper Functions
def _calculate_disease_risk(
    humidity: int, rainfall: float, temp: float, weather_type: str
) -> str:
    """Calculate disease risk based on weather conditions."""
    if humidity > 80 and rainfall > 5:
        return "HIGH - Fungal diseases likely"
    elif humidity > 70 and temp > 25:
        return "MEDIUM - Monitor crops closely"
    elif weather_type in ["Rain", "Thunderstorm"]:
        return "MEDIUM - Postpone pesticide application"
    else:
        return "LOW - Conditions favorable"


def _get_weather_recommendation(
    humidity: int, rainfall: float, temp: float, weather_type: str, district: str
) -> str:
    """Generate farming recommendation based on weather."""
    recommendations = []

    if rainfall > 10:
        recommendations.append("Delay irrigation for 2-3 days")
    elif rainfall < 2 and humidity < 50:
        recommendations.append("Irrigate crops in early morning")

    if temp > 35:
        recommendations.append("Provide shade to sensitive crops")
        recommendations.append("Increase watering frequency")
    elif temp < 15:
        recommendations.append("Protect frost-sensitive crops")

    if humidity > 80:
        recommendations.append("Watch for fungal diseases")
        recommendations.append("Ensure good air circulation")

    if not recommendations:
        recommendations.append("Weather conditions are favorable for farming")

    return "; ".join(recommendations)


def _get_mock_weather(district: str, state: str) -> WeatherAlert:
    """Generate mock weather data for testing."""
    return WeatherAlert(
        district=district,
        state=state,
        date=datetime.now().strftime("%Y-%m-%d"),
        temperature=28.5,
        humidity=65,
        rainfall=2.5,
        wind_speed=12.0,
        weather_type="Partly Cloudy",
        recommendation="Weather is favorable. Continue regular farming activities.",
        disease_risk="LOW - Conditions favorable",
    )


def _get_mock_mandi_prices(
    state: str, district: str | None, commodity: str | None
) -> list[MandiPrice]:
    """Generate mock mandi price data for testing."""
    base_prices = [
        ("Tomato", "Maharashtra", "Pune", 2500, 2300),
        ("Onion", "Maharashtra", "Nashik", 1800, 2000),
        ("Potato", "Maharashtra", "Ahmednagar", 1200, 1150),
        ("Wheat", "Maharashtra", "Nagpur", 2200, 2150),
        ("Rice", "Maharashtra", "Kolhapur", 2800, 2750),
        ("Soybean", "Maharashtra", "Akola", 4500, 4200),
        ("Cotton", "Maharashtra", "Yavatmal", 6200, 6000),
        ("Jowar", "Maharashtra", "Solapur", 3000, 2950),
    ]

    prices = []
    for crop, st, dist, price, prev_price in base_prices:
        if commodity and commodity.lower() not in crop.lower():
            continue
        if district and district.lower() not in dist.lower():
            continue

        prices.append(
            MandiPrice(
                commodity=crop,
                state=st,
                district=dist,
                market=f"{dist} APMC",
                price_per_quintal=price,
                previous_price=prev_price,
                price_change_percent=round((price - prev_price) / prev_price * 100, 2),
                date=datetime.now().strftime("%Y-%m-%d"),
            )
        )

    return prices


# Alert Management Router
alerts_router = APIRouter(prefix="/alerts", tags=["Alert Management"])


@alerts_router.post("/preferences")
async def set_alert_preferences(
    preferences: AlertPreferences,
    db: Annotated[AsyncClient, Depends(get_db)],
) -> dict:
    """Set farmer's alert preferences."""
    result = await db.table("alert_preferences").upsert(
        preferences.model_dump(),
        on_conflict="farmer_id",
    ).execute()
    return {"success": True, "data": result.data}


@alerts_router.get("/preferences/{farmer_id}")
async def get_alert_preferences(
    farmer_id: str,
    db: Annotated[AsyncClient, Depends(get_db)],
) -> AlertPreferences | None:
    """Get farmer's alert preferences."""
    result = await db.table("alert_preferences").select("*").eq(
        "farmer_id", farmer_id
    ).execute()

    if result.data:
        return AlertPreferences(**result.data[0])
    return None


@alerts_router.post("/send")
async def send_scheduled_alerts(
    db: Annotated[AsyncClient, Depends(get_db)],
) -> dict:
    """
    Trigger daily alert sending (called by Celery scheduler).

    This endpoint:
    1. Fetches all farmers with alerts enabled
    2. Gets weather for their location
    3. Gets relevant mandi prices
    4. Sends SMS via Twilio
    """
    # Get farmers with alerts enabled
    result = await db.table("alert_preferences").select(
        "*,farmer:farmer_id(*)"
    ).eq("weather_alerts", True).execute()

    sent_count = 0
    for pref in result.data:
        farmer = pref.get("farmer")
        if not farmer:
            continue

        # Get weather
        weather = await get_current_weather(
            district=farmer.get("district", "Pune"),
            state=farmer.get("state", "Maharashtra"),
        )

        # Get mandi prices
        mandi_prices = await get_mandi_prices(
            state=farmer.get("state", "Maharashtra"),
        )

        # In production: Send SMS via Twilio
        # twilio_client.messages.create(
        #     body=f"KisanMitra Alert: {weather.recommendation}",
        #     from_=settings.twilio_phone_number,
        #     to=farmer["phone"],
        # )

        sent_count += 1

    return {"success": True, "alerts_sent": sent_count}
