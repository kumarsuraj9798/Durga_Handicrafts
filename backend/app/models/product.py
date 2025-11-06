from pydantic import BaseModel

class Product(BaseModel):
    name: str
    category: str
    image_url: str
    price: float
    stock: int = 1