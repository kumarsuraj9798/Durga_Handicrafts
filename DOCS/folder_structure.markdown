# Durga Handicrafts Project Folder Structure

This document outlines the complete folder structure for the **Durga Handicrafts** project, including both the backend (FastAPI, MongoDB, Cloudinary) and frontend (React, Tailwind CSS, Google OAuth). It also details the styling configuration, including colors, fonts, and other visual elements used in the frontend. The structure supports product management, user authentication, and order processing, with a single admin (`durgafurniture2412@gmail.com`) and a hero image (`krishna.png`).

## Project Root
```
Durga-furnitures/
├── backend/
└── frontend/
```

## Styling Configuration
The frontend uses **Tailwind CSS** for styling, with a custom theme defined in `frontend/src/tailwind.config.js`. Below are the key styling details:

### Colors
Custom colors are defined in `tailwind.config.js` to match the furniture store's aesthetic, emphasizing a dark, elegant theme with wooden accents:
- **`dark-bg`**: `#1a1a1a` (dark charcoal, used for page backgrounds)
- **`text-light`**: `#f5f5f5` (off-white, used for primary text)
- **`wood-accent`**: `#8B4513` (saddle brown, used for buttons, borders, and accents)
- **`gray-800`**: `#2d2d2d` (dark gray, used for card backgrounds)
- **`gray-600`**: `#4b4b4b` (medium gray, used for secondary buttons)
- **`gray-400`**: `#a0a0a0` (light gray, used for secondary text)
- **`red-600`**: `#dc2626` (red, used for error messages)
- **`green-600`**: `#16a34a` (green, used for success messages)

### Fonts
- **Primary Font**: `'Inter', sans-serif`
  - Used across all components for a clean, modern look.
  - Imported via Google Fonts in `index.html` or `index.css`.
  - Configured in `tailwind.config.js` under `fontFamily.sans`.
- **Font Sizes**:
  - Headings: `text-2xl` (1.5rem), `text-3xl` (1.875rem) for page titles.
  - Body Text: `text-base` (1rem) or `text-sm` (0.875rem) for smaller text.
  - Buttons: `text-sm` (0.875rem) or `text-base` (1rem).
- **Font Weights**:
  - `font-semibold` (600) for headings and buttons.
  - `font-normal` (400) for body text.

### Other Styling
- **Borders**: `border-wood-accent` (1px solid `#8B4513`) for cards and inputs.
- **Shadows**: `shadow-md` for cards to add depth.
- **Transitions**: `transition` and `hover:bg-opacity-80` for buttons to enhance interactivity.
- **Image Handling**:
  - Product images: `object-cover` with fixed sizes (`h-48` for cards, `h-24` for cart/checkout).
  - Fallback image: `fallback-image.jpg` in `public/` for missing `image_url`.
  - Hero image: `krishna.png` in `src/assets/` for `Home.jsx`.
- **Responsive Design**:
  - Tailwind’s responsive classes (`sm:`, `lg:`) for grid layouts (e.g., `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
  - Padding/margins adjust based on screen size (`px-4`, `py-6`, `max-w-screen-xl`).
- **Dark Theme**: Consistent dark theme with `bg-dark-bg` and `text-text-light` for all pages.

## Backend Folder Structure
The backend is a FastAPI application located at `C:\Users\Pratyush Ojha\Documents\projects\Durga-furnitures\backend`. It uses MongoDB for data storage and Cloudinary for image uploads.

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── product.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── orders.py
│   │   └── products.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── file_upload.py
├── .env
├── requirements.txt
└── test_cloudinary.py
```

### Backend File Descriptions
- **app/__init__.py**: Empty file to mark `app` as a Python package.
- **app/main.py**: Entry point for FastAPI, mounts routers for auth, products, and orders.
- **app/database.py**: Configures MongoDB connection using `motor` for async operations.
- **app/models/product.py**: Defines the `Product` Pydantic model (`name`, `category`, `image_url`, `price`, `stock`).
- **app/routes/auth.py**: Handles Google OAuth login (`/auth/login`) and user info (`/auth/me`).
- **app/routes/orders.py**: Manages order creation (`/orders` POST).
- **app/routes/products.py**: Handles product CRUD (`/products` POST, GET, DELETE).
- **app/utils/auth.py**: JWT token validation and Google OAuth verification.
- **app/utils/file_upload.py**: Cloudinary image upload logic.
- **.env**: Environment variables:
  ```env
  GOOGLE_CLIENT_ID=964672372285-oc9398cg2s1v42o7qnnimh2t63s0vodg.apps.googleusercontent.com
  ADMIN_EMAIL=durgafurniture2412@gmail.com
  JWT_SECRET_KEY=your-secret-key
  MONGO_URI=mongodb://localhost:27017/durga_furniture
  CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_API_KEY=your-api-key
  CLOUDINARY_API_SECRET=your-api-secret
  ```
- **requirements.txt**: Lists dependencies:
  ```text
  fastapi
  uvicorn
  pydantic
  motor
  python-dotenv
  python-jose[cryptography]
  google-auth-oauthlib
  python-multipart
  pillow
  cloudinary
  ```
- **test_cloudinary.py**: Script to test Cloudinary uploads.

## Frontend Folder Structure
The frontend is a React application located at `C:\Users\Pratyush Ojha\Documents\projects\Durga-furnitures\frontend`. It uses Tailwind CSS for styling and Google OAuth for authentication.

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── fallback-image.jpg
├── src/
│   ├── assets/
│   │   └── krishna.png
│   ├── components/
│   │   ├── FeaturedProducts.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── NavAuthenticated.jsx
│   │   └── Testimonials.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.js
│   ├── index.css
│   └── tailwind.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Frontend File Descriptions
- **public/index.html**: HTML template with Google Fonts (`Inter`):
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  ```
- **public/manifest.json**: Web app manifest for browser metadata.
- **public/favicon.ico**: Favicon for the app.
- **public/fallback-image.jpg**: Fallback image for products when `image_url` fails (recommended <100KB).
- **src/assets/krishna.png**: Hero image for `Home.jsx`.
- **src/components/FeaturedProducts.jsx**: Displays featured products with images, names, categories, and prices.
- **src/components/Footer.jsx**: Footer with contact info and links, styled with `bg-dark-bg` and `text-light`.
- **src/components/Hero.jsx**: Hero section with `krishna.png` and call-to-action.
- **src/components/Navbar.jsx**: Navigation for unauthenticated users.
- **src/components/NavAuthenticated.jsx**: Navigation for authenticated users (in `components/` as requested).
- **src/components/Testimonials.jsx**: Customer testimonials on the home page.
- **src/context/CartContext.jsx**: Manages cart state using React Context.
- **src/pages/Admin.jsx**: Admin panel for product management (restricted to `durgafurniture2412@gmail.com`).
- **src/pages/Cart.jsx**: Displays cart items with images and checkout button.
- **src/pages/Checkout.jsx**: Handles order placement with order summary.
- **src/pages/Dashboard.jsx**: Lists all products with images and add-to-cart buttons.
- **src/pages/Home.jsx**: Landing page with hero, featured products, and testimonials.
- **src/pages/Login.jsx**: Google OAuth login page.
- **src/services/api.js**: Axios setup for API requests (e.g., `http://localhost:8000/api`).
- **src/App.jsx**: Defines routes (`/`, `/login`, `/dashboard`, `/cart`, `/checkout`, `/admin`).
- **src/index.js**: Renders the React app.
- **src/index.css**: Global CSS (if needed, minimal due to Tailwind):
  ```css
  body {
    font-family: 'Inter', sans-serif;
  }
  ```
- **src/tailwind.config.js**: Tailwind configuration:
  ```js
  module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          'dark-bg': '#1a1a1a',
          'text-light': '#f5f5f5',
          'wood-accent': '#8B4513',
          'gray-800': '#2d2d2d',
          'gray-600': '#4b4b4b',
          'gray-400': '#a0a0a0',
          'red-600': '#dc2626',
          'green-600': '#16a34a',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  ```
- **package.json**: Lists dependencies:
  ```json
  {
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.14.0",
      "axios": "^1.4.0",
      "@react-oauth/google": "^0.11.0",
      "tailwindcss": "^3.3.3"
    },
    "devDependencies": {
      "@vitejs/plugin-react": "^4.0.0",
      "vite": "^4.3.9"
    }
  }
  ```
- **package-lock.json**: Locks dependency versions.
- **.gitignore**: Ignores `node_modules`, `build`, `.env`.
- **README.md**: Project setup instructions.

## Notes
- **Backend**:
  - Runs on `http://localhost:8000`.
  - Requires MongoDB (`mongodb://localhost:27017/durga_furniture`) and Cloudinary credentials.
  - Admin endpoints (`/products` POST, DELETE) restricted to `durgafurniture2412@gmail.com`.
  - Images stored in Cloudinary’s `durga_furniture` folder with a default image (`default.jpg`).

- **Frontend**:
  - Runs on `http://localhost:3000`.
  - Uses Tailwind CSS with a dark theme and wooden accents.
  - `krishna.png` in `src/assets/` for the hero section.
  - `fallback-image.jpg` in `public/` for missing product images.
  - Fonts (`Inter`) loaded via Google Fonts for consistency.
  - Responsive design with Tailwind’s `sm:` and `lg:` prefixes.

- **Styling Integration**:
  - Consistent dark theme across all pages (`bg-dark-bg`, `text-text-light`).
  - Buttons use `wood-accent` for a furniture-inspired look.
  - Error/success messages use `red-600` and `green-600` for visibility.
  - Images are optimized with `object-cover` and `loading="lazy"`.

- **Testing**:
  - Backend: Test with `curl` or Postman (see API documentation).
  - Frontend: Verify pages and styling at `http://localhost:3000`.
  - MongoDB: Ensure `products` collection has valid `image_url` (Cloudinary URLs).
  - Check browser console (F12) for image loading errors.

- **Setup**:
  - Backend:
    ```bash
    cd C:\Users\Pratyush Ojha\Documents\projects\Durga-furnitures\backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
  - Frontend:
    ```bash
    cd C:\Users\Pratyush Ojha\Documents\projects\Durga-furnitures\frontend
    npm install
    npm start
    ```