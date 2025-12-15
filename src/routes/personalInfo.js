const express = require('express');
const router = express.Router();
const PersonalInfoController = require('../controllers/personalInfoController');
const { authenticateToken, requireManager } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get current user's personal info
router.get('/me', PersonalInfoController.getMyPersonalInfo);

// Get team appraisals (for managers)
router.get('/team', PersonalInfoController.getTeamAppraisals);

// Get all personal info (admin only)
router.get('/', requireManager, PersonalInfoController.getAllPersonalInfo);

// Create new personal info
router.post('/', PersonalInfoController.createPersonalInfo);

// Get personal info by ID
router.get('/:id', PersonalInfoController.getPersonalInfoById);

// Update personal info
router.put('/:id', PersonalInfoController.updatePersonalInfo);

// Delete personal info (admin only)
router.delete('/:id', requireManager, PersonalInfoController.deletePersonalInfo);

// Get personal info by user ID
router.get('/user/:user_id', PersonalInfoController.getPersonalInfoByUserId);

module.exports = router;
