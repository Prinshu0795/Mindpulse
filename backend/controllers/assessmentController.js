const Assessment = require('../models/Assessment');
const MentalAssessment = require('../models/MentalAssessment');
const DailyCheckIn = require('../models/DailyCheckIn');

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

// @desc    Get all mental assessments
// @route   GET /api/assessments/history
// @access  Private
exports.getMentalAssessments = async (req, res) => {
    try {
        const assessments = await MentalAssessment.find({ user: req.user.id })
            .sort({ completedAt: -1 });
        res.status(200).json({
            success: true,
            data: assessments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create mental assessment (e.g. DASS-21, PHQ-9, WHO-5)
// @route   POST /api/assessments/history
// @access  Private
exports.saveMentalAssessment = async (req, res) => {
    try {
        const { type, score, subScores, responses, severity } = req.body;
        const assessment = await MentalAssessment.create({
            user: req.user.id,
            type,
            score,
            subScores,
            responses,
            severity
        });
        res.status(201).json({
            success: true,
            data: assessment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get daily check-ins
// @route   GET /api/assessments/checkins/history
// @access  Private
exports.getDailyCheckIns = async (req, res) => {
    try {
        const checkins = await DailyCheckIn.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(30);
        res.status(200).json({
            success: true,
            data: checkins.reverse()
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create daily check-in
// @route   POST /api/assessments/checkins
// @access  Private
exports.saveDailyCheckIn = async (req, res) => {
    try {
        const { mood, stressLevel, anxietyLevel, energyLevel, sleepQuality, stressTriggers, notes } = req.body;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingCheckIn = await DailyCheckIn.findOne({
            user: req.user.id,
            createdAt: { $gte: today }
        });
        
        if (existingCheckIn) {
            return res.status(400).json({ success: false, message: 'You have already completed a daily check-in today.' });
        }

        const checkin = await DailyCheckIn.create({
            user: req.user.id,
            mood,
            stressLevel,
            anxietyLevel,
            energyLevel,
            sleepQuality,
            stressTriggers,
            notes
        });
        res.status(201).json({
            success: true,
            data: checkin
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
