const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
