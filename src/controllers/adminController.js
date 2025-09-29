const UserService = require('../services/userService');
const AppraisalService = require('../services/appraisalService');
const AccessRequest = require('../models/AccessRequest');
const TrainingRecord = require('../models/TrainingRecord');
const { catchAsync } = require('../middleware/errorHandler');

class AdminController {

  // Get dashboard statistics
  static getDashboardStats = catchAsync(async (req, res) => {
    const userStats = await UserService.getUserStatistics();
    const appraisalStats = await AppraisalService.getAppraisalStatistics();
    
    // Get pending access requests
    const pendingRequests = await AccessRequest.findPending({ limit: 5 });
    
    // Get recent training records
    const recentTraining = await TrainingRecord.findAll({ 
      limit: 5, 
      page: 1 
    });
    
    res.status(200).json({
      success: true,
      data: {
        users: userStats,
        appraisals: appraisalStats,
        pendingAccessRequests: pendingRequests.accessRequests,
        recentTrainingRecords: recentTraining.trainingRecords
      }
    });
  });
  
  // Get analytics data
  static getAnalytics = catchAsync(async (req, res) => {
    const { period = 'year' } = req.query;
    
    // Get user statistics
    const userStats = await UserService.getUserStatistics();
    
    // Get appraisal statistics
    const appraisalStats = await AppraisalService.getAppraisalStatistics();
    
    // Get training statistics
    const { query } = require('../config/database');
    
    const trainingStats = await query(`
      SELECT 
        COUNT(*) as total_training,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_training,
        COUNT(CASE WHEN status = 'ongoing' THEN 1 END) as ongoing_training,
        AVG(cost) as avg_cost
      FROM training_records
    `);
    
    res.status(200).json({
      success: true,
      data: {
        users: userStats,
        appraisals: appraisalStats,
        training: trainingStats.rows[0]
      }
    });
  });
  
  // Get all access requests
  static getAccessRequests = catchAsync(async (req, res) => {
    const options = req.query;
    
    const result = await AccessRequest.findAll(options);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });
  
  // Get access request by ID
  static getAccessRequestById = catchAsync(async (req, res) => {
    const requestId = req.params.id;
    
    const request = await AccessRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request.toJSON()
    });
  });
  
  // Approve access request
  static approveAccessRequest = catchAsync(async (req, res) => {
    const requestId = req.params.id;
    const { reviewNotes } = req.body;
    const reviewedBy = req.user.id;
    
    const request = await AccessRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Access request has already been processed'
      });
    }
    
    await request.approve(reviewedBy, reviewNotes);
    
    res.status(200).json({
      success: true,
      message: 'Access request approved successfully',
      data: request.toJSON()
    });
  });
  
  // Reject access request
  static rejectAccessRequest = catchAsync(async (req, res) => {
    const requestId = req.params.id;
    const { reviewNotes } = req.body;
    const reviewedBy = req.user.id;
    
    const request = await AccessRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Access request has already been processed'
      });
    }
    
    await request.reject(reviewedBy, reviewNotes);
    
    res.status(200).json({
      success: true,
      message: 'Access request rejected successfully',
      data: request.toJSON()
    });
  });
  
  // Get system logs
  static getSystemLogs = catchAsync(async (req, res) => {
    const { page = 1, limit = 50, level, startDate, endDate } = req.query;
    
    // This would typically come from a logging system
    // For now, we'll return a mock response
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'User logged in successfully',
        timestamp: new Date().toISOString(),
        userId: 'user123',
        ip: '192.168.1.1'
      },
      {
        id: 2,
        level: 'warning',
        message: 'Failed login attempt',
        timestamp: new Date().toISOString(),
        userId: null,
        ip: '192.168.1.2'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        logs,
        total: logs.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 1
      }
    });
  });
  
  // Get system health
  static getSystemHealth = catchAsync(async (req, res) => {
    const { testConnection } = require('../database/connection');
    
    // Test database connection
    const dbStatus = await testConnection();
    
    // Get system metrics
    const { query } = require('../config/database');
    
    const metrics = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM appraisals) as total_appraisals,
        (SELECT COUNT(*) FROM training_records) as total_training_records,
        (SELECT COUNT(*) FROM access_requests WHERE status = 'pending') as pending_requests
    `);
    
    res.status(200).json({
      success: true,
      data: {
        database: dbStatus ? 'connected' : 'disconnected',
        metrics: metrics.rows[0],
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    });
  });
  
  // Export system data
  static exportSystemData = catchAsync(async (req, res) => {
    const { type } = req.query;
    
    let exportData = {};
    
    switch (type) {
      case 'users':
        exportData = await UserService.exportUsers();
        break;
      case 'appraisals':
        exportData = await AppraisalService.bulkExportAppraisals();
        break;
      case 'training':
        const trainingData = await TrainingRecord.findAll({ limit: 1000 });
        exportData = trainingData.trainingRecords;
        break;
      case 'access_requests':
        const accessData = await AccessRequest.findAll({ limit: 1000 });
        exportData = accessData.accessRequests;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }
    
    res.status(200).json({
      success: true,
      data: exportData
    });
  });
  
  // Bulk operations
  static bulkOperations = catchAsync(async (req, res) => {
    const { operation, data } = req.body;
    
    let result;
    
    switch (operation) {
      case 'activate_users':
        result = await UserService.bulkUpdateUsers(data.userIds, { isActive: true });
        break;
      case 'deactivate_users':
        result = await UserService.bulkUpdateUsers(data.userIds, { isActive: false });
        break;
      case 'update_user_roles':
        result = await UserService.bulkUpdateUsers(data.userIds, { role: data.role });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk operation'
        });
    }
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.updatedUsers
    });
  });
}

module.exports = AdminController;
