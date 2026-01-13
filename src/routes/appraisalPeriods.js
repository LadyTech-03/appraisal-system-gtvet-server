const express = require('express');
const router = express.Router();
const AppraisalPeriodsController = require('../controllers/appraisalPeriodsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all section availability
router.get('/', AppraisalPeriodsController.getAvailability);

// Get specific section availability
router.get('/:sectionName', AppraisalPeriodsController.getSectionAvailability);

// Update section availability (Admin only - add role check later if needed)
router.put('/:sectionName', AppraisalPeriodsController.updateAvailability);

module.exports = router;
