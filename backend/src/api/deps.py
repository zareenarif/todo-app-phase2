"""
API dependencies - reusable dependency injection functions.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from jose import JWTError
from src.core.security import extract_user_id


# HTTP Bearer token authentication scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security)
) -> str:
    """
    Extract and verify JWT token, return user_id.

    This dependency:
    1. Extracts JWT from Authorization header
    2. Verifies JWT signature using BETTER_AUTH_SECRET
    3. Extracts user_id from JWT payload
    4. Returns user_id for use in endpoint handlers

    Args:
        credentials: HTTP Bearer credentials from request header

    Returns:
        str: Authenticated user's ID

    Raises:
        HTTPException: 401 Unauthorized if token is missing/invalid
    """
    token = credentials.credentials

    try:
        user_id = extract_user_id(token)
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
