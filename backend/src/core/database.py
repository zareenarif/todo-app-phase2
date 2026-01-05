"""
Database configuration and session management.
"""
from sqlmodel import Session, create_engine
from src.core.config import settings


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,  # Verify connections before using (handles serverless wakeup)
)


def get_session():
    """
    Dependency function to get database session.
    Yields a session and ensures it's closed after use.
    """
    with Session(engine) as session:
        yield session
