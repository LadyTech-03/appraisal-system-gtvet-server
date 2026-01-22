const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard and analytics
router.get('/dashboard', AdminController.getDashboardStats);
router.get('/analytics', AdminController.getAnalytics);

// Resetting system
router.post('/database/reset', AdminController.resetDatabase);

// System management
router.get('/health', AdminController.getSystemHealth);
router.get('/logs', AdminController.getSystemLogs);

// Data export
router.get('/export', AdminController.exportSystemData);

// Bulk operations
router.post('/bulk-operations', AdminController.bulkOperations);

// Access requests management
router.get('/access-requests', AdminController.getAccessRequests);
router.get('/access-requests/:id', AdminController.getAccessRequestById);
router.post('/access-requests/:id/approve', AdminController.approveAccessRequest);
router.post('/access-requests/:id/reject', AdminController.rejectAccessRequest);

module.exports = router;
