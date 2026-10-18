const MentalAssessment = require('../models/MentalAssessment');
const DailyCheckIn = require('../models/DailyCheckIn');
const Assessment = require('../models/Assessment');
const axios = require('axios');

// @desc    Get complete analytics overview (trends, triggers, etc)
// @route   GET /api/analytics/overview
// @access  Private
exports.getAnalyticsOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch last 90 days of check-ins
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const checkins = await DailyCheckIn.find({ 
            user: userId,
            createdAt: { $gte: ninetyDaysAgo }
        }).sort({ createdAt: 1 }); // chronological

        // Fetch recent mental assessments
        const mentalAssessments = await MentalAssessment.find({
            user: userId
        }).sort({ completedAt: 1 });

        // Fetch legacy assessments
        const legacyAssessments = await Assessment.find({
            user: userId
        }).sort({ fullDate: 1 });

        // Calculate top stress triggers
        const triggerCounts = {};
        checkins.forEach(ci => {
            if (ci.stressTriggers && ci.stressTriggers.length > 0) {
                ci.stressTriggers.forEach(trigger => {
                    triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
                });
            }
        });
        legacyAssessments.forEach(la => {
            if (la.trigger && la.trigger !== 'Unknown') {
                triggerCounts[la.trigger] = (triggerCounts[la.trigger] || 0) + 1;
            }
        });

        const sortedTriggers = Object.keys(triggerCounts)
            .map(key => ({ name: key, count: triggerCounts[key] }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            data: {
                checkins,
                mentalAssessments,
                legacyAssessments,
                topTriggers: sortedTriggers
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get detailed analytics from Python service
// @route   GET /api/analytics/detailed
// @access  Private
exports.getDetailedAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all user data
        const checkins = await DailyCheckIn.find({ user: userId }).sort({ createdAt: 1 }).lean();
        const mentalAssessments = await MentalAssessment.find({ user: userId }).sort({ completedAt: 1 }).lean();
        const legacyAssessments = await Assessment.find({ user: userId }).sort({ fullDate: 1 }).lean();

        // Prepare payload for Python service
        const payload = {
            userId: userId.toString(),
            legacyAssessments: legacyAssessments,
            mentalAssessments: mentalAssessments,
            checkins: checkins
        };

        // Call Python Service (assuming it runs on port 8000)
        // In production, this URL should be an environment variable (e.g., process.env.PYTHON_SERVICE_URL)
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        
        try {
            const pythonResponse = await axios.post(`${pythonServiceUrl}/internal/analyze`, payload, {
                timeout: 60000
            });
            
            res.status(200).json({
                success: true,
                data: {
                    checkins,
                    mentalAssessments,
                    legacyAssessments,
                    pythonData: pythonResponse.data
                }
            });
        } catch (pythonErr) {
            console.error("Python Service Error:", pythonErr.message);
            // Return user data with graceful fallback so dashboard works even if Python analytics service is unreachable
            res.status(200).json({ 
                success: true, 
                data: {
                    checkins,
                    mentalAssessments,
                    legacyAssessments,
                    pythonData: null,
                    pythonError: pythonErr.message
                }
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Download PDF report
// @route   GET /api/analytics/report/download
// @access  Private
exports.downloadAnalyticsReport = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const checkins = await DailyCheckIn.find({ user: userId }).sort({ createdAt: 1 }).lean();
        const mentalAssessments = await MentalAssessment.find({ user: userId }).sort({ completedAt: 1 }).lean();
        const legacyAssessments = await Assessment.find({ user: userId }).sort({ fullDate: 1 }).lean();

        const payload = {
            userId: userId.toString(),
            legacyAssessments: legacyAssessments,
            mentalAssessments: mentalAssessments,
            checkins: checkins
        };

        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        
        try {
            const pythonResponse = await axios.post(`${pythonServiceUrl}/internal/generate-report`, payload, {
                responseType: 'stream',
                timeout: 60000
            });
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=MindPulse_Analytics_${userId}.pdf`);
            
            pythonResponse.data.pipe(res);
        } catch (pythonErr) {
            console.error("Python Service Error (PDF):", pythonErr.message);
            res.status(503).json({ 
                success: false, 
                message: "PDF generation service is currently unavailable."
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
