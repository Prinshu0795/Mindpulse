const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        const contactMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            data: contactMessage
        });
    } catch (error) {
        console.error('Error saving contact message:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
