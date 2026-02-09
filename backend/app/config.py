"""
Configuration management for the backend API.

Loads and validates environment variables required for the application.
Fails fast if required variables are missing.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self):
        """Initialize settings and validate required variables."""
        # Required variables
        self.database_url: str = self._get_required_env("DATABASE_URL")
        self.better_auth_secret: str = self._get_required_env("BETTER_AUTH_SECRET")

        # Optional variables with defaults
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO")
        self.cors_origins: list[str] = self._parse_cors_origins(
            os.getenv("CORS_ORIGINS", "http://localhost:3000")
        )
        self.debug: bool = os.getenv("DEBUG", "false").lower() == "true"

        # JWT algorithm
        self.jwt_algorithm: str = "HS256"

    def _get_required_env(self, key: str) -> str:
        """
        Get required environment variable.

        Args:
            key: Environment variable name

        Returns:
            Environment variable value

        Raises:
            RuntimeError: If environment variable is not set
        """
        value = os.getenv(key)
        if not value:
            raise RuntimeError(
                f"{key} environment variable is not set. "
                f"Please set it in your .env file or environment."
            )
        return value

    def _parse_cors_origins(self, origins_str: str) -> list[str]:
        """
        Parse CORS origins from comma-separated string.

        Args:
            origins_str: Comma-separated list of origins

        Returns:
            List of origin URLs
        """
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]


# Global settings instance
settings = Settings()
