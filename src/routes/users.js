const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validate, userSchemas, querySchemas } = require('../middleware/validation');
const { 
  authenticateToken, 
  requireAdmin, 
  requireManager, 
  canManageUser,
  canAccessTeam 
} = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all users (admin/manager only)
router.get('/', 
  requireManager, 
  validate(querySchemas.userFilters, 'query'), 
  UserController.getUsers
);

// Get user statistics (admin only)
router.get('/statistics', requireAdmin, UserController.getUserStatistics);

// Search users
router.get('/search', 
  requireManager, 
  validate(querySchemas.userFilters, 'query'), 
  UserController.searchUsers
);

// Get users by role
router.get('/role/:role', 
  requireManager, 
  validate(querySchemas.userFilters, 'query'), 
  UserController.getUsersByRole
);

// Get roles
router.get('/roles', requireAdmin, UserController.getRoles);


// Get users by division
router.get('/division/:division', 
  requireManager, 
  validate(querySchemas.userFilters, 'query'), 
  UserController.getUsersByDivision
);

// Get users by unit
router.get('/unit/:unit', 
  requireManager, 
  validate(querySchemas.userFilters, 'query'), 
  UserController.getUsersByUnit
);

// Export users (admin only)
router.get('/export', requireAdmin, UserController.exportUsers);

// Bulk operations (admin only)
router.post('/bulk-update', requireAdmin, UserController.bulkUpdateUsers);

// Get user by ID
router.get('/:id', canManageUser, UserController.getUserById);

// Get user's team
router.get('/:id/team', canAccessTeam, UserController.getUserTeam);

// Get user hierarchy
router.get('/:id/hierarchy', canManageUser, UserController.getUserHierarchy);

// Create new user (admin only)
router.post('/', 
  requireAdmin, 
  validate(userSchemas.create), 
  UserController.createUser
);

// Update user
router.put('/:id', canManageUser, validate(userSchemas.update), UserController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireAdmin, UserController.deleteUser);

module.exports = router;
