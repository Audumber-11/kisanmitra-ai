"""Core configuration and settings for KisanMitra AI."""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "KisanMitra AI"
    app_version: str = "1.0.0"
    debug: bool = False
    app_env: Literal["development", "staging", "production"] = "development"

    # Supabase
    supabase_url: str = Field(alias="SUPABASE_URL")
    supabase_service_key: str = Field(alias="SUPABASE_SERVICE_KEY")

    # Gemini
    gemini_api_key: str = Field(alias="GEMINI_API_KEY")

    # Twilio
    twilio_account_sid: str = Field(alias="TWILIO_ACCOUNT_SID")
    twilio_auth_token: str = Field(alias="TWILIO_AUTH_TOKEN")
    twilio_phone_number: str = Field(alias="TWILIO_PHONE_NUMBER")
    twilio_whatsapp_from: str = Field(alias="TWILIO_WHATSAPP_FROM")

    # Google Cloud
    google_cloud_project: str = Field(alias="GOOGLE_CLOUD_PROJECT")
    google_credentials_path: str = Field(alias="GOOGLE_APPLICATION_CREDENTIALS")

    # Weather
    openweathermap_api_key: str = Field(alias="OPENWEATHERMAP_API_KEY")

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "https://kisanmitra.vercel.app",
    ]

    # Sentry
    sentry_dsn: str = ""

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
