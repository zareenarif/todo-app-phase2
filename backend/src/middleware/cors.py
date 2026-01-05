"""
CORS middleware configuration.
"""
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings


def setup_cors(app):
    """
    Configure CORS middleware for the application.

    Args:
        app: FastAPI application instance
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,  # Required for HTTP-only cookies
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers
    )
