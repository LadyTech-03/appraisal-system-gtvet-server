const express = require('express');
const router = express.Router();
const AppraisalController = require('../controllers/appraisalController');
const { validate, appraisalSchemas, querySchemas } = require('../middleware/validation');
const {
  authenticateToken,
  requireManager,
  canAccessAppraisal,
  canManageAppraisal
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

// Get current in-progress appraisal for the logged-in user
router.get('/current', AppraisalController.getCurrentAppraisal);

// Update manager's current step when reviewing an employee's appraisal
router.post('/manager-step', requireManager, AppraisalController.updateManagerStep);

// Get form lock status for user's appraisal
router.get('/lock-status', AppraisalController.getFormLockStatus);

// Export appraisals
router.get('/export', requireManager, AppraisalController.bulkExportAppraisals);

// Get appraisals by employee
router.get('/employee/:employee_id',
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

// Submit appraisal (consolidate all form data)
router.post('/submit', AppraisalController.submitAppraisal);

// Get my submitted appraisals
router.get('/me/submitted', AppraisalController.getMyAppraisals);

// Get appraisals where I'm the appraiser (history)
router.get('/me/history', AppraisalController.getMyAppraisalHistory);

// Approve appraisal (appraiser/manager only)
router.put('/:id/approve', canManageAppraisal, AppraisalController.approveAppraisal);

// Reject appraisal (appraiser/manager only)
router.put('/:id/reject', canManageAppraisal, AppraisalController.rejectAppraisal);

// Complete appraisal (appraiser/manager only) - finalize and clean up
router.put('/:id/complete', canManageAppraisal, AppraisalController.completeAppraisal);

// Delete appraisal (admin only)
router.delete('/:id', requireManager, AppraisalController.deleteAppraisal);

module.exports = router;
