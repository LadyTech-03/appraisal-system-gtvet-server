const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  // Get all users with filters
  static async getUsers(options = {}) {
    try {
      const result = await User.findAll(options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(user_id) {
    try {
      const user = await User.findById(user_id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);

      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Check if employee ID already exists
      const existingEmployee = await User.findByEmployeeId(userData.employee_id);

      if (existingEmployee) {
        throw new AppError('User with this employee ID already exists', 400);
      }

      // Create new user
      const user = await User.create(userData);

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async updateUser(user_id, updateData) {
    try {
      const user = await User.findById(user_id);

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

  // Delete user (soft delete)
  static async deleteUser(user_id) {
    try {
      const user = await User.findById(user_id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await user.delete();

      return {
        message: 'User deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Get users by role
  static async getUsersByRole(role, options = {}) {
    try {
      const result = await User.findAll({ ...options, role });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get users by division
  static async getUsersByDivision(division, options = {}) {
    try {
      const result = await User.findAll({ ...options, division });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get users by unit
  static async getUsersByUnit(unit, options = {}) {
    try {
      const result = await User.findAll({ ...options, unit });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get user's team (subordinates)
  static async getUserTeam(user_id) {
    try {
      const user = await User.findById(user_id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const subordinates = await User.findByManagerId(user_id);

      return subordinates.map(sub => sub.toJSON());
    } catch (error) {
      throw error;
    }
  }

  // Get user hierarchy
  static async getUserHierarchy(user_id) {
    try {
      const user = await User.findById(user_id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const hierarchy = await User.getHierarchy(user_id);

      return hierarchy;
    } catch (error) {
      throw error;
    }
  }

  // Search users
  static async searchUsers(query, options = {}) {
    try {
      const result = await User.findAll({ ...options, search: query });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  static async getUserStatistics() {
    try {
      const { query } = require('../config/database');

      // Get total users
      const totalUsersResult = await query('SELECT COUNT(*) FROM users WHERE is_active = true');
      const totalUsers = parseInt(totalUsersResult.rows[0].count);

      // Get users by role
      const usersByRoleResult = await query(`
        SELECT role, COUNT(*) as count 
        FROM users 
        WHERE is_active = true 
        GROUP BY role 
        ORDER BY count DESC
      `);

      // Get users by division
      const usersByDivisionResult = await query(`
        SELECT division, COUNT(*) as count 
        FROM users 
        WHERE is_active = true AND division IS NOT NULL
        GROUP BY division 
        ORDER BY count DESC
      `);

      // Get users by unit
      const usersByUnitResult = await query(`
        SELECT unit, COUNT(*) as count 
        FROM users 
        WHERE is_active = true AND unit IS NOT NULL
        GROUP BY unit 
        ORDER BY count DESC
      `);

      // Get recent users (last 30 days)
      const recentUsersResult = await query(`
        SELECT COUNT(*) 
        FROM users 
        WHERE is_active = true AND created_at >= NOW() - INTERVAL '30 days'
      `);
      const recentUsers = parseInt(recentUsersResult.rows[0].count);

      return {
        totalUsers,
        recentUsers,
        usersByRole: usersByRoleResult.rows,
        usersByDivision: usersByDivisionResult.rows,
        usersByUnit: usersByUnitResult.rows
      };
    } catch (error) {
      throw error;
    }
  }

  // Bulk update users
  static async bulkUpdateUsers(userIds, updateData) {
    try {
      const { query } = require('../config/database');

      // Remove sensitive fields from update data
      const { password, passwordHash, ...safeUpdateData } = updateData;

      const allowedFields = [
        'role', 'division', 'unit', 'position', 'grade', 'manager_id', 'is_active'
      ];

      const updates = [];
      const values = [];
      let paramCount = 0;

      for (const [key, value] of Object.entries(safeUpdateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          paramCount++;
          updates.push(`${key} = $${paramCount}`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        throw new AppError('No valid fields to update', 400);
      }

      paramCount++;
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userIds);

      const result = await query(`
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = ANY($${paramCount})
        RETURNING id, name, email, role
      `, values);

      return {
        message: `${result.rows.length} users updated successfully`,
        updatedUsers: result.rows
      };
    } catch (error) {
      throw error;
    }
  }

  // Export users data
  static async exportUsers(options = {}) {
    try {
      const result = await User.findAll({ ...options, limit: 1000 });

      const exportData = result.users.map(user => ({
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        division: user.division,
        unit: user.unit,
        position: user.position,
        grade: user.grade,
        phone: user.phone,
        is_active: user.is_active,
        createdAt: user.createdAt
      }));

      return exportData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
