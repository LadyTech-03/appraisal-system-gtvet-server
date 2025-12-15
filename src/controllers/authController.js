const AuthService = require('../services/authService');
const { catchAsync } = require('../middleware/errorHandler');

class AuthController {
  // Login user
  static login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  });

  // Register new user
  static register = catchAsync(async (req, res) => {
    const userData = req.body;

    const result = await AuthService.register(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  });

  // Get current user profile
  static getProfile = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const user = await AuthService.getProfile(user_id);

    res.status(200).json({
      success: true,
      data: user
    });
  });

  // Update user profile
  static updateProfile = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const updateData = req.body;

    const user = await AuthService.updateProfile(user_id, updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  });

  // Change password
  static changePassword = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const result = await AuthService.changePassword(user_id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // Logout user
  static logout = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const result = await AuthService.logout(user_id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // Verify token
  static verifyToken = catchAsync(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token required'
      });
    }

    const user = await AuthService.verifyToken(token);

    res.status(200).json({
      success: true,
      data: user
    });
  });

  // Get user hierarchy
  static getUserHierarchy = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const hierarchy = await AuthService.getUserHierarchy(user_id);

    res.status(200).json({
      success: true,
      data: hierarchy
    });
  });

  // Get user's subordinates
  static getSubordinates = catchAsync(async (req, res) => {
    const user_id = req.user.id;

    const subordinates = await AuthService.getSubordinates(user_id);

    res.status(200).json({
      success: true,
      data: subordinates
    });
  });
}

module.exports = AuthController;
