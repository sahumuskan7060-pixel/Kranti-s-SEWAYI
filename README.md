# Kranti Sahu's Homemade Simaiyan - Backend API

## 🏪 Business Overview
A comprehensive backend API for **Kranti Sahu's Homemade Simaiyan**, a premium homemade wheat noodle business offering:
- **Aata Simaiyan** (Healthy & 100% Whole Wheat) - ₹100/kg
- **Maida Simaiyan** (Soft & Delicious) - ₹120/kg

## 🚀 Features

### Core Functionality
- ✅ Product Management (Aata & Maida Simaiyan)
- ✅ Order Management System
- ✅ Customer Contact Form
- ✅ Payment Integration (Razorpay/GPay)
- ✅ Admin Dashboard
- ✅ Inventory Tracking
- ✅ Bulk Order Support
- ✅ Email Notifications
- ✅ Pan-India Delivery Support

## 📋 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment:** Razorpay (GPay/UPI)
- **Email:** Nodemailer
- **Validation:** Joi, Express Validator

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Razorpay Account (for payments)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahumuskan7060-pixel/Kranti-s-SEWAYI.git
   cd Kranti-s-SEWAYI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/kranti-simaiyan
   JWT_SECRET=your_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Start the server**
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

## 📚 API Endpoints

### Products
```
GET    /api/products              - Get all products
GET    /api/products/:id          - Get single product
POST   /api/products/init         - Initialize default products
```

### Orders
```
POST   /api/orders/create         - Create new order
GET    /api/orders                - Get all orders (paginated)
GET    /api/orders/:id            - Get single order
PUT    /api/orders/:id/status     - Update order status
```

### Contact
```
POST   /api/contact/submit        - Submit contact form
GET    /api/contact               - Get all contacts (admin)
```

### Payment
```
POST   /api/payment/create-order  - Create payment order
POST   /api/payment/verify        - Verify payment
```

### Admin
```
POST   /api/admin/register        - Register admin (first time only)
POST   /api/admin/login           - Admin login
GET    /api/admin/dashboard/stats - Get dashboard statistics
GET    /api/admin/orders          - Get all orders
PUT    /api/admin/products/:id/inventory - Update inventory
```

## 🛠️ Database Schema

### Product
```javascript
{
  name: String (Aata Simaiyan | Maida Simaiyan),
  description: String,
  price: Number,
  unit: String (kg, piece, dozen),
  category: String,
  features: [String],
  inventory: {
    quantity: Number,
    reorderLevel: Number,
    lastRestocked: Date
  },
  rating: {
    average: Number,
    count: Number
  }
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  customer: {
    name: String,
    email: String,
    phone: String,
    address: { street, city, state, zipCode, country }
  },
  items: [{
    product: ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totals: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number
  },
  paymentMethod: String,
  paymentStatus: String,
  status: String,
  isCustomOrder: Boolean,
  bulkOrder: Boolean
}
```

## 🔐 Admin Dashboard

### Initial Setup
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kranti-simaiyan.com",
    "password": "secure_password",
    "name": "Kranti Sahu"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kranti-simaiyan.com",
    "password": "secure_password"
  }'
```

### Dashboard Stats
```bash
curl http://localhost:5000/api/admin/dashboard/stats
```

## 📞 Contact Information

- **Business Name:** Kranti Sahu's Homemade Simaiyan
- **Address:** Sharda Hills Colony (Ganesh Apartment)
- **Phone:** 8299647742 (WhatsApp)
- **Service:** Pan-India Delivery

## 🎯 Business Highlights

✨ **100% Pure & Hygienic** - Made with pure ingredients
✨ **No Chemicals/Preservatives** - Natural goodness
✨ **Pan-India Delivery** - Delivered across India
✨ **Custom Orders** - Bulk orders and customization available
✨ **WhatsApp Support** - Easy ordering via WhatsApp

## 📄 License

MIT License - Feel free to use this for your business!

## 🤝 Support

For issues, feature requests, or contributions, please reach out via WhatsApp: **8299647742**

---

**Made with ❤️ for Kranti Sahu's Homemade Simaiyan**
