const { verifyToken, extractToken } = require('../config/auth');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(['Director-General', 'System Administrator']);

// Middleware to check if user is manager or admin
const requireManager = requireRole([
  'Director-General', 'System Administrator', 'Deputy Director-General', 
  'Deputy Director', 'Principal', 'Vice Principal', 'Head of Department'
]);

// Middleware to check if user can access appraisal
const canAccessAppraisal = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const appraisalId = req.params.id;
    const Appraisal = require('../models/Appraisal');
    const appraisal = await Appraisal.findById(appraisalId);

    if (!appraisal) {
      return res.status(404).json({
        success: false,
        message: 'Appraisal not found'
      });
    }

    // Check if user can access this appraisal
    const canAccess = 
      req.user.id === appraisal.employeeId || // Employee
      req.user.id === appraisal.appraiserId || // Appraiser
      req.user.role === 'Director-General' || // Admin
      req.user.role === 'System Administrator' || // Admin
      req.user.role === 'Deputy Director-General' || // Admin
      req.user.role === 'Director' || // Admin
      req.user.role === 'Deputy Director' || // Admin
      req.user.role === 'Principal' || // Admin
      req.user.role === 'Vice Principal' || // Admin
      req.user.role === 'Head of Department'; // Manager

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this appraisal'
      });
    }

    req.appraisal = appraisal;
    next();
  } catch (error) {
    console.error('Appraisal access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user can manage another user
const canManageUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can manage this user
    const canManage = 
      req.user.id === targetUserId || // Self
      req.user.role === 'Director-General' || // Admin
      req.user.role === 'System Administrator' || // Admin
      req.user.role === 'Deputy Director-General' || // Admin
      req.user.role === 'Director' || // Admin
      req.user.role === 'Deputy Director' || // Admin
      req.user.role === 'Principal' || // Admin
      req.user.role === 'Vice Principal' || // Admin
      req.user.role === 'Head of Department' || // Manager
      (req.user.role === 'Senior Lecturer' && targetUser.managerId === req.user.id); // Direct manager

    if (!canManage) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to manage this user'
      });
    }

    req.targetUser = targetUser;
    next();
  } catch (error) {
    console.error('User management access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user can access their own data
const requireOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const targetUserId = req.params.id || req.params.userId;
  
  if (req.user.id !== targetUserId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this resource'
    });
  }

  next();
};

// Middleware to check if user can access team data
const canAccessTeam = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user's subordinates
    const subordinates = await User.findByManagerId(req.user.id);
    const subordinateIds = subordinates.map(sub => sub.id);

    // Check if user can access team data
    const canAccess = 
      req.user.role === 'Director-General' || // Admin
      req.user.role === 'System Administrator' || // Admin
      req.user.role === 'Deputy Director-General' || // Admin
      req.user.role === 'Director' || // Admin
      req.user.role === 'Deputy Director' || // Admin
      req.user.role === 'Principal' || // Admin
      req.user.role === 'Vice Principal' || // Admin
      req.user.role === 'Head of Department' || // Manager
      subordinateIds.length > 0; // Has subordinates

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to team data'
      });
    }

    req.subordinateIds = subordinateIds;
    next();
  } catch (error) {
    console.error('Team access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireManager,
  canAccessAppraisal,
  canManageUser,
  requireOwnership,
  canAccessTeam
};
