from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    email: EmailStr
    name: str
    role: str = "user"  # Default to 'user', set to 'admin' manually in MongoDB
    phone_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            str: lambda v: str(v)  # Ensure string conversion for MongoDB _id
        }