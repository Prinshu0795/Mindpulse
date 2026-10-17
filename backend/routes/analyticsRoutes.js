const express = require('express');
const { getAnalyticsOverview, getDetailedAnalytics, downloadAnalyticsReport } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/overview')
    .get(getAnalyticsOverview);

router.route('/detailed')
    .get(getDetailedAnalytics);

router.route('/report/download')
    .get(downloadAnalyticsReport);

module.exports = router;
