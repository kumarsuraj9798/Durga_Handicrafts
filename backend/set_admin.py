import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def set_admin():
    """Set the admin role for the email specified in ADMIN_EMAIL env variable"""
    mongo_uri = os.getenv("MONGO_URI")
    admin_email = os.getenv("ADMIN_EMAIL", "").strip()
    
    if not admin_email:
        print("ERROR: ADMIN_EMAIL is not set in .env file")
        return
    
    print(f"Connecting to MongoDB...")
    print(f"Admin email from .env: '{admin_email}'")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.durga_furniture
    
    try:
        # Check if user exists
        user = await db.users.find_one({"email": admin_email})
        
        if user:
            print(f"\n✓ User found in database:")
            print(f"  Email: {user.get('email')}")
            print(f"  Name: {user.get('name')}")
            print(f"  Current role: {user.get('role')}")
            
            # Update existing user to admin
            result = await db.users.update_one(
                {"email": admin_email},
                {"$set": {"role": "admin"}}
            )
            print(f"\n✓ Updated {admin_email} to admin role")
            print(f"  Modified count: {result.modified_count}")
            
            if result.modified_count == 0:
                print(f"  Note: User already had admin role")
            
            # Verify the update
            updated_user = await db.users.find_one({"email": admin_email})
            print(f"\n✓ Verified - Current role: {updated_user.get('role')}")
            
        else:
            print(f"\n✗ User {admin_email} not found in database")
            print(f"  Please log in once with this email first, then run this script again")
            
            # Show all users for debugging
            print(f"\nAll users in database:")
            async for u in db.users.find():
                print(f"  - {u.get('email')} (role: {u.get('role')})")
    
    except Exception as e:
        print(f"✗ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(set_admin())
