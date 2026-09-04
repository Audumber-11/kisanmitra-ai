"""API v1 router initialization."""

from fastapi import APIRouter

from app.services import (
    voice_router,
    disease_router,
    alerts_router,
    weather_router,
    mandi_router,
    dashboard_router,
    carbon_router,
)

api_router = APIRouter(prefix="/v1")

# Include all service routers
api_router.include_router(voice_router)
api_router.include_router(disease_router)
api_router.include_router(alerts_router)
api_router.include_router(weather_router)
api_router.include_router(mandi_router)
api_router.include_router(dashboard_router)
api_router.include_router(carbon_router)
