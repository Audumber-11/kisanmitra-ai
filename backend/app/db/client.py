"""Supabase database client and session management."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from supabase import AsyncClient, create_client

from app.core.config import get_settings


class SupabaseClient:
    """Singleton Supabase client instance."""

    _instance: AsyncClient | None = None

    @classmethod
    def get_client(cls) -> AsyncClient:
        """Get or create the Supabase client instance."""
        if cls._instance is None:
            settings = get_settings()
            cls._instance = create_client(
                supabase_url=settings.supabase_url,
                service_key=settings.supabase_service_key,
            )
        return cls._instance

    @classmethod
    async def close(cls) -> None:
        """Close the client connection."""
        if cls._instance is not None:
            await cls._instance.aclose()
            cls._instance = None


async def get_db() -> AsyncGenerator[AsyncClient, None]:
    """Dependency that provides the Supabase client."""
    client = SupabaseClient.get_client()
    try:
        yield client
    finally:
        pass  # Client is managed as singleton


@asynccontextmanager
async def get_db_context() -> AsyncGenerator[AsyncClient, None]:
    """Context manager for Supabase client sessions."""
    client = SupabaseClient.get_client()
    try:
        yield client
    finally:
        pass
