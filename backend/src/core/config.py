"""
Application configuration module.
Loads environment variables and provides settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str

    # Authentication
    BETTER_AUTH_SECRET: str

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    # Optional
    DEBUG: bool = False

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string into list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
