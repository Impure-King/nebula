from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_supabase

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify JWT token and return current user.
    Verifies Supabase JWT tokens.
    """
    token = credentials.credentials
    
    # TODO: Implement Supabase JWT verification
    # Get supabase client and verify token
    try:
        supabase = get_supabase()
        # Set the session with the token
        supabase.auth.set_session(token, refresh_token=None)
        # Get user from token
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user.user.model_dump() if hasattr(user.user, 'model_dump') else user.user.dict()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

