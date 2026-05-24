const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create contact message
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message, type } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact record
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      type: type || 'General'
    });

    await contact.save();

    // Send confirmation email (optional)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `We received your message - ${subject}`,
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you shortly.</p>
          <p><strong>Message Details:</strong></p>
          <p>${message}</p>
          <p>Best regards,<br/>Kranti Sahu's Homemade Simaiyan</p>
        `
      });
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will contact you soon!',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
