from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from app.database import db
from app.utils.email import send_order_email, send_processed_order_email
from app.utils.excel_export import save_order_to_excel
from app.utils.auth import get_current_user, get_admin_user
import os
from pydantic import BaseModel
from typing import List
from bson import ObjectId

router = APIRouter()

class OrderItem(BaseModel):
    product_id: str
    quantity: int

class OrderRequest(BaseModel):
    items: List[OrderItem]

@router.post("/orders")
async def create_order(order: OrderRequest, user: dict = Depends(get_current_user)):
    user_data = await db.users.find_one({"email": user["email"]})
    if not user_data or not user_data.get("phone_number"):
        raise HTTPException(status_code=400, detail="Phone number and address are required before placing an order.")

    user_email = user_data["email"]
    user_name = user_data.get("name", "N/A")
    phone_number = user_data["phone_number"]
    address = user_data.get("address", "N/A")
    city = user_data.get("city", "N/A")
    state = user_data.get("state", "N/A")
    pincode = user_data.get("pincode", "N/A")
    
    order_details = []
    total_amount = 0
    
    for item in order.items:
        # Convert string product_id to ObjectId for MongoDB query
        try:
            product_oid = ObjectId(item.product_id)
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid product ID: {item.product_id}")
        
        product = await db.products.find_one({"_id": product_oid})
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        if product["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} unavailable (insufficient stock: {product['stock']})")
        
        item_total = product['price'] * item.quantity
        total_amount += item_total
        
        # Create order with enhanced details
        order_data = {
            "product_id": product_oid,  # Store as ObjectId
            "product_name": product['name'],
            "product_category": product['category'],
            "product_price": product['price'],
            "user_email": user_email,
            "user_name": user_name,
            "phone_number": phone_number,
            "delivery_address": address,
            "city": city,
            "state": state,
            "pincode": pincode,
            "quantity": item.quantity,
            "item_total": item_total,
            "status": "purchased"
        }
        await db.orders.insert_one(order_data)
        
        # Update stock
        await db.products.update_one(
            {"_id": product_oid},
            {"$set": {"stock": product["stock"] - item.quantity}}
        )
        
        # Prepare email details
        order_details.append({
            "name": product['name'],
            "category": product['category'],
            "quantity": item.quantity,
            "price": product['price'],
            "total": item_total
        })
    
    # Send email with enhanced details
    send_order_email(user_email, user_name, phone_number, address, city, state, pincode, order_details, total_amount)
    
    return {"status": "ordered"}

@router.get("/orders/my-orders")
async def get_my_orders(user: dict = Depends(get_current_user)):
    """Get orders for the current logged-in user"""
    orders = await db.orders.find({"user_email": user["email"]}).to_list(100)
    # Convert ObjectId to string and fetch product details
    orders_with_products = []
    for order in orders:
        order['_id'] = str(order['_id'])
        product_id = order['product_id']
        order['product_id'] = str(product_id)
        
        # Fetch product details
        product = await db.products.find_one({"_id": product_id})
        if product:
            order['product_name'] = product.get('name', 'Unknown')
            order['product_price'] = product.get('price', 0)
            order['product_image'] = product.get('image_url', '')
        
        if 'phone_number' in order:
            order['phone_number'] = str(order['phone_number'])
        orders_with_products.append(order)
    return orders_with_products

@router.get("/orders")
async def get_orders(user: dict = Depends(get_admin_user)):
    orders = await db.orders.find().to_list(100)
    # Convert ObjectId to string for JSON serialization and ensure all fields are present
    orders_serializable = []
    for order in orders:
        order['_id'] = str(order['_id'])
        order['product_id'] = str(order['product_id'])
        
        # Ensure all fields are present with defaults
        order['product_name'] = order.get('product_name', 'N/A')
        order['product_category'] = order.get('product_category', 'N/A')
        order['product_price'] = order.get('product_price', 0)
        order['user_name'] = order.get('user_name', 'N/A')
        order['phone_number'] = str(order.get('phone_number', 'N/A'))
        order['delivery_address'] = order.get('delivery_address', 'N/A')
        order['city'] = order.get('city', 'N/A')
        order['state'] = order.get('state', 'N/A')
        order['pincode'] = order.get('pincode', 'N/A')
        order['item_total'] = order.get('item_total', 0)
        
        orders_serializable.append(order)
    return orders_serializable

@router.post("/orders/{order_id}/process")
async def process_order(order_id: str, user: dict = Depends(get_admin_user)):
    try:
        object_id = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID format")

    print(f"Processing order: {order_id}")
    order = await db.orders.find_one({"_id": object_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Ensure all fields are present with defaults for backward compatibility
    order['product_name'] = order.get('product_name', 'N/A')
    order['product_category'] = order.get('product_category', 'N/A')
    order['product_price'] = order.get('product_price', 0)
    order['user_name'] = order.get('user_name', 'N/A')
    order['delivery_address'] = order.get('delivery_address', 'N/A')
    order['city'] = order.get('city', 'N/A')
    order['state'] = order.get('state', 'N/A')
    order['pincode'] = order.get('pincode', 'N/A')
    order['item_total'] = order.get('item_total', order.get('product_price', 0) * order.get('quantity', 0))

    try:
        print(f"Sending processed order email to {order['user_email']}...")
        send_processed_order_email(order['user_email'], order)
        print("Email sent successfully.")
    except Exception as e:
        print(f"Error sending email: {e}")
        if "Username and Password not accepted" in str(e):
            raise HTTPException(status_code=500, detail="Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD (use App Password for Gmail).")
        raise HTTPException(status_code=500, detail=f"Failed to send user notification email: {e}")

    try:
        print("Saving order to Excel...")
        save_order_to_excel(order)
        print("Order saved to Excel successfully.")
    except Exception as e:
        print(f"Error saving to Excel: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save order to Excel: {e}")

    # Delete the processed order from the active collection
    await db.orders.delete_one({"_id": object_id})
    print(f"Order {order_id} processed and removed from active orders.")

    return {"status": "processed", "order_id": order_id}

@router.get("/orders/reports")
async def list_reports(user: dict = Depends(get_admin_user)):
    reports_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'reports'))
    if not os.path.exists(reports_dir):
        return []
    return [f for f in os.listdir(reports_dir) if f.endswith('.xlsx')]

@router.get("/orders/reports/{filename}")
async def download_report(filename: str, user: dict = Depends(get_admin_user)):
    reports_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'reports'))
    file_path = os.path.join(reports_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(file_path, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename=filename)