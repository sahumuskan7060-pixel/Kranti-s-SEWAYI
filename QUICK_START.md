# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas account)
- Git

### Backend Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Edit .env with your configuration
# Minimum required:
# MONGODB_URI=mongodb://localhost:27017/kranti-simaiyan
# CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# 4. Start server
npm run dev
```

Backend running at: `http://localhost:5000`

### Initialize Products

```bash
curl http://localhost:5000/api/products/init
```

### Frontend Setup

```bash
# In a new terminal
# 1. Create .env.local
cp .env.example .env.local

# 2. Edit .env.local
# VITE_API_URL=http://localhost:5000/api

# 3. Install and run
npm install
npm run dev
```

Frontend running at: `http://localhost:5173` or `http://localhost:3000`

## 🧪 Test the Integration

### Test Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "business": "Kranti Sahu's Homemade Simaiyan"
}
```

### Test Product API

```bash
curl http://localhost:5000/api/products
```

You should see both products: Aata Simaiyan (₹100) and Maida Simaiyan (₹120)

### Test Frontend API Connection

In your React component:

```typescript
import { useProducts } from '@/hooks/useProducts';

export function TestComponent() {
  const { products, loading, error } = useProducts();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {products.map((p) => (
        <p key={p._id}>{p.name} - ₹{p.price}</p>
      ))}
    </div>
  );
}
```

If you see the products, the integration is working! ✅

## 📋 Common Commands

### Backend

```bash
npm run dev       # Development with hot reload
npm start         # Production
npm test          # Run tests
```

### Frontend

```bash
npm run dev       # Development
npm run build     # Production build
npm run preview   # Preview production build
```

## 🆘 Common Issues

### "Cannot GET /api/products"
- Backend not running
- MongoDB not connected
- Check console for errors

### "CORS error" in browser console
- Update CORS_ORIGIN in backend .env
- Restart backend server
- Clear browser cache

### "Failed to fetch products" in frontend
- Check VITE_API_URL in .env.local
- Verify backend is running on port 5000
- Check network tab in DevTools

## ✅ Next Steps

1. Review [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for detailed guide
2. Create pages for products, checkout, orders
3. Implement payment flow
4. Add contact form
5. Deploy to Netlify + Railway/Render

## 🎯 Feature Checklist

- [ ] Products displaying from API
- [ ] Create order functionality
- [ ] Payment integration
- [ ] Contact form working
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Deployed to production

Happy coding! 🚀
