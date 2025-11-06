import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_order_email(user_email: str, user_name: str, phone_number: str, address: str, 
                     city: str, state: str, pincode: str, order_details: list, total_amount: float):
    """Send a detailed order confirmation email to the company email."""
    company_email = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")
    
    if not company_email or not email_password:
        raise Exception("Email configuration missing")

    # Build order items table
    items_text = ""
    for idx, item in enumerate(order_details, 1):
        items_text += f"\n{idx}. Product: {item['name']}"
        items_text += f"\n   Category: {item['category']}"
        items_text += f"\n   Quantity: {item['quantity']}"
        items_text += f"\n   Price per unit: ₹{item['price']:.2f}"
        items_text += f"\n   Subtotal: ₹{item['total']:.2f}\n"

    # Email content with detailed information
    email_body = f"""
╔══════════════════════════════════════════════════════════╗
║          NEW ORDER NOTIFICATION - DURGA HANDICRAFTS       ║
╚══════════════════════════════════════════════════════════╝

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:           {user_name}
Email:          {user_email}
Phone Number:   {phone_number}

DELIVERY ADDRESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address:        {address}
City:           {city}
State:          {state}
Pincode:        {pincode}

ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT:   ₹{total_amount:.2f}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please process this order at your earliest convenience.

This is an automated notification from Durga Handicrafts Order Management System.
"""
    
    msg = MIMEText(email_body)
    msg["Subject"] = f"🛒 New Order from {user_name} - Durga Handicrafts"
    msg["From"] = company_email
    msg["To"] = "opratyush12@gmail.com"  # Hardcoded admin email

    # SMTP configuration (Gmail)
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Enable TLS
            server.login(company_email, email_password)
            server.send_message(msg)
    except Exception as e:
        raise Exception(f"Failed to send email: {str(e)}")

def send_processed_order_email(user_email: str, order_details: dict):
    """Send a detailed email to the user notifying them that their order has been processed."""
    company_email = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")

    if not company_email or not email_password:
        raise Exception("Email configuration missing")

    # Extract order details with defaults
    order_id = str(order_details.get('_id', 'N/A'))
    user_name = order_details.get('user_name', 'Valued Customer')
    product_name = order_details.get('product_name', 'N/A')
    product_category = order_details.get('product_category', 'N/A')
    quantity = order_details.get('quantity', 0)
    product_price = order_details.get('product_price', 0)
    item_total = order_details.get('item_total', 0)
    phone_number = order_details.get('phone_number', 'N/A')
    delivery_address = order_details.get('delivery_address', 'N/A')
    city = order_details.get('city', 'N/A')
    state = order_details.get('state', 'N/A')
    pincode = order_details.get('pincode', 'N/A')

    # Email content with detailed information
    email_body = f"""
╔══════════════════════════════════════════════════════════╗
║       ORDER PROCESSED - DURGA HANDICRAFTS                 ║
╚══════════════════════════════════════════════════════════╝

Dear {user_name},

Great news! Your order has been processed and is on its way!

ORDER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID:       {order_id}

PRODUCT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product Name:   {product_name}
Category:       {product_category}
Quantity:       {quantity}
Price per unit: ₹{product_price:.2f}
Total Amount:   ₹{item_total:.2f}

DELIVERY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact:        {phone_number}
Address:        {delivery_address}
City:           {city}
State:          {state}
Pincode:        {pincode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your order will be delivered to the address mentioned above within 5-7 business days.

If you have any questions or concerns, please don't hesitate to contact us.

Thank you for shopping with Durga Handicrafts!

Best regards,
Durga Handicrafts Team
"""
    
    msg = MIMEText(email_body)
    msg["Subject"] = f"✅ Order #{order_id} Processed - Durga Handicrafts"
    msg["From"] = company_email
    msg["To"] = user_email

    # SMTP configuration (Gmail)
    # Let exceptions propagate to be handled by the caller
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(company_email, email_password)
        server.send_message(msg)