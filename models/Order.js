const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required']
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
          type: String,
          default: 'India'
        }
      }
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: Number,
        subtotal: Number
      }
    ],
    totals: {
      subtotal: {
        type: Number,
        default: 0
      },
      tax: {
        type: Number,
        default: 0
      },
      shipping: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        required: true
      }
    },
    paymentMethod: {
      type: String,
      enum: ['GPay', 'Razorpay', 'UPI', 'Bank Transfer', 'Cash on Delivery'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    paymentId: String,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    notes: String,
    isCustomOrder: {
      type: Boolean,
      default: false
    },
    bulkOrder: {
      type: Boolean,
      default: false
    },
    bulkQuantity: Number
  },
  {
    timestamps: true
  }
);

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `KS-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
