const express = require('express');
const { getAssessments, saveAssessment, getMentalAssessments, saveMentalAssessment, saveDailyCheckIn, getDailyCheckIns } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

router.route('/')
    .get(getAssessments)
    .post(saveAssessment);

router.route('/history')
    .get(getMentalAssessments)
    .post(saveMentalAssessment);

router.route('/checkins')
    .post(saveDailyCheckIn);

router.route('/checkins/history')
    .get(getDailyCheckIns);

module.exports = router;
