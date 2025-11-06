from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
from app.database import db
import os
from dotenv import load_dotenv
from jose import jwt
from app.utils.auth import get_current_user

load_dotenv()
router = APIRouter()

class GoogleToken(BaseModel):
    token: str

@router.post("/auth/google")
async def google_login(google_token: GoogleToken):
    try:
        idinfo = id_token.verify_oauth2_token(
            google_token.token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
        email = idinfo["email"]
        name = idinfo.get("name", email.split("@")[0])

        # Set role based on email, stripping whitespace from env var
        admin_email = os.getenv("ADMIN_EMAIL", "").strip()
        role = "admin" if admin_email and email == admin_email else "user"

        user = await db.users.find_one({"email": email})
        if not user:
            user = {"email": email, "name": name, "role": role, "phone_number": None}
            await db.users.insert_one(user)
        else:
            # Always update name and role on login
            update_data = {"name": name, "role": role}
            if "phone_number" not in user:
                update_data["phone_number"] = None
            await db.users.update_one({"email": email}, {"$set": update_data})

        # Refetch user to get the latest data
        user = await db.users.find_one({"email": email})


        # Prepare user data for JWT and response, excluding MongoDB's _id
        user_data_for_token = {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "phone_number": user.get("phone_number")
        }

        jwt_token = jwt.encode(
            user_data_for_token,
            os.getenv("SECRET_KEY"),
            algorithm="HS256"
        )
        return {"token": jwt_token, "user": user_data_for_token}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")

class PhoneUpdate(BaseModel):
    phone_number: str

class ProfileUpdate(BaseModel):
    phone_number: str
    address: str = None
    city: str = None
    state: str = None
    pincode: str = None

@router.post("/user/phone")
async def update_phone_number(phone_update: PhoneUpdate, user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"email": user["email"]},
        {"$set": {"phone_number": phone_update.phone_number}}
    )
    return {"message": "Phone number updated successfully"}

@router.put("/user/profile")
async def update_profile(profile_update: ProfileUpdate, user: dict = Depends(get_current_user)):
    """Update user profile with address and contact information"""
    update_data = {
        "phone_number": profile_update.phone_number,
        "address": profile_update.address,
        "city": profile_update.city,
        "state": profile_update.state,
        "pincode": profile_update.pincode
    }
    
    await db.users.update_one(
        {"email": user["email"]},
        {"$set": update_data}
    )
    
    # Fetch updated user data
    updated_user = await db.users.find_one({"email": user["email"]})
    
    # Return updated user data (excluding _id)
    return {
        "message": "Profile updated successfully",
        "user": {
            "email": updated_user["email"],
            "name": updated_user["name"],
            "role": updated_user["role"],
            "phone_number": updated_user.get("phone_number"),
            "address": updated_user.get("address"),
            "city": updated_user.get("city"),
            "state": updated_user.get("state"),
            "pincode": updated_user.get("pincode")
        }
    }

@router.get("/user/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """Get current user profile"""
    user_data = await db.users.find_one({"email": user["email"]})
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user_data["email"],
        "name": user_data["name"],
        "role": user_data["role"],
        "phone_number": user_data.get("phone_number"),
        "address": user_data.get("address"),
        "city": user_data.get("city"),
        "state": user_data.get("state"),
        "pincode": user_data.get("pincode")
    }

@router.get("/auth/google/callback")
async def google_callback(code: str):
    return {"message": "Callback received", "code": code}