const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validate, authSchemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', validate(authSchemas.login), AuthController.login);
router.post('/register', AuthController.register);

// Protected routes
router.use(authenticateToken);

router.get('/me', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);
router.post('/logout', AuthController.logout);
router.get('/verify', AuthController.verifyToken);
router.get('/hierarchy', AuthController.getUserHierarchy);
router.get('/subordinates', AuthController.getSubordinates);

module.exports = router;
