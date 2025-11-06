from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize MongoDB client
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    # Fail fast with a clear message instead of obscure connection errors later
    raise RuntimeError("Server misconfigured: MONGO_URI is not set in environment")

# Shorter selection timeout to surface connectivity issues quickly
client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
db = client.durga_furniture

# Optional: Test connection on startup
async def ping_db():
    try:
        await db.command("ping")
        print("MongoDB connection successful")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        # Re-raise so startup can fail fast if desired
        raise

# Ensure indexes for better performance
async def init_db():
    await db.users.create_index("email", unique=True)
    await db.products.create_index("name")
    await db.orders.create_index("user_email")