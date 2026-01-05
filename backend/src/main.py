"""
FastAPI application entry point.
"""
from fastapi import FastAPI
from src.core.config import settings
from src.middleware.cors import setup_cors
from src.middleware.error_handler import setup_exception_handlers
from src.api.v1 import api_router

# Create FastAPI application
app = FastAPI(
    title="Todo Full-Stack Web Application API",
    description="RESTful JSON API for managing user tasks with JWT authentication",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup middleware
setup_cors(app)
setup_exception_handlers(app)

# Include API routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "message": "Todo Full-Stack Web Application API",
        "version": "2.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
