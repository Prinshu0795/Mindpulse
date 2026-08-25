const express = require('express');
const { adminProtect } = require('../middleware/adminMiddleware');
const {
    getDashboardStats,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getContactMessages,
    getContactMessageById,
    updateContactMessage,
    deleteContactMessage,
    getAssessments,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    getMentalAssessments,
    getMentalAssessmentById,
    updateMentalAssessment,
    deleteMentalAssessment,
    getDailyCheckIns,
    getDailyCheckInById,
    deleteDailyCheckIn
} = require('../controllers/adminController');

const router = express.Router();

// All routes are protected by adminProtect middleware
router.use(adminProtect);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Contact Message (Query) Management
router.route('/contacts')
    .get(getContactMessages);

router.route('/contacts/:id')
    .get(getContactMessageById)
    .put(updateContactMessage)
    .delete(deleteContactMessage);

// Assessment Management
router.route('/assessments')
    .get(getAssessments);

router.route('/assessments/:id')
    .get(getAssessmentById)
    .put(updateAssessment)
    .delete(deleteAssessment);

// Mental Assessment Management
router.route('/mental-assessments')
    .get(getMentalAssessments);

router.route('/mental-assessments/:id')
    .get(getMentalAssessmentById)
    .put(updateMentalAssessment)
    .delete(deleteMentalAssessment);

// Daily Check-In Management
router.route('/checkins')
    .get(getDailyCheckIns);

router.route('/checkins/:id')
    .get(getDailyCheckInById)
    .delete(deleteDailyCheckIn);

module.exports = router;
