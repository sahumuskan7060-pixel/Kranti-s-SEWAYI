const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken');

// Admin Registration (initial setup only)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    const admin = new Admin({
      email,
      password,
      name,
      role: 'Super Admin',
      permissions: [
        'manage_products',
        'manage_orders',
        'manage_users',
        'view_analytics',
        'manage_admins'
      ]
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      data: { id: admin._id, email: admin.email, name: admin.name }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: { id: admin._id, email: admin.email, name: admin.name }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ paymentStatus: 'Completed' });
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'Pending' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]);
    const totalProducts = await Product.countDocuments();
    const totalContacts = await Contact.countDocuments();

    res.json({
      success: true,
      data: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        totalContacts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all orders (admin view)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product inventory
router.put('/products/:id/inventory', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 'inventory.quantity': quantity, 'inventory.lastRestocked': new Date() },
      { new: true }
    );
    res.json({
      success: true,
      message: 'Inventory updated',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
