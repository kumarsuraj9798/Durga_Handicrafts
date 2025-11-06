import pandas as pd
import os
from datetime import datetime

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'reports'))

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

def save_order_to_excel(order: dict):
    """Saves a processed order with comprehensive details to a monthly Excel file."""
    now = datetime.now()
    month_str = now.strftime("%Y-%m")
    file_path = os.path.join(REPORTS_DIR, f"orders_{month_str}.xlsx")

    # Prepare the new order data with all detailed fields
    order_data = {
        "Order ID": [str(order.get('_id', 'N/A'))],
        "Processed At": [now.strftime("%Y-%m-%d %H:%M:%S")],
        "Status": [order.get('status', 'N/A')],
        
        # Customer Information
        "Customer Name": [order.get('user_name', 'N/A')],
        "Customer Email": [order.get('user_email', 'N/A')],
        "Phone Number": [order.get('phone_number', 'N/A')],
        
        # Product Information
        "Product ID": [str(order.get('product_id', 'N/A'))],
        "Product Name": [order.get('product_name', 'N/A')],
        "Category": [order.get('product_category', 'N/A')],
        "Price per Unit": [order.get('product_price', 0)],
        "Quantity": [order.get('quantity', 0)],
        "Item Total": [order.get('item_total', 0)],
        
        # Delivery Information
        "Delivery Address": [order.get('delivery_address', 'N/A')],
        "City": [order.get('city', 'N/A')],
        "State": [order.get('state', 'N/A')],
        "Pincode": [order.get('pincode', 'N/A')]
    }
    new_df = pd.DataFrame(order_data)

    # Read existing file or create a new DataFrame
    if os.path.exists(file_path):
        try:
            existing_df = pd.read_excel(file_path)
            updated_df = pd.concat([existing_df, new_df], ignore_index=True)
        except Exception as e:
            # Handle corrupted file by starting fresh
            print(f"Warning: Could not read {file_path}, creating a new one. Error: {e}")
            updated_df = new_df
    else:
        updated_df = new_df

    # Save the updated DataFrame to the Excel file with auto-adjusted column widths
    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        updated_df.to_excel(writer, index=False, sheet_name='Orders')
        
        # Auto-adjust column widths
        worksheet = writer.sheets['Orders']
        for idx, col in enumerate(updated_df.columns):
            max_length = max(
                updated_df[col].astype(str).apply(len).max(),
                len(col)
            ) + 2
            worksheet.column_dimensions[chr(65 + idx)].width = min(max_length, 50)
