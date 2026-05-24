# Frontend & Backend Integration Guide

## 🎯 Overview

This document provides complete instructions for integrating the TanStack Start frontend with the Node.js/Express backend for Kranti Sahu's Homemade Simaiyan.

## 📁 Project Structure

Your repository now contains both frontend and backend:

```
Kranti-s-SEWAYI/
├── Backend (Node.js/Express)
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Contact.js
│   │   └── Admin.js
│   └── routes/
│       ├── products.js
│       ├── orders.js
│       ├── contact.js
│       ├── payment.js
│       └── admin.js
└── Frontend (TanStack Start/React 19)
    ├── src/
    │   ├── lib/
    │   │   └── api.ts          # 🆕 API client
    │   ├── hooks/
    │   │   ├── useProducts.ts  # 🆕 Product fetching hook
    │   │   ├── useOrder.ts     # 🆕 Order creation hook
    │   │   ├── useContact.ts   # 🆕 Contact form hook
    │   │   └── usePayment.ts   # 🆕 Payment hook
    │   ├── components/
    │   ├── routes/
    │   └── ...
    ├── .env.example            # 🆕 Frontend env config
    ├── package.json
    └── ...
```

## 🚀 Setup Instructions

### Step 1: Backend Setup

#### 1.1 Install Backend Dependencies
```bash
cd Kranti-s-SEWAYI
npm install
```

#### 1.2 Configure Backend Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (use local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/kranti-simaiyan
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kranti-simaiyan

# JWT
JWT_SECRET=your_super_secret_key_here

# Razorpay (for GPay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (for notifications)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# CORS (Frontend URLs)
CORS_ORIGIN=http://localhost:3000,http://localhost:8888,https://your-netlify-domain.netlify.app

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 1.3 Start Backend Server
```bash
npm run dev
```

You should see:
```
🚀 Kranti Simaiyan Backend Server running on port 5000
📍 Environment: development
🏪 Business: Kranti Sahu's Homemade Simaiyan
```

#### 1.4 Initialize Products (One-time)

Once the server is running, initialize the default products:

```bash
curl http://localhost:5000/api/products/init
```

You should get a response like:
```json
{
  "success": true,
  "message": "Products initialized successfully",
  "data": [
    {
      "_id": "...",
      "name": "Aata Simaiyan",
      "price": 100,
      "description": "Healthy & 100% Whole Wheat"
    },
    {
      "_id": "...",
      "name": "Maida Simaiyan",
      "price": 120,
      "description": "Soft & Delicious"
    }
  ]
}
```

### Step 2: Frontend Setup

#### 2.1 Configure Frontend Environment

Create `.env.local` in your frontend root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API Configuration
# For local development:
VITE_API_URL=http://localhost:5000/api

# For production (after deployment):
# VITE_API_URL=https://your-backend-domain.com/api

# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Business Info
VITE_BUSINESS_PHONE=8299647742
VITE_BUSINESS_WHATSAPP=https://wa.me/918299647742
VITE_APP_NAME=Kranti Sahu's Homemade Simaiyan
```

#### 2.2 Install Frontend Dependencies

```bash
npm install
# or
pnpm install
```

#### 2.3 Start Frontend Dev Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173` or `http://localhost:3000`

## 📡 Using the API in Components

### Example 1: Fetching Products

```typescript
import { useProducts } from '@/hooks/useProducts';

export function ProductList() {
  const { products, loading, error, refetch } = useProducts();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}/{product.unit}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Creating an Order

```typescript
import { useOrder } from '@/hooks/useOrder';

export function CheckoutForm() {
  const { loading, error, success, order, createOrder } = useOrder();

  const handleCheckout = async () => {
    const orderData = {
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: {
          street: '123 Main St',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
        },
      },
      items: [
        { product: 'PRODUCT_ID', quantity: 2 },
      ],
      paymentMethod: 'GPay',
    };

    const newOrder = await createOrder(orderData);
    if (newOrder) {
      console.log('Order created:', newOrder.orderNumber);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Place Order'}
    </button>
  );
}
```

### Example 3: Submitting Contact Form

```typescript
import { useContact } from '@/hooks/useContact';
import { useState } from 'react';

export function ContactForm() {
  const { loading, error, success, submitContact } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitContact(formData);
    if (result) {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Message sent!</p>}
    </form>
  );
}
```

### Example 4: Processing Payment

```typescript
import { usePayment } from '@/hooks/usePayment';

export function PaymentButton({ orderId, amount }: { orderId: string; amount: number }) {
  const { loading, error, createPaymentOrder, verifyPayment } = usePayment();

  const handlePayment = async () => {
    // Create payment order
    const paymentOrderId = await createPaymentOrder(orderId, amount);
    if (!paymentOrderId) return;

    // Initialize Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      name: 'Kranti Sahu\'s Homemade Simaiyan',
      description: 'Order Payment',
      order_id: paymentOrderId,
      handler: async (response: any) => {
        // Verify payment
        const verified = await verifyPayment(
          paymentOrderId,
          response.razorpay_payment_id,
          response.razorpay_signature,
          orderId
        );
        if (verified) {
          alert('Payment successful!');
        }
      },
    };

    const Razorpay = (window as any).Razorpay;
    const razorpay = new Razorpay(options);
    razorpay.open();
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
}
```

## 🌐 Deployment

### Backend Deployment (Heroku / Railway / Render)

#### Option 1: Railway.app (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables from your `.env` file
4. Deploy automatically

#### Option 2: Render.com

1. Create new Web Service on [Render.com](https://render.com)
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

#### Option 3: Heroku

```bash
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set RAZORPAY_KEY_ID=your_key
heroku config:set RAZORPAY_KEY_SECRET=your_secret
git push heroku main
```

### Frontend Deployment (Netlify)

1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist/client`
5. Add environment variables in Netlify dashboard:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_RAZORPAY_KEY_ID=your_key
   ```
6. Deploy

## 🔧 Troubleshooting

### CORS Errors

If you get CORS errors:

1. Check backend `.env` CORS_ORIGIN includes your frontend URL
2. Restart backend server
3. Clear browser cache

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://your-frontend-domain.com
```

### API Connection Issues

1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check VITE_API_URL in frontend `.env.local`
3. Ensure MongoDB is running (if using local)

### Payment Not Working

1. Verify Razorpay keys are correct
2. Check test mode is enabled in Razorpay dashboard
3. Use test card: 4111111111111111

## 📚 API Reference

### Products

```typescript
import { productApi } from '@/lib/api';

// Get all products
await productApi.getAll();

// Get single product
await productApi.getById(productId);
```

### Orders

```typescript
import { orderApi } from '@/lib/api';

// Create order
await orderApi.create(orderData);

// Get all orders
await orderApi.getAll(page, limit);

// Get single order
await orderApi.getById(orderId);

// Update order status
await orderApi.updateStatus(orderId, status);
```

### Contacts

```typescript
import { contactApi } from '@/lib/api';

// Submit contact form
await contactApi.submit(contactData);
```

### Payments

```typescript
import { paymentApi } from '@/lib/api';

// Create payment order
await paymentApi.createOrder(orderId, amount);

// Verify payment
await paymentApi.verify(razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId);
```

## ✨ Features Ready to Use

✅ Product listing with real-time data
✅ Shopping cart & checkout
✅ GPay/Razorpay payment integration
✅ Order tracking
✅ Contact form with email notifications
✅ Admin dashboard (backend ready)
✅ Inventory management
✅ Pan-India delivery support
✅ Bulk order handling
✅ WhatsApp integration

## 📞 Support

- **WhatsApp:** 8299647742
- **Business:** Kranti Sahu's Homemade Simaiyan
- **Address:** Sharda Hills Colony (Ganesh Apartment)

## 🎉 You're All Set!

Your frontend and backend are now fully integrated! Start building amazing features for Kranti Sahu's Homemade Simaiyan! 🚀
