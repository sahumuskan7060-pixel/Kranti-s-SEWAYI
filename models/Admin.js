const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Manager'],
      default: 'Admin'
    },
    permissions: [{
      type: String,
      enum: [
        'manage_products',
        'manage_orders',
        'manage_users',
        'view_analytics',
        'manage_admins'
      ]
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
