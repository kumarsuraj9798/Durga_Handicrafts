import cloudinary
import cloudinary.uploader
import os
from fastapi import HTTPException,UploadFile

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(file: UploadFile):
    try:
        # Upload image to Cloudinary
        result = cloudinary.uploader.upload(
            file.file,
            folder="durga_furniture",
            resource_type="image",
            allowed_formats=["jpg", "png", "jpeg"]
        )
        # Return secure URL
        return result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image to Cloudinary: {str(e)}")