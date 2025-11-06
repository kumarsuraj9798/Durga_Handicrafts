# Durga Handicrafts

Durga Handicrafts is a web-based furniture store application built with a **FastAPI** backend and a **React** frontend. It supports product management, user authentication via Google OAuth, and order processing. The application uses MongoDB for data storage, Cloudinary for image uploads, and Tailwind CSS for a dark-themed, responsive UI. The admin account is restricted to `durgafurniture2412@gmail.com`.

## Features
- **Product Management**: Admins can add, delete, and view products with images stored on Cloudinary.
- **Authentication**: Google OAuth login, with admin access limited to `durgafurniture2412@gmail.com`.
- **Order Processing**: Users can browse products, add to cart, and place orders, with stock validation.
- **Responsive UI**: Dark theme with wooden accents, using Tailwind CSS and Inter font.
- **Image Handling**: Product images stored on Cloudinary, with a fallback image (`fallback-image.jpg`) for errors.

## Tech Stack
- **Backend**: FastAPI, MongoDB, Cloudinary, Python 3.10+
- **Frontend**: React, Tailwind CSS, Axios, Google OAuth
- **Database**: MongoDB (database: `durga_furniture`)
- **Styling**:
  - Colors: `dark-bg` (#1a1a1a), `text-light` (#f5f5f5), `wood-accent` (#8B4513), etc.
  - Font: Inter (via Google Fonts)
  - Responsive: Tailwind classes (`sm:`, `lg:`) for grid layouts and spacing
- **Environment**: Node.js (18.x), npm, Python virtual environment

## Folder Structure
```
Durga-furnitures/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── product.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── orders.py
│   │   │   └── products.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── file_upload.py
│   ├── .env
│   ├── requirements.txt
│   └── test_cloudinary.py
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── favicon.ico
│   │   └── fallback-image.jpg
│   ├── src/
│   │   ├── assets/
│   │   │   └── krishna.png
│   │   ├── components/
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavAuthenticated.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   ├── index.css
│   │   └── tailwind.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
```

## Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **MongoDB**: Running locally on `mongodb://localhost:27017`
- **Cloudinary Account**: For image storage
- **Google OAuth Credentials**: For authentication

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Durga-furnitures
```

### 2. Backend Setup
1. **Navigate to Backend**:
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in `backend/`:
   ```env
   GOOGLE_CLIENT_ID=964672372285-oc9398cg2s1v42o7qnnimh2t63s0vodg.apps.googleusercontent.com
   ADMIN_EMAIL=durgafurniture2412@gmail.com
   JWT_SECRET_KEY=your-secret-key
   MONGO_URI=mongodb://localhost:27017/durga_furniture
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

5. **Run MongoDB**:
   Ensure MongoDB is running:
   ```bash
   mongod
   ```

6. **Run Backend**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend runs on `http://localhost:8000`.

### 3. Frontend Setup
1. **Navigate to Frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Frontend**:
   ```bash
   npm start
   ```
   The frontend runs on `http://localhost:3000`.

### 4. Cloudinary Setup
1. Create a Cloudinary account and obtain `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
2. Upload a default image (`default.jpg`) to the `durga_furniture` folder in Cloudinary.
3. Test Cloudinary upload:
   ```bash
   python backend/test_cloudinary.py
   ```

### 5. MongoDB Setup
1. Connect to MongoDB:
   ```bash
   mongosh
   use durga_furniture
   ```

2. Create indexes:
   ```javascript
   db.products.createIndex({"_id": 1});
   db.products.createIndex({"category": 1});
   db.users.createIndex({"email": 1}, {unique: true});
   db.orders.createIndex({"user_id": 1});
   db.orders.createIndex({"created_at": -1});
   ```

## Database Schema
- **Database**: `durga_furniture`
- **Collections**:
  - **products**:
    ```json
    {
      "_id": ObjectId,
      "name": String,           // Min 3 chars
      "category": String,       // Min 3 chars
      "image_url": String,      // Cloudinary URL
      "price": Number,          // Positive float
      "stock": Number           // Non-negative integer
    }
    ```
  - **users**:
    ```json
    {
      "_id": ObjectId,
      "email": String,          // Unique
      "name": String,
      "is_admin": Boolean       // True for durgafurniture2412@gmail.com
    }
    ```
  - **orders**:
    ```json
    {
      "_id": ObjectId,
      "user_id": ObjectId,
      "items": [
        {
          "product_id": ObjectId,
          "quantity": Number,
          "price": Number
        }
      ],
      "total": Number,
      "created_at": Date
    }
    ```

## API Endpoints
- **Auth**:
  - `POST /api/auth/login`: Authenticate via Google OAuth.
  - `GET /api/auth/me`: Get current user details.
- **Products**:
  - `POST /api/products`: Add product (admin only).
  - `DELETE /api/products/{id}`: Delete product (admin only).
  - `GET /api/products`: List products (public).
- **Orders**:
  - `POST /api/orders`: Place an order.

See `docs/api_documentation.md` for detailed API documentation.

## Styling
- **Colors**:
  - `dark-bg`: #1a1a1a (background)
  - `text-light`: #f5f5f5 (text)
  - `wood-accent`: #8B4513 (buttons, borders)
  - `gray-800`: #2d2d2d (cards)
  - `red-600`: #dc2626 (errors)
  - `green-600`: #16a34a (success)
- **Font**: Inter (via Google Fonts, `fontFamily: ['Inter', 'sans-serif']`)
- **Responsive**: Tailwind classes (`sm:`, `lg:`) for grids and spacing
- **Images**: `krishna.png` (hero), `fallback-image.jpg` (product fallback)

## Testing
1. **Backend**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"credential": "your-google-oauth-token"}'
   curl -X POST http://localhost:8000/api/products -H "Authorization: Bearer <jwt-token>" -F "name=Wooden Temple Almirah" -F "category=Almirah" -F "price=15000.00" -F "stock=10" -F "file=@/path/to/temple-almirah.jpg"
   ```
2. **Frontend**:
   - Visit `http://localhost:3000`.
   - Log in with `durgafurniture2412@gmail.com`.
   - Test adding products in `/admin`, browsing in `/dashboard`, and placing orders in `/cart` and `/checkout`.
3. **MongoDB**:
   ```bash
   mongosh
   use durga_furniture
   db.products.find()
   ```

## Troubleshooting
- **Image Loading Issues**:
  - Check Cloudinary credentials in `backend/.env`.
  - Ensure `fallback-image.jpg` exists in `frontend/public/`.
  - Verify `image_url` in `db.products` (e.g., `https://res.cloudinary.com/...`).
- **Authentication Errors**:
  - Validate `GOOGLE_CLIENT_ID` and `JWT_SECRET_KEY`.
  - Ensure `durgafurniture2412@gmail.com` is used for admin actions.
- **Performance**:
  - Use `loading="lazy"` for images.
  - Test production build: `npm run build && serve -s build`.

## Contributing
- Submit pull requests with clear descriptions.
- Follow the schema in `docs/schema_design.md`.
- Test API endpoints with Postman or `curl`.

## License
This project is for educational purposes and not licensed for commercial use.


### uvicorn app.main:app --reload