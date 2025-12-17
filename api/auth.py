"""
JWT authentication middleware for Supabase.
"""
import os
import jwt
from typing import Optional
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# Supabase JWT secret for verifying tokens
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

security = HTTPBearer()


def verify_jwt_token(token: str) -> Optional[dict]:
    """
    Verify a Supabase JWT token and return the payload.

    Args:
        token: The JWT token string

    Returns:
        The decoded token payload if valid, None otherwise
    """
    try:
        # Decode and verify the JWT token
        # Supabase uses HS256 algorithm
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    FastAPI dependency to get the current authenticated user from JWT token.

    Usage in endpoints:
        @app.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            user_id = user["sub"]
            user_email = user.get("email")
            ...

    Returns:
        dict: The decoded JWT payload containing user information
            - sub: User ID (Supabase user UUID)
            - email: User email
            - role: User role
            - aud: Audience
            - exp: Expiration time
    """
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload


def get_user_id(user: dict = Depends(get_current_user)) -> str:
    """
    FastAPI dependency to extract just the user ID from the JWT token.

    Usage in endpoints:
        @app.get("/protected")
        async def protected_route(user_id: str = Depends(get_user_id)):
            # user_id is the Supabase user UUID
            ...

    Returns:
        str: The user ID (Supabase user UUID)
    """
    return user["sub"]
