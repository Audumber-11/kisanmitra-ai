"""Services module initialization."""

from app.services.voice_service import router as voice_router
from app.services.disease_service import router as disease_router
from app.services.weather_service import (
    router as alerts_router,
    weather_router,
    mandi_router,
)
from app.services.dashboard_service import router as dashboard_router
from app.services.carbon_service import router as carbon_router

__all__ = [
    "voice_router",
    "disease_router",
    "alerts_router",
    "weather_router",
    "mandi_router",
    "dashboard_router",
    "carbon_router",
]
