const Assessment = require('../models/Assessment');

// @desc    Get latest 7 assessments
// @route   GET /api/assessments
// @access  Private
exports.getAssessments = async (req, res) => {
    try {
        // Fetch up to 7 latest assessments for the user, sorted by newest first
        const assessments = await Assessment.find({ user: req.user.id })
            .sort({ fullDate: -1 })
            .limit(7);

        // Reverse to return them in chronological order for the charts (oldest to newest)
        res.status(200).json({
            success: true,
            data: assessments.reverse()
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new assessment
// @route   POST /api/assessments
// @access  Private
exports.saveAssessment = async (req, res) => {
    try {
        const { stress, anxiety, date, trigger, fullDate } = req.body;

        const assessment = await Assessment.create({
            user: req.user.id,
            stress,
            anxiety,
            date,
            trigger,
            fullDate: fullDate || new Date()
        });

        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
