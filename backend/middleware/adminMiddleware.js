const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Admin authorization middleware.
 * Must be used AFTER the protect middleware (req.user must exist).
 * Checks if the authenticated user's email matches ADMIN_EMAIL env var.
 */
exports.authorizeAdmin = (req, res, next) => {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: ADMIN_EMAIL not set'
        });
    }

    if (!req.user || req.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admin access only'
        });
    }

    next();
};

/**
 * Combined middleware: authenticate JWT + verify admin.
 * Use this on all /api/admin routes for convenience.
 */
exports.adminProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check admin authorization
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: ADMIN_EMAIL not set'
            });
        }

        if (req.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Admin access only'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};
