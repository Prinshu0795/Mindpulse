const express = require('express');
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/overview')
    .get(getAnalyticsOverview);

module.exports = router;
