# E-commerce Backend Server

Backend server for e-commerce website with MongoDB connection.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory and add your MongoDB connection string and admin credentials:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

For MongoDB Atlas (cloud), use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints (Admin Dashboard)

### Base Routes
- `GET /` - Welcome message
- `GET /health` - Health check with database connection status

### User Routes (`/api/users`)
- `GET /api/users` - **Get all users** (View user list in admin dashboard)
  - Returns: Array of all users (without passwords)

### Product Routes (`/api/products`)
- `GET /api/products` - **Get all products** (View product list)
  - Query params: `category`, `featured`, `search`, `page`, `limit`
  - Returns: All products including inactive ones
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - **Create a new product**
  - Body: `{ name, description, price, category, images[], stock, brand?, featured? }`
- `PUT /api/products/:id` - **Update a product**
  - Body: `{ name?, description?, price?, category?, images?, stock?, brand?, featured?, isActive? }`
- `DELETE /api/products/:id` - **Delete a product**
- `GET /api/products/categories/list` - Get all product categories

### Order Routes (`/api/orders`)
- `GET /api/orders` - **Get all orders** (View order list)
  - Returns: All orders with user and product details
- `GET /api/orders/:id` - Get single order details
- `PUT /api/orders/:id/status` - **Update order status**
  - Body: `{ orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }`
- `PUT /api/orders/:id/cancel` - **Cancel an order**
  - Automatically restores product stock if order was paid/processing
  - Returns: Updated order

### Footer Routes (`/api/footer`)
- `GET /api/footer` - Get footer information
- `PUT /api/footer` - **Update footer information**
  - Body: `{ companyName?, description?, contact?, socialMedia?, businessHours?, quickLinks?, copyright? }`
- `PUT /api/footer/contact` - **Update only contact information**
  - Body: `{ email?, phone?, address? }`

## MongoDB Connection

The server automatically connects to MongoDB on startup. Make sure your MongoDB instance is running or your MongoDB Atlas connection string is correct.

## Database Schemas

The following Mongoose schemas are available:

### User Schema
- `name` - User's full name
- `email` - Unique email address
- `password` - User password
- `role` - User role (customer/admin)
- `phone` - Contact phone number
- `address` - Shipping address (street, city, state, zipCode, country)
- `isActive` - Account status
- `timestamps` - createdAt, updatedAt

### Product Schema
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `category` - Product category
- `images` - Array of image URLs
- `stock` - Available stock quantity
- `brand` - Product brand
- `rating` - Average rating (0-5)
- `numReviews` - Number of reviews
- `reviews` - Array of review objects (user, rating, comment)
- `isActive` - Product availability
- `featured` - Featured product flag
- `timestamps` - createdAt, updatedAt

### Cart Schema
- `user` - Reference to User (one cart per user)
- `items` - Array of cart items (product, quantity, price)
- `total` - Calculated total price
- `timestamps` - createdAt, updatedAt

### Order Schema
- `user` - Reference to User
- `orderItems` - Array of order items (product, name, quantity, price, image)
- `shippingAddress` - Shipping address object
- `paymentMethod` - Payment method (credit_card, debit_card, paypal, etc.)
- `paymentResult` - Payment processing result
- `itemsPrice` - Subtotal for items
- `shippingPrice` - Shipping cost
- `taxPrice` - Tax amount
- `totalPrice` - Total order price (calculated)
- `isPaid` - Payment status
- `paidAt` - Payment date
- `isDelivered` - Delivery status
- `deliveredAt` - Delivery date
- `orderStatus` - Order status (pending, processing, shipped, delivered, cancelled)
- `timestamps` - createdAt, updatedAt

### Footer Schema
- `companyName` - Company name
- `description` - Company description
- `contact` - Contact information (email, phone, address)
- `socialMedia` - Social media links (facebook, twitter, instagram, linkedin, youtube)
- `businessHours` - Business hours for each day
- `quickLinks` - Array of quick link objects (title, url)
- `copyright` - Copyright text
- `timestamps` - createdAt, updatedAt

## Using the Models

Import models in your routes:

```javascript
import { User, Product, Cart, Order, Footer } from './models/index.js';
```

Or import individually:

```javascript
import User from './models/User.js';
import Product from './models/Product.js';
```

