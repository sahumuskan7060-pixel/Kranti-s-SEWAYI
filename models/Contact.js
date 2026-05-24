const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
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
    subject: {
      type: String,
      required: [true, 'Subject is required']
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    type: {
      type: String,
      enum: ['General', 'Bulk Order', 'Customization', 'Feedback', 'Support'],
      default: 'General'
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Resolved'],
      default: 'New'
    },
    response: {
      message: String,
      respondedAt: Date,
      respondedBy: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Contact', contactSchema);
