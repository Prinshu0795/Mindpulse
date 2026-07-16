const express = require('express');
const { getAssessments, saveAssessment } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

router.route('/')
    .get(getAssessments)
    .post(saveAssessment);

module.exports = router;
