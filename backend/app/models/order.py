from pydantic import BaseModel
from typing import Optional

class OrderItem(BaseModel):
    product_id: str
    quantity: int

class Order(BaseModel):
    product_id: str
    user_email: str
    user_name: Optional[str] = None
    quantity: int
    status: str = "purchased"
    phone_number: Optional[str] = None
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            str: lambda v: str(v)  # Ensure string conversion for MongoDB _id
        }