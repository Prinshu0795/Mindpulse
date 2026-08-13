const MentalAssessment = require('../models/MentalAssessment');
const DailyCheckIn = require('../models/DailyCheckIn');
const Assessment = require('../models/Assessment');

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
