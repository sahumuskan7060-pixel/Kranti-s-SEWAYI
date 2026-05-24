const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Initialize products (run once)
router.post('/init', async (req, res) => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.json({
        success: false,
        message: 'Products already initialized'
      });
    }

    const products = [
      {
        name: 'Aata Simaiyan',
        description: 'Healthy & 100% Whole Wheat',
        price: 100,
        unit: 'kg',
        category: 'Wheat',
        features: ['100% Pure & Hygienic', 'No Chemicals/Preservatives', 'Pan-India Delivery'],
        inventory: {
          quantity: 100,
          reorderLevel: 20
        }
      },
      {
        name: 'Maida Simaiyan',
        description: 'Soft & Delicious',
        price: 120,
        unit: 'kg',
        category: 'Maida',
        features: ['100% Pure & Hygienic', 'No Chemicals/Preservatives', 'Pan-India Delivery'],
        inventory: {
          quantity: 100,
          reorderLevel: 20
        }
      }
    ];

    await Product.insertMany(products);
    res.json({
      success: true,
      message: 'Products initialized successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
