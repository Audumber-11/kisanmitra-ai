"""District officer dashboard service."""

from datetime import datetime, timedelta
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from supabase import AsyncClient

from app.db.client import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# Response Models
class DashboardStats(BaseModel):
    """Overall dashboard statistics."""

    total_farmers: int
    active_farmers_30d: int
    total_queries: int
    queries_today: int
    disease_reports_30d: int
    disease_outbreaks: int
    top_concerns: list[dict]
    top_diseases: list[dict]


class QueryHeatmapEntry(BaseModel):
    """Entry for query heatmap."""

    district: str
    state: str
    query_count: int
    primary_concern: str
    lat: float | None = None
    lon: float | None = None


class DiseaseOutbreakEntry(BaseModel):
    """Disease outbreak entry."""

    district: str
    crop: str
    disease_name: str
    cases: int
    severity: Literal["low", "medium", "high", "critical"]
    trend: Literal["increasing", "stable", "decreasing"]
    date_reported: str


class WeatherTrendEntry(BaseModel):
    """Weather trend entry."""

    date: str
    avg_temperature: float
    avg_humidity: float
    total_rainfall: float
    disease_risk_days: int


class MandiPriceSummary(BaseModel):
    """Mandi price summary."""

    commodity: str
    current_price: float
    previous_price: float
    change_percent: float
    trend: Literal["up", "down", "stable"]


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Annotated[AsyncClient, Depends(get_db)],
    district: str | None = None,
    state: str | None = None,
) -> DashboardStats:
    """
    Get overall dashboard statistics.

    For district/block officers to see aggregate metrics.
    """
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()

    # Build query filters
    farmers_query = db.table("farmers").select("*", count="exact")
    if district:
        farmers_query = farmers_query.eq("district", district)
    if state:
        farmers_query = farmers_query.eq("state", state)

    farmers_result = await farmers_query.execute()

    # Active farmers in last 30 days
    active_query = (
        db.table("advisory_logs")
        .select("farmer_id", distinct=True)
        .gte("created_at", thirty_days_ago)
    )
    if district:
        active_query = active_query.eq("district", district)

    active_result = await active_query.execute()

    # Total queries
    queries_result = await db.table("advisory_logs").select(
        "*", count="exact"
    ).execute()

    # Queries today
    today = datetime.now().date().isoformat()
    queries_today_result = await db.table("advisory_logs").select(
        "*", count="exact"
    ).gte("created_at", today).execute()

    # Disease reports in last 30 days
    disease_result = await db.table("advisory_logs").select(
        "*", count="exact"
    ).eq("type", "image").gte("created_at", thirty_days_ago).execute()

    # Top concerns (from query text analysis)
    top_concerns = await _get_top_concerns(db, district, state, limit=5)

    # Top diseases
    top_diseases = await _get_top_diseases(db, district, limit=5)

    # Count active disease outbreaks
    disease_outbreaks = await _count_active_outbreaks(db)

    return DashboardStats(
        total_farmers=farmers_result.count or 0,
        active_farmers_30d=len(active_result.data),
        total_queries=queries_result.count or 0,
        queries_today=queries_today_result.count or 0,
        disease_reports_30d=disease_result.count or 0,
        disease_outbreaks=disease_outbreaks,
        top_concerns=top_concerns,
        top_diseases=top_diseases,
    )


@router.get("/query-heatmap", response_model=list[QueryHeatmapEntry])
async def get_query_heatmap(
    db: Annotated[AsyncClient, Depends(get_db)],
    state: str | None = None,
) -> list[QueryHeatmapEntry]:
    """Get query heatmap data for map visualization."""
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()

    query = (
        db.table("advisory_logs")
        .select("district, query")
        .gte("created_at", thirty_days_ago)
    )

    if state:
        query = query.eq("state", state)

    result = await query.execute()

    # Aggregate by district
    district_counts = {}
    for log in result.data:
        dist = log.get("district", "Unknown")
        if dist not in district_counts:
            district_counts[dist] = {"count": 0, "concerns": []}
        district_counts[dist]["count"] += 1

    # Convert to response model
    heatmap = []
    for district, data in district_counts.items():
        heatmap.append(
            QueryHeatmapEntry(
                district=district,
                state=state or "Maharashtra",
                query_count=data["count"],
                primary_concern="General queries",
            )
        )

    return sorted(heatmap, key=lambda x: x.query_count, reverse=True)


@router.get("/disease-outbreaks", response_model=list[DiseaseOutbreakEntry])
async def get_disease_outbreaks(
    db: Annotated[AsyncClient, Depends(get_db)],
    state: str | None = None,
    severity: Literal["low", "medium", "high", "critical"] | None = None,
) -> list[DiseaseOutbreakEntry]:
    """Get active disease outbreak data."""
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()

    query = (
        db.table("advisory_logs")
        .select("*")
        .eq("type", "image")
        .gte("created_at", thirty_days_ago)
    )

    if state:
        query = query.eq("state", state)

    result = await query.execute()

    # Aggregate by disease
    outbreaks = {}
    for log in result.data:
        response_data = log.get("response", "{}")
        # Parse response to extract disease info
        # In production, store structured disease data

        disease = "Fungal Disease"  # Placeholder
        crop = "Tomato"  # Placeholder
        district = log.get("district", "Unknown")

        key = f"{district}-{disease}"
        if key not in outbreaks:
            outbreaks[key] = {
                "district": district,
                "crop": crop,
                "disease": disease,
                "cases": 0,
                "severity": "medium",
            }
        outbreaks[key]["cases"] += 1

    # Convert to response
    outbreak_list = []
    for data in outbreaks.values():
        cases = data["cases"]
        if cases > 50:
            severity = "critical"
        elif cases > 20:
            severity = "high"
        elif cases > 10:
            severity = "medium"
        else:
            severity = "low"

        outbreak_list.append(
            DiseaseOutbreakEntry(
                district=data["district"],
                crop=data["crop"],
                disease_name=data["disease"],
                cases=cases,
                severity=severity,
                trend="increasing" if cases > 20 else "stable",
                date_reported=datetime.now().date().isoformat(),
            )
        )

    # Filter by severity if specified
    if severity:
        outbreak_list = [o for o in outbreak_list if o.severity == severity]

    return sorted(outbreak_list, key=lambda x: x.cases, reverse=True)


@router.get("/weather-trends", response_model=list[WeatherTrendEntry])
async def get_weather_trends(
    district: str,
    state: str = "Maharashtra",
    days: int = Query(default=7, ge=1, le=30),
) -> list[WeatherTrendEntry]:
    """Get weather trend data for the district."""
    # In production, this would query stored weather data
    # For MVP, return mock data
    trends = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).date().isoformat()
        trends.append(
            WeatherTrendEntry(
                date=date,
                avg_temperature=28.0 + (i % 5),
                avg_humidity=65 + (i % 10),
                total_rainfall=5.0 if i % 3 == 0 else 0,
                disease_risk_days=1 if i % 3 == 0 else 0,
            )
        )
    return trends


@router.get("/mandi-summary", response_model=list[MandiPriceSummary])
async def get_mandi_price_summary(
    state: str = "Maharashtra",
) -> list[MandiPriceSummary]:
    """Get summary of mandi prices for key commodities."""
    commodities = [
        ("Tomato", 2500, 2300),
        ("Onion", 1800, 2000),
        ("Potato", 1200, 1150),
        ("Wheat", 2200, 2150),
        ("Rice", 2800, 2750),
        ("Soybean", 4500, 4200),
        ("Cotton", 6200, 6000),
    ]

    summaries = []
    for crop, curr, prev in commodities:
        change = (curr - prev) / prev * 100
        summaries.append(
            MandiPriceSummary(
                commodity=crop,
                current_price=curr,
                previous_price=prev,
                change_percent=round(change, 2),
                trend="up" if change > 0 else "down" if change < 0 else "stable",
            )
        )

    return summaries


# Helper Functions
async def _get_top_concerns(
    db: AsyncClient,
    district: str | None,
    state: str | None,
    limit: int = 5,
) -> list[dict]:
    """Get top farmer concerns from query text."""
    # In production, use text analysis/NLP
    # For MVP, return mock data
    return [
        {"concern": "Pest attack", "count": 145},
        {"concern": "Yellow leaves", "count": 98},
        {"concern": "Irrigation", "count": 76},
        {"concern": "Fertilizer", "count": 54},
        {"concern": "Weather impact", "count": 43},
    ][:limit]


async def _get_top_diseases(
    db: AsyncClient,
    district: str | None,
    limit: int = 5,
) -> list[dict]:
    """Get most reported diseases."""
    return [
        {"disease": "Late Blight", "crop": "Tomato", "cases": 87},
        {"disease": "Powdery Mildew", "crop": "Grape", "cases": 65},
        {"disease": "Bacterial Wilt", "crop": "Brinjal", "cases": 43},
        {"disease": "Rust", "crop": "Groundnut", "cases": 38},
        {"disease": "Leaf Curl", "crop": "Chilli", "cases": 29},
    ][:limit]


async def _count_active_outbreaks(db: AsyncClient) -> int:
    """Count currently active disease outbreaks."""
    # In production, count recent high-severity reports
    return 3  # Mock value
