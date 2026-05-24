const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      enum: ['Aata Simaiyan', 'Maida Simaiyan']
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    unit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'piece', 'dozen']
    },
    category: {
      type: String,
      enum: ['Wheat', 'Maida'],
      required: true
    },
    image: {
      type: String,
      default: null
    },
    features: [{
      type: String
    }],
    inventory: {
      quantity: {
        type: Number,
        default: 100,
        min: 0
      },
      reorderLevel: {
        type: Number,
        default: 20
      },
      lastRestocked: {
        type: Date,
        default: Date.now
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      average: {
        type: Number,
        default: 5,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
