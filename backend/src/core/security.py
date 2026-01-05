"""
Security utilities for JWT verification.
"""
from jose import jwt, JWTError
from src.core.config import settings


def verify_jwt(token: str) -> dict:
    """
    Verify JWT token and return payload.

    Args:
        token: JWT token string

    Returns:
        dict: Decoded JWT payload

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        return payload
    except JWTError as e:
        raise JWTError(f"Could not validate credentials: {str(e)}")


def extract_user_id(token: str) -> str:
    """
    Extract user_id from JWT token.

    Args:
        token: JWT token string

    Returns:
        str: User ID from token

    Raises:
        JWTError: If token is invalid or user_id not found
    """
    payload = verify_jwt(token)
    user_id = payload.get("user_id")

    if user_id is None:
        raise JWTError("Token does not contain user_id")

    return user_id
