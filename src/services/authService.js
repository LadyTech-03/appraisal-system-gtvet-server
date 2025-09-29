const User = require('../models/User');
const { generateToken } = require('../config/auth');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  // Login user
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findByEmail(email);
      
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }
      
      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Account is deactivated', 401);
      }
      
      // Verify password
      const isPasswordValid = await user.verifyPassword(password);
      
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }
      
      // Update last login
      await user.updateLastLogin();
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      return {
        user: user.toAuthJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Register new user
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }
      
      // Check if employee ID already exists
      const existingEmployee = await User.findByEmployeeId(userData.employeeId);
      
      if (existingEmployee) {
        throw new AppError('User with this employee ID already exists', 400);
      }
      
      // Create new user
      const user = await User.create(userData);
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      return {
        user: user.toAuthJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Verify current password
      const isCurrentPasswordValid = await user.verifyPassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }
      
      // Update password
      await user.updatePassword(newPassword);
      
      return {
        message: 'Password changed successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Reset password (admin only)
  static async resetPassword(userId, newPassword) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Update password
      await user.updatePassword(newPassword);
      
      return {
        message: 'Password reset successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get user profile
  static async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Remove sensitive fields from update data
      const { password, passwordHash, ...safeUpdateData } = updateData;
      
      await user.update(safeUpdateData);
      
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Verify token
  static async verifyToken(token) {
    try {
      const { verifyToken } = require('../config/auth');
      const decoded = verifyToken(token);
      
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw new AppError('Invalid token', 401);
      }
      
      return user.toAuthJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Logout user (client-side token removal)
  static async logout(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // In a more sophisticated system, you might want to blacklist the token
      // For now, we'll just return a success message
      return {
        message: 'Logged out successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Check if user has permission
  static async hasPermission(userId, permission) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return false;
      }
      
      // Define role-based permissions
      const permissions = {
        'Director-General': ['*'], // All permissions
        'Deputy Director-General': ['*'], // All permissions
        'Director': ['*'], // All permissions
        'Deputy Director': ['*'], // All permissions
        'Principal': ['*'], // All permissions
        'Vice Principal': ['*'], // All permissions
        'Head of Department': ['manage_team', 'view_team', 'create_appraisal', 'review_appraisal'],
        'Senior Lecturer': ['view_team', 'create_appraisal', 'review_appraisal'],
        'Lecturer': ['view_own', 'create_appraisal'],
        'Assistant Lecturer': ['view_own', 'create_appraisal'],
        'Administrative Staff': ['view_all', 'manage_users'],
        'Support Staff': ['view_own']
      };
      
      const userPermissions = permissions[user.role] || [];
      
      return userPermissions.includes('*') || userPermissions.includes(permission);
    } catch (error) {
      return false;
    }
  }
  
  // Get user hierarchy
  static async getUserHierarchy(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const hierarchy = await User.getHierarchy(userId);
      
      return hierarchy;
    } catch (error) {
      throw error;
    }
  }
  
  // Get user's subordinates
  static async getSubordinates(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const subordinates = await User.findByManagerId(userId);
      
      return subordinates.map(sub => sub.toJSON());
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
