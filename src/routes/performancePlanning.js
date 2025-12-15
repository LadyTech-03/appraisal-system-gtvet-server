const express = require('express');
const router = express.Router();
const PerformancePlanningController = require('../controllers/performancePlanningController');
const { authenticateToken, requireManager } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/me', PerformancePlanningController.getMyPerformancePlanning);
router.get('/', requireManager, PerformancePlanningController.getPerformancePlanningByUserId); // Reuse for admin listing if needed, or create specific
router.post('/', PerformancePlanningController.createPerformancePlanning);
router.get('/:id', PerformancePlanningController.getPerformancePlanningById);
router.put('/:id', PerformancePlanningController.updatePerformancePlanning);
router.delete('/:id', requireManager, PerformancePlanningController.deletePerformancePlanning);
router.get('/user/:user_id', PerformancePlanningController.getPerformancePlanningByUserId);

module.exports = router;
