const UserService = require('../services/userService');
const { catchAsync } = require('../middleware/errorHandler');
const { ROLE_VALUES, DIVISION_VALUES, UNIT_VALUES } = require('../utils/roles');


class UserController {
  // Get all users
  static getUsers = catchAsync(async (req, res) => {
    const options = req.query;

    const result = await UserService.getUsers(options);

    res.status(200).json({
      success: true,
      data: result
    });
  });

  // Get user by ID
  static getUserById = catchAsync(async (req, res) => {
    const userId = req.params.id;

    const user = await UserService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  });

  // Create new user
  static createUser = catchAsync(async (req, res) => {
    const userData = req.body;

    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  });

  // Update user
  static updateUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await UserService.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  });

  // Delete user
  static deleteUser = catchAsync(async (req, res) => {
    const userId = req.params.id;

    const result = await UserService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // Get users by role
  static getUsersByRole = catchAsync(async (req, res) => {
    const role = req.params.role;
    const options = req.query;

    const result = await UserService.getUsersByRole(role, options);

    res.status(200).json({
      success: true,
      data: result
    });
  });

  // Get roles
  static getRoles = catchAsync(async (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        roles: ROLE_VALUES,
        divisions: DIVISION_VALUES,
        units: UNIT_VALUES,
      }
    });
  });

  // Get users by division
  static getUsersByDivision = catchAsync(async (req, res) => {
    const division = req.params.division;
    const options = req.query;

    const result = await UserService.getUsersByDivision(division, options);

    res.status(200).json({
      success: true,
      data: result
    });
  });

  // Get users by unit
  static getUsersByUnit = catchAsync(async (req, res) => {
    const unit = req.params.unit;
    const options = req.query;

    const result = await UserService.getUsersByUnit(unit, options);

    res.status(200).json({
      success: true,
      data: result
    });
  });

  // Get user's team
  static getUserTeam = catchAsync(async (req, res) => {
    const userId = req.params.id;

    const team = await UserService.getUserTeam(userId);

    res.status(200).json({
      success: true,
      data: team
    });
  });

  // Get user hierarchy
  static getUserHierarchy = catchAsync(async (req, res) => {
    const userId = req.params.id;

    const hierarchy = await UserService.getUserHierarchy(userId);

    res.status(200).json({
      success: true,
      data: hierarchy
    });
  });

  // Search users
  static searchUsers = catchAsync(async (req, res) => {
    const query = req.query.q;
    const options = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await UserService.searchUsers(query, options);

    res.status(200).json({
      success: true,
      data: result
    });
  });

  // Get user statistics
  static getUserStatistics = catchAsync(async (req, res) => {
    const statistics = await UserService.getUserStatistics();

    res.status(200).json({
      success: true,
      data: statistics
    });
  });

  // Bulk update users
  static bulkUpdateUsers = catchAsync(async (req, res) => {
    const { userIds, updateData } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const result = await UserService.bulkUpdateUsers(userIds, updateData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.updatedUsers
    });
  });

  // Export users
  static exportUsers = catchAsync(async (req, res) => {
    const options = req.query;

    const exportData = await UserService.exportUsers(options);

    res.status(200).json({
      success: true,
      data: exportData
    });
  });

  // Upload signature
  static uploadSignature = catchAsync(async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No signature file uploaded'
      });
    }

    const signatureUrl = req.file.url;

    // Update user profile with signature URL
    const updatedUser = await UserService.updateUser(userId, { signature_url: signatureUrl });

    res.status(200).json({
      success: true,
      message: 'Signature uploaded successfully',
      data: {
        signatureUrl,
        user: updatedUser
      }
    });
  });
}

module.exports = UserController;
