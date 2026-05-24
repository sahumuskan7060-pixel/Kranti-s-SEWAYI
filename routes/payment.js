const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totals.total * 100), // Amount in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email
      }
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'Completed',
        paymentId: razorpayPaymentId,
        status: 'Confirmed'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
