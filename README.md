# ShopZone - MERN E-Commerce

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Seed the database
```bash
cd backend
node seed.js
# Creates 12 sample products + admin user: admin@shopzone.com / admin123
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173, API at http://localhost:5000

## Features
- Product listing with search, filter by category/price, sort, pagination
- Product detail with image gallery, reviews, ratings
- Shopping cart (persisted per user)
- Checkout with shipping address + payment method selection
- Order tracking with status steps
- User auth (register/login/profile)
- Admin panel: manage products, orders, users, dashboard stats

## Admin Access
Email: admin@shopzone.com  
Password: admin123
