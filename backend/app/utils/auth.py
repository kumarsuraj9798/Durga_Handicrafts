from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from app.database import db

load_dotenv()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"]
        )
        email = payload.get("email")
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

async def get_admin_user(user: dict = Depends(get_current_user)):
    admin_email = os.getenv("ADMIN_EMAIL", "").strip()
    if not admin_email or user.get("email") != admin_email:
        raise HTTPException(
            status_code=403,
            detail=f"Only admin can perform this action"
        )
    return user