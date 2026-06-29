const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password
        });

        // Send welcome email
        try {
            const message = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Welcome to MindPulse 🎉</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your account has been created successfully. Welcome to your personalized wellness journey!</p>
                    <p>Start tracking your mental wellness, connect with experts, and explore our calming resources.</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Login Now</a>
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">Need help? Contact us at support@mindpulse.com</p>
                </div>
            `;
            await sendEmail({
                email: user.email,
                subject: 'Welcome to MindPulse 🎉',
                html: message
            });
        } catch (emailErr) {
            console.error('Welcome email could not be sent', emailErr);
        }

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Return a generic response to prevent email enumeration
            return res.status(200).json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">MindPulse Password Reset Request</h2>
                <p>You are receiving this email because you (or someone else) requested to reset a password.</p>
                <p>Please click the button below to reset your password. This link is valid for 15 minutes.</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'MindPulse Password Reset',
                html: message
            });

            res.status(200).json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });
        } catch (err) {
            console.error('Password reset email error', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password is required and must be at least 6 characters' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
