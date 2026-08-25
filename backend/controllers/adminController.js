const User = require('../models/User');
const Assessment = require('../models/Assessment');
const MentalAssessment = require('../models/MentalAssessment');
const DailyCheckIn = require('../models/DailyCheckIn');
const ContactMessage = require('../models/ContactMessage');
const mongoose = require('mongoose');

// ─── Helper ───────────────────────────────────────────────────────────────────
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // Counts
        const [totalUsers, totalAssessments, totalMentalAssessments, totalCheckIns, totalContacts] = await Promise.all([
            User.countDocuments(),
            Assessment.countDocuments(),
            MentalAssessment.countDocuments(),
            DailyCheckIn.countDocuments(),
            ContactMessage.countDocuments()
        ]);

        // Recent records
        const [recentUsers, recentAssessments, recentMentalAssessments, recentCheckIns, recentContacts] = await Promise.all([
            User.find().sort({ created_at: -1 }).limit(5).select('-password'),
            Assessment.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            MentalAssessment.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            DailyCheckIn.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            ContactMessage.find().sort({ createdAt: -1 }).limit(5)
        ]);

        // Users registered per day (last 30 days) for chart
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const userRegistrationTrend = await User.aggregate([
            { $match: { created_at: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Assessment types distribution
        const assessmentTypeDistribution = await MentalAssessment.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Mood distribution from check-ins
        const moodDistribution = await DailyCheckIn.aggregate([
            {
                $group: {
                    _id: '$mood',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    totalUsers,
                    totalAssessments,
                    totalMentalAssessments,
                    totalCheckIns,
                    totalContacts
                },
                recentUsers,
                recentAssessments,
                recentMentalAssessments,
                recentCheckIns,
                recentContacts,
                charts: {
                    userRegistrationTrend,
                    assessmentTypeDistribution,
                    moodDistribution
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all users (paginated, searchable, sortable)
// @route   GET /api/admin/users
// @access  Admin
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const sortField = req.query.sortField || 'created_at';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Build search filter
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password')
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        // Enrich users with counts
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                const [assessmentCount, mentalAssessmentCount, checkInCount] = await Promise.all([
                    Assessment.countDocuments({ user: user._id }),
                    MentalAssessment.countDocuments({ user: user._id }),
                    DailyCheckIn.countDocuments({ user: user._id })
                ]);
                return {
                    ...user.toObject(),
                    assessmentCount,
                    mentalAssessmentCount,
                    checkInCount,
                    totalActivityCount: assessmentCount + mentalAssessmentCount + checkInCount
                };
            })
        );

        res.status(200).json({
            success: true,
            data: enrichedUsers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single user by ID with all related data
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch all related data
        const [assessments, mentalAssessments, dailyCheckIns, contactMessages] = await Promise.all([
            Assessment.find({ user: user._id }).sort({ createdAt: -1 }),
            MentalAssessment.find({ user: user._id }).sort({ completedAt: -1 }),
            DailyCheckIn.find({ user: user._id }).sort({ createdAt: -1 }),
            ContactMessage.find({ email: user.email }).sort({ createdAt: -1 })
        ]);

        res.status(200).json({
            success: true,
            data: {
                user,
                assessments,
                mentalAssessments,
                dailyCheckIns,
                contactMessages
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Only allow updating name and email
        const { name, email } = req.body;
        const updateData = {};
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: 'Name cannot be empty' });
            }
            updateData.name = name.trim();
        }
        if (email !== undefined) {
            if (!email.trim()) {
                return res.status(400).json({ success: false, message: 'Email cannot be empty' });
            }
            // Check for duplicate email
            const existing = await User.findOne({ email: email.trim(), _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email already in use by another user' });
            }
            updateData.email = email.trim();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete user and all related data
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Cannot delete the admin account' });
        }

        // Cascade delete all related data
        await Promise.all([
            Assessment.deleteMany({ user: user._id }),
            MentalAssessment.deleteMany({ user: user._id }),
            DailyCheckIn.deleteMany({ user: user._id }),
            User.findByIdAndDelete(user._id)
        ]);

        res.status(200).json({
            success: true,
            message: 'User and all related data deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT MESSAGE (QUERY) MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all contact messages (paginated, searchable)
// @route   GET /api/admin/contacts
// @access  Admin
exports.getContactMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const [messages, total] = await Promise.all([
            ContactMessage.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit),
            ContactMessage.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single contact message
// @route   GET /api/admin/contacts/:id
// @access  Admin
exports.getContactMessageById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID' });
        }
        const message = await ContactMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }
        res.status(200).json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update contact message
// @route   PUT /api/admin/contacts/:id
// @access  Admin
exports.updateContactMessage = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID' });
        }

        const { subject, message: msgBody } = req.body;
        const updateData = {};
        if (subject !== undefined) updateData.subject = subject;
        if (msgBody !== undefined) updateData.message = msgBody;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const message = await ContactMessage.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!message) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }

        res.status(200).json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contacts/:id
// @access  Admin
exports.deleteContactMessage = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID' });
        }

        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }

        res.status(200).json({ success: true, message: 'Contact message deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSESSMENT MANAGEMENT (Legacy Assessments)
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all assessments (paginated)
// @route   GET /api/admin/assessments
// @access  Admin
exports.getAssessments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        let filter = {};
        if (search) {
            // Search by trigger
            filter = { trigger: { $regex: search, $options: 'i' } };
        }

        const [assessments, total] = await Promise.all([
            Assessment.find(filter)
                .populate('user', 'name email')
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit),
            Assessment.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: assessments,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single assessment
// @route   GET /api/admin/assessments/:id
// @access  Admin
exports.getAssessmentById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }
        const assessment = await Assessment.findById(req.params.id).populate('user', 'name email');
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        res.status(200).json({ success: true, data: assessment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update assessment
// @route   PUT /api/admin/assessments/:id
// @access  Admin
exports.updateAssessment = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }

        const { stress, anxiety, trigger } = req.body;
        const updateData = {};
        if (stress !== undefined) updateData.stress = stress;
        if (anxiety !== undefined) updateData.anxiety = anxiety;
        if (trigger !== undefined) updateData.trigger = trigger;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const assessment = await Assessment.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate('user', 'name email');

        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        res.status(200).json({ success: true, data: assessment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete assessment
// @route   DELETE /api/admin/assessments/:id
// @access  Admin
exports.deleteAssessment = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }
        const assessment = await Assessment.findByIdAndDelete(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        res.status(200).json({ success: true, message: 'Assessment deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MENTAL ASSESSMENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all mental assessments (paginated)
// @route   GET /api/admin/mental-assessments
// @access  Admin
exports.getMentalAssessments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const filterType = req.query.type || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        let filter = {};
        if (filterType) {
            filter.type = filterType;
        }
        if (search) {
            filter.severity = { $regex: search, $options: 'i' };
        }

        const [assessments, total] = await Promise.all([
            MentalAssessment.find(filter)
                .populate('user', 'name email')
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit),
            MentalAssessment.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: assessments,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single mental assessment
// @route   GET /api/admin/mental-assessments/:id
// @access  Admin
exports.getMentalAssessmentById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }
        const assessment = await MentalAssessment.findById(req.params.id).populate('user', 'name email');
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Mental assessment not found' });
        }
        res.status(200).json({ success: true, data: assessment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update mental assessment
// @route   PUT /api/admin/mental-assessments/:id
// @access  Admin
exports.updateMentalAssessment = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }

        const { severity } = req.body;
        const updateData = {};
        if (severity !== undefined) updateData.severity = severity;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const assessment = await MentalAssessment.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate('user', 'name email');

        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Mental assessment not found' });
        }

        res.status(200).json({ success: true, data: assessment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete mental assessment
// @route   DELETE /api/admin/mental-assessments/:id
// @access  Admin
exports.deleteMentalAssessment = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }
        const assessment = await MentalAssessment.findByIdAndDelete(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Mental assessment not found' });
        }
        res.status(200).json({ success: true, message: 'Mental assessment deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY CHECK-IN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all daily check-ins (paginated)
// @route   GET /api/admin/checkins
// @access  Admin
exports.getDailyCheckIns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const filterMood = req.query.mood || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        let filter = {};
        if (filterMood) {
            filter.mood = filterMood;
        }
        if (search) {
            filter.notes = { $regex: search, $options: 'i' };
        }

        const [checkins, total] = await Promise.all([
            DailyCheckIn.find(filter)
                .populate('user', 'name email')
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit),
            DailyCheckIn.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: checkins,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single daily check-in
// @route   GET /api/admin/checkins/:id
// @access  Admin
exports.getDailyCheckInById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid check-in ID' });
        }
        const checkin = await DailyCheckIn.findById(req.params.id).populate('user', 'name email');
        if (!checkin) {
            return res.status(404).json({ success: false, message: 'Daily check-in not found' });
        }
        res.status(200).json({ success: true, data: checkin });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete daily check-in
// @route   DELETE /api/admin/checkins/:id
// @access  Admin
exports.deleteDailyCheckIn = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid check-in ID' });
        }
        const checkin = await DailyCheckIn.findByIdAndDelete(req.params.id);
        if (!checkin) {
            return res.status(404).json({ success: false, message: 'Daily check-in not found' });
        }
        res.status(200).json({ success: true, message: 'Daily check-in deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
