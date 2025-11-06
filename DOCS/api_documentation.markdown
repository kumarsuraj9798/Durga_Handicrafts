# Durga Handicrafts API Documentation

This document outlines the API endpoints for the **Durga Handicrafts** application, a web-based furniture store built with FastAPI, MongoDB, and Cloudinary for image storage. The API supports product management, user authentication via Google OAuth, and order processing. All endpoints are prefixed with `/api`.

## Base URL
```
http://localhost:8000/api
```

## Authentication
Most endpoints require authentication via a JWT token obtained through Google OAuth. The token must be included in the `Authorization` header as `Bearer <token>` for protected routes (e.g., `/products` POST, DELETE). The admin user is restricted to `durgafurniture2412@gmail.com`.

## Endpoints

### 1. Authentication

#### 1.1 Login
Authenticates a user via Google OAuth and returns a JWT token.

- **Endpoint**: `/auth/login`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "credential": "your-google-oauth-token"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "access_token": "jwt-token",
      "token_type": "bearer"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "detail": "Invalid or expired token"
    }
    ```
- **Description**: Verifies the Google OAuth token and returns a JWT token if the user is `durgafurniture2412@gmail.com` (admin) or a registered user.
- **Test Example**:
  ```bash
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"credential": "your-google-oauth-token"}'
  ```

#### 1.2 Get Current User
Retrieves the authenticated user's details.

- **Endpoint**: `/auth/me`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <jwt-token>`
- **Response**:
  - **200 OK**:
    ```json
    {
      "email": "durgafurniture2412@gmail.com",
      "name": "Pratyush Ojha",
      "is_admin": true
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "detail": "Invalid token"
    }
    ```
- **Description**: Returns the current user's details based on the JWT token.
- **Test Example**:
  ```bash
  curl -X GET http://localhost:8000/api/auth/me \
    -H "Authorization: Bearer <jwt-token>"
  ```

### 2. Products

#### 2.1 Add Product
Creates a new product (admin only).

- **Endpoint**: `/products`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: multipart/form-data`
- **Request Body**: Form-data
  - `name`: String (min 3 characters)
  - `category`: String (min 3 characters)
  - `price`: Float (positive number)
  - `stock`: Integer (default 1)
  - `file`: File (image, optional, JPEG/PNG, max 5MB)
- **Request Example** (using `curl`):
  ```bash
  curl -X POST http://localhost:8000/api/products \
    -H "Authorization: Bearer <jwt-token>" \
    -F "name=Wooden Temple Almirah" \
    -F "category=Almirah" \
    -F "price=15000.00" \
    -F "stock=10" \
    -F "file=@/path/to/temple-almirah.jpg"
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "added",
      "product_id": "68e501f5460aa9b0aaf15d12"
    }
    ```
  - **422 Unprocessable Entity** (validation error):
    ```json
    [
      {
        "loc": ["body", "name"],
        "msg": "must be at least 3 characters long (excluding leading/trailing spaces)",
        "type": "value_error"
      }
    ]
    ```
  - **500 Internal Server Error** (Cloudinary or database error):
    ```json
    {
      "detail": "Failed to upload image to Cloudinary: <error>"
    }
    ```
- **Description**: Adds a product to the MongoDB `products` collection. Images are uploaded to Cloudinary, and `image_url` is stored as a Cloudinary URL (e.g., `https://res.cloudinary.com/your-cloud-name/...`). If no image is provided, a default Cloudinary URL is used.
- **Test Notes**:
  - Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `backend/.env`.
  - Only `durgafurniture2412@gmail.com` can access this endpoint.

#### 2.2 Delete Product
Deletes a product by ID (admin only).

- **Endpoint**: `/products/{id}`
- **Method**: DELETE
- **Headers**: 
  - `Authorization: Bearer <jwt-token>`
- **Path Parameters**:
  - `id`: String (MongoDB ObjectId)
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "removed"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "detail": "Product not found"
    }
    ```
- **Description**: Removes a product from the `products` collection by its `_id`.
- **Test Example**:
  ```bash
  curl -X DELETE http://localhost:8000/api/products/68e501f5460aa9b0aaf15d12 \
    -H "Authorization: Bearer <jwt-token>"
  ```

#### 2.3 Get Products
Retrieves a list of products with stock > 0.

- **Endpoint**: `/products`
- **Method**: GET
- **Query Parameters**:
  - `limit`: Integer (default 100, max products to return)
  - `productIds`: List of strings (optional, filter by product IDs)
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "68e501f5460aa9b0aaf15d12",
        "name": "Wooden Temple Almirah",
        "category": "Almirah",
        "image_url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1/durga_furniture/temple-almirah.jpg",
        "price": 15000.0,
        "stock": 10
      }
    ]
    ```
- **Description**: Returns products with stock greater than 0, optionally filtered by `productIds`. The `image_url` is a Cloudinary URL or a default image if invalid.
- **Test Example**:
  ```bash
  curl -X GET http://localhost:8000/api/products?limit=10 \
    -H "Content-Type: application/json"
  ```
  With `productIds`:
  ```bash
  curl -X GET "http://localhost:8000/api/products?productIds=68e501f5460aa9b0aaf15d12&productIds=68e501f5460aa9b0aaf15d13"
  ```

### 3. Orders

#### 3.1 Place Order
Creates a new order with cart items.

- **Endpoint**: `/orders`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product_id": "68e501f5460aa9b0aaf15d12",
        "quantity": 2
      }
    ]
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Order placed successfully!",
      "order_id": "68e502a3460aa9b0aaf15d14"
    }
    ```
  - **400 Bad Request** (e.g., insufficient stock):
    ```json
    {
      "unavailable": ["Product ID 68e501f5460aa9b0aaf15d12 has insufficient stock"],
      "processed": false
    }
    ```
- **Description**: Creates an order in the `orders` collection, checking product availability and updating stock.
- **Test Example**:
  ```bash
  curl -X POST http://localhost:8000/api/orders \
    -H "Authorization: Bearer <jwt-token>" \
    -H "Content-Type: application/json" \
    -d '{"items": [{"product_id": "68e501f5460aa9b0aaf15d12", "quantity": 2}]}'
  ```

## Error Handling
- **401 Unauthorized**: Missing or invalid JWT token.
- **422 Unprocessable Entity**: Invalid request data (e.g., missing fields, invalid image type).
- **500 Internal Server Error**: Server issues (e.g., Cloudinary upload failure, database errors).

## Notes
- **Cloudinary**: Images are stored in the `durga_furniture` folder on Cloudinary. Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are configured in `backend/.env`.
- **MongoDB**: Uses the `durga_furniture` database with `products` and `orders` collections.
- **Admin Access**: Only `durgafurniture2412@gmail.com` can access `/products` POST and DELETE endpoints.
- **Testing**:
  - Use Postman or `curl` with a valid JWT token.
  - Obtain the Google OAuth token via the frontend (`http://localhost:3000/login`).
  - Upload a `default.jpg` to Cloudinary’s `durga_furniture` folder for fallback images.
- **Dependencies**:
  ```bash
  pip install fastapi uvicorn pydantic motor python-dotenv python-jose[cryptography] google-auth-oauthlib python-multipart pillow cloudinary
  ```

## Example Workflow
1. **Login**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"credential": "your-google-oauth-token"}'
   ```
   Copy the `access_token`.

2. **Add Product** (admin only):
   ```bash
   curl -X POST http://localhost:8000/api/products \
     -H "Authorization: Bearer <jwt-token>" \
     -F "name=Wooden Temple Almirah" \
     -F "category=Almirah" \
     -F "price=15000.00" \
     -F "stock=10" \
     -F "file=@/path/to/temple-almirah.jpg"
   ```

3. **Get Products**:
   ```bash
   curl -X GET http://localhost:8000/api/products
   ```

4. **Place Order**:
   ```bash
   curl -X POST http://localhost:8000/api/orders \
     -H "Authorization: Bearer <jwt-token>" \
     -H "Content-Type: application/json" \
     -d '{"items": [{"product_id": "68e501f5460aa9b0aaf15d12", "quantity": 2}]}'
   ```

5. **Delete Product** (admin only):
   ```bash
   curl -X DELETE http://localhost:8000/api/products/68e501f5460aa9b0aaf15d12 \
     -H "Authorization: Bearer <jwt-token>"
   ```