const Appraisal = require('../models/Appraisal');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { query } = require('../config/database');

class AppraisalService {
  // Get all appraisals with filters
  static async getAppraisals(options = {}) {
    try {
      const result = await Appraisal.findAll(options);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisal by ID
  static async getAppraisalById(appraisalId) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      return appraisal.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Create new appraisal
  static async createAppraisal(appraisalData) {
    try {
      // Verify employee exists
      const employee = await User.findById(appraisalData.employeeId);
      if (!employee) {
        throw new AppError('Employee not found', 404);
      }
      
      // Verify appraiser exists
      const appraiser = await User.findById(appraisalData.appraiserId);
      if (!appraiser) {
        throw new AppError('Appraiser not found', 404);
      }
      
      // Check if appraisal already exists for this period
      const existingAppraisal = await Appraisal.findByPeriod(
        appraisalData.periodStart,
        appraisalData.periodEnd,
        { employeeId: appraisalData.employeeId }
      );
      
      if (existingAppraisal.appraisals.length > 0) {
        throw new AppError('Appraisal already exists for this period', 400);
      }
      
      // Create new appraisal
      const appraisal = await Appraisal.create(appraisalData);
      
      return appraisal.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Update appraisal
  static async updateAppraisal(appraisalId, updateData) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      await appraisal.update(updateData);
      
      return appraisal.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Delete appraisal
  static async deleteAppraisal(appraisalId) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      await appraisal.delete();
      
      return {
        message: 'Appraisal deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisals by employee
  static async getAppraisalsByEmployee(employeeId, options = {}) {
    try {
      const result = await Appraisal.findByEmployeeId(employeeId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisals by appraiser
  static async getAppraisalsByAppraiser(appraiserId, options = {}) {
    try {
      const result = await Appraisal.findByAppraiserId(appraiserId, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisals by period
  static async getAppraisalsByPeriod(periodStart, periodEnd, options = {}) {
    try {
      const result = await Appraisal.findByPeriod(periodStart, periodEnd, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // Update appraisal status
  static async updateAppraisalStatus(appraisalId, status) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      await appraisal.updateStatus(status);
      
      return appraisal.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Add signature to appraisal
  static async addSignature(appraisalId, signatureData) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      await appraisal.addSignature(signatureData);
      
      return {
        message: 'Signature added successfully'
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisal signatures
  static async getSignatures(appraisalId) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      const signatures = await appraisal.getSignatures();
      
      return signatures;
    } catch (error) {
      throw error;
    }
  }
  
  // Get appraisal statistics
  static async getAppraisalStatistics() {
    try {
      // Get total appraisals
      const totalAppraisalsResult = await query('SELECT COUNT(*) FROM appraisals');
      const totalAppraisals = parseInt(totalAppraisalsResult.rows[0].count);
      
      // Get appraisals by status
      const appraisalsByStatusResult = await query(`
        SELECT status, COUNT(*) as count 
        FROM appraisals 
        GROUP BY status 
        ORDER BY count DESC
      `);
      
      // Get appraisals by period
      const appraisalsByPeriodResult = await query(`
        SELECT 
          EXTRACT(YEAR FROM period_start) as year,
          COUNT(*) as count 
        FROM appraisals 
        GROUP BY EXTRACT(YEAR FROM period_start) 
        ORDER BY year DESC
      `);
      
      // Get recent appraisals (last 30 days)
      const recentAppraisalsResult = await query(`
        SELECT COUNT(*) 
        FROM appraisals 
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `);
      const recentAppraisals = parseInt(recentAppraisalsResult.rows[0].count);
      
      // Get average scores
      const averageScoresResult = await query(`
        SELECT 
          AVG((overall_assessment->>'overallPercentage')::numeric) as avg_overall,
          AVG((overall_assessment->>'performanceScore')::numeric) as avg_performance,
          AVG((overall_assessment->>'coreCompetenciesScore')::numeric) as avg_core_competencies,
          AVG((overall_assessment->>'nonCoreCompetenciesScore')::numeric) as avg_non_core_competencies
        FROM appraisals 
        WHERE overall_assessment IS NOT NULL
      `);
      
      return {
        totalAppraisals,
        recentAppraisals,
        appraisalsByStatus: appraisalsByStatusResult.rows,
        appraisalsByPeriod: appraisalsByPeriodResult.rows,
        averageScores: averageScoresResult.rows[0]
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async getDashboardOverview(user) {
    try {
      const userId = user.id;
      const isAdmin = ['Director-General', 'System Administrator'].includes(user.role);

      const statusCountsResult = await query(`
        SELECT status, COUNT(*)::int AS count
        FROM appraisals
        WHERE employee_id = $1 OR appraiser_id = $1
        GROUP BY status
      `, [userId]);

      const statusCounts = statusCountsResult.rows.reduce((acc, row) => {
        acc[row.status] = row.count;
        return acc;
      }, { draft: 0, submitted: 0, reviewed: 0, closed: 0 });

      const myAppraisalsCountResult = await query(`
        SELECT COUNT(*)::int AS count
        FROM appraisals
        WHERE employee_id = $1
      `, [userId]);

      const averageRatingResult = await query(`
        SELECT AVG((overall_assessment->>'overallRating')::numeric) AS avg_rating
        FROM appraisals
        WHERE employee_id = $1 AND overall_assessment IS NOT NULL
      `, [userId]);

      const averageRating = parseFloat(averageRatingResult.rows[0].avg_rating) || 0;

      const recentAppraisalsResult = await query(`
        SELECT a.*, 
               e.name as employee_name, e.employee_id as employee_employee_id,
               ap.name as appraiser_name, ap.employee_id as appraiser_employee_id
        FROM appraisals a
        LEFT JOIN users e ON a.employee_id = e.id
        LEFT JOIN users ap ON a.appraiser_id = ap.id
        WHERE a.employee_id = $1 OR a.appraiser_id = $1
        ORDER BY a.updated_at DESC
        LIMIT 5
      `, [userId]);

      const recentAppraisals = recentAppraisalsResult.rows.map(row => new Appraisal(row).toJSON());

      const teamMembers = await User.findByManagerId(userId);
      const teamMembersCount = teamMembers.length;

      let totalUsers = null;
      if (isAdmin) {
        const totalUsersResult = await query('SELECT COUNT(*)::int AS count FROM users WHERE is_active = true');
        totalUsers = totalUsersResult.rows[0].count;
      }

      return {
        myAppraisals: myAppraisalsCountResult.rows[0].count,
        pendingAppraisals: statusCounts.draft || 0,
        completedAppraisals: statusCounts.closed || 0,
        inReviewAppraisals: statusCounts.reviewed || 0,
        submittedAppraisals: statusCounts.submitted || 0,
        averageRating,
        teamMembers: teamMembersCount,
        totalUsers,
        recentAppraisals,
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get team appraisals
  static async getTeamAppraisals(managerId, options = {}) {
    try {
      // Get manager's subordinates
      const subordinates = await User.findByManagerId(managerId);
      const subordinateIds = subordinates.map(sub => sub.id);
      
      if (subordinateIds.length === 0) {
        return {
          appraisals: [],
          total: 0,
          page: options.page || 1,
          limit: options.limit || 10,
          totalPages: 0
        };
      }
      
      // Get appraisals for all subordinates
      const result = await Appraisal.findAll({
        ...options,
        employeeId: subordinateIds
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // Export appraisal data
  static async exportAppraisal(appraisalId) {
    try {
      const appraisal = await Appraisal.findById(appraisalId);
      
      if (!appraisal) {
        throw new AppError('Appraisal not found', 404);
      }
      
      return appraisal.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // Bulk export appraisals
  static async bulkExportAppraisals(options = {}) {
    try {
      const result = await Appraisal.findAll({ ...options, limit: 1000 });
      
      const exportData = result.appraisals.map(appraisal => ({
        id: appraisal.id,
        employeeName: appraisal.employeeName,
        employeeId: appraisal.employeeEmployeeId,
        appraiserName: appraisal.appraiserName,
        appraiserId: appraisal.appraiserEmployeeId,
        periodStart: appraisal.periodStart,
        periodEnd: appraisal.periodEnd,
        status: appraisal.status,
        overallPercentage: appraisal.overallAssessment?.overallPercentage,
        overallRating: appraisal.overallAssessment?.overallRating,
        assessmentDecision: appraisal.assessmentDecision,
        createdAt: appraisal.createdAt
      }));
      
      return exportData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AppraisalService;
