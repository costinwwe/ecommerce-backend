# Complete E-Commerce Backend API Documentation

## Base URL
`https://ecommerce-backend-production-ff30.up.railway.app/api`

---

## 🔐 Authentication

### POST /api/auth/login
Admin login
- Body: `{ username, password }`
- Returns: `{ success, token, message }`

---

## 📊 Analytics Dashboard

### GET /api/analytics/dashboard
Get dashboard analytics
- Query: `?period=today|week|month|year`
- Returns: Sales, users, top products, low stock alerts, abandoned carts, sales over time

### GET /api/analytics/revenue
Get revenue breakdown
- Query: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Returns: Revenue by method, status, total transactions

---

## 🛒 Products

### GET /api/products
Get all products (with filters)
- Query: `?category=&featured=&search=&page=&limit=`
- Returns: Paginated products list

### GET /api/products/:id
Get single product

### POST /api/products
Create product
- Body: `{ name, description, price, category, stock, tags[], images[], sku, lowStockThreshold, ... }`

### PUT /api/products/:id
Update product

### DELETE /api/products/:id
Delete product

### GET /api/products/low-stock
Get low stock products

### POST /api/products/bulk-edit
Bulk edit products
- Body: `{ productIds: [], updates: {} }`

### GET /api/products/categories/list
Get all categories

### GET /api/products/tags/list
Get all tags

---

## 👥 Users

### GET /api/users
Get all users

### GET /api/users/:id
Get user details

### GET /api/users/:id/orders
Get user order history

### PUT /api/users/:id/ban
Ban/unban user
- Body: `{ isBanned: true/false }`

### POST /api/users/:id/support-note
Add support note
- Body: `{ note: string }`

---

## 📦 Orders

### GET /api/orders
Get all orders

### GET /api/orders/:id
Get single order

### PUT /api/orders/:id/status
Update order status
- Body: `{ orderStatus: 'pending'|'processing'|'shipped'|'delivered'|'cancelled'|'returned'|'refunded' }`

### PUT /api/orders/:id/cancel
Cancel order

### PUT /api/orders/:id/tracking
Add/update tracking
- Body: `{ trackingNumber, trackingCompany }`

### POST /api/orders/:id/refund
Process refund
- Body: `{ amount, reason }`

### GET /api/orders/:id/invoice
Generate invoice number

---

## 💳 Payments

### GET /api/payments
Get all payments
- Query: `?status=&paymentMethod=&startDate=&endDate=`

### GET /api/payments/failed
Get failed payments

### GET /api/payments/disputes
Get disputed payments

### POST /api/payments/refund
Process refund
- Body: `{ paymentId, amount, reason }`

### GET /api/payments/export
Export financial report
- Query: `?startDate=&endDate=`

---

## 🎟 Coupons

### GET /api/coupons
Get all coupons

### GET /api/coupons/:id
Get single coupon

### POST /api/coupons
Create coupon
- Body: `{ code, name, discountType, discountValue, startDate, endDate, usageLimit, ... }`

### PUT /api/coupons/:id
Update coupon

### DELETE /api/coupons/:id
Delete coupon

### POST /api/coupons/validate
Validate coupon code
- Body: `{ code }`

---

## ⭐ Reviews

### GET /api/reviews
Get all reviews
- Query: `?status=pending|approved|rejected&productId=`

### GET /api/reviews/pending
Get pending reviews

### PUT /api/reviews/:id/approve
Approve review

### PUT /api/reviews/:id/reject
Reject review
- Body: `{ moderationNote }`

### DELETE /api/reviews/:id
Delete review

### POST /api/reviews/:id/reply
Reply to review
- Body: `{ reply }`

---

## ⚙️ Settings

### GET /api/settings
Get all settings

### PUT /api/settings
Update settings
- Body: `{ brand, theme, shipping, tax, payment, email, seo, ... }`

### PUT /api/settings/shipping
Update shipping settings

### PUT /api/settings/tax
Update tax settings

### PUT /api/settings/payment
Update payment settings

---

## 📧 Email Templates

### GET /api/email-templates
Get all templates

### GET /api/email-templates/:id
Get single template

### POST /api/email-templates
Create template
- Body: `{ name, subject, body, type, variables[] }`

### PUT /api/email-templates/:id
Update template

### DELETE /api/email-templates/:id
Delete template

---

## 📝 Activity Logs

### GET /api/activity-logs
Get activity logs
- Query: `?user=&action=&entityType=&entityId=&startDate=&endDate=&page=&limit=`

### GET /api/activity-logs/user/:userId
Get logs for specific user

### GET /api/activity-logs/entity/:type/:id
Get logs for specific entity

---

## 📞 Footer

### GET /api/footer
Get footer information

### PUT /api/footer
Update footer

### PUT /api/footer/contact
Update contact info only

---

## 🎯 Features Implemented

✅ Product Management (add/edit/delete, categories, tags, inventory alerts, bulk edit)
✅ Customer Management (view users, order history, ban users, support notes)
✅ Order Management (status updates, tracking, refunds, invoices, cancel)
✅ Payment & Transactions (tracking, failed payments, disputes, refunds, export)
✅ Analytics Dashboard (sales, users, top products, low stock, abandoned carts)
✅ Discount & Coupon Management (create, validate, track usage)
✅ Website Settings (brand, theme, shipping, tax, payment config)
✅ Reviews & Moderation (approve/reject, reply to reviews)
✅ Email Templates (manage templates for different email types)
✅ Activity Logs (track all admin actions)
✅ Role-Based Access Control (middleware ready)
✅ SEO Support (meta tags in products)

---

## 🚀 Ready for Production

All endpoints are ready to use! The backend supports:
- Full CRUD operations
- Bulk operations
- Analytics and reporting
- Payment processing
- Order management
- User management
- Content moderation
- Settings management

