const express = require('express');
const router = express.Router();
const AppraisalController = require('../controllers/appraisalController');
const { validate, appraisalSchemas, querySchemas } = require('../middleware/validation');
const { 
  authenticateToken, 
  requireManager, 
  canAccessAppraisal 
} = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all appraisals (manager/admin only)
router.get('/', 
  requireManager, 
  validate(querySchemas.appraisalFilters, 'query'), 
  AppraisalController.getAppraisals
);

// Get team appraisals
router.get('/team', 
  requireManager, 
  validate(querySchemas.appraisalFilters, 'query'), 
  AppraisalController.getTeamAppraisals
);

// Get appraisal statistics (admin only)
router.get('/statistics', requireManager, AppraisalController.getAppraisalStatistics);

// Get dashboard overview for current user
router.get('/overview/me', AppraisalController.getDashboardOverview);

// Export appraisals
router.get('/export', requireManager, AppraisalController.bulkExportAppraisals);

// Get appraisals by employee
router.get('/employee/:employeeId', 
  requireManager, 
  validate(querySchemas.appraisalFilters, 'query'), 
  AppraisalController.getAppraisalsByEmployee
);

// Get appraisals by appraiser
router.get('/appraiser/:appraiserId', 
  requireManager, 
  validate(querySchemas.appraisalFilters, 'query'), 
  AppraisalController.getAppraisalsByAppraiser
);

// Get appraisals by period
router.get('/period/:periodStart/:periodEnd', 
  requireManager, 
  validate(querySchemas.appraisalFilters, 'query'), 
  AppraisalController.getAppraisalsByPeriod
);

// Create new appraisal
router.post('/', 
  requireManager, 
  validate(appraisalSchemas.create), 
  AppraisalController.createAppraisal
);

// Get appraisal by ID
router.get('/:id', canAccessAppraisal, AppraisalController.getAppraisalById);

// Update appraisal
router.put('/:id', canAccessAppraisal, validate(appraisalSchemas.update), AppraisalController.updateAppraisal);

// Update appraisal status
router.patch('/:id/status', canAccessAppraisal, AppraisalController.updateAppraisalStatus);

// Add signature to appraisal
router.post('/:id/signatures', canAccessAppraisal, AppraisalController.addSignature);

// Get appraisal signatures
router.get('/:id/signatures', canAccessAppraisal, AppraisalController.getSignatures);

// Export single appraisal
router.get('/:id/export', canAccessAppraisal, AppraisalController.exportAppraisal);

// Delete appraisal (admin only)
router.delete('/:id', requireManager, AppraisalController.deleteAppraisal);

module.exports = router;
