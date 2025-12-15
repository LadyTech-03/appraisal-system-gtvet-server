const Appraisal = require('../models/Appraisal');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { query } = require('../config/database');
const pool = require('../config/database')


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
      const employee = await User.findById(appraisalData.employee_id);
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
        { employee_id: appraisalData.employee_id }
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
  static async getAppraisalsByEmployee(employee_id, options = {}) {
    try {
      const result = await Appraisal.findByEmployeeId(employee_id, options);
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
      const user_id = user.id;
      const isAdmin = ['Director-General', 'System Administrator'].includes(user.role);

      // Get full user details
      const userResult = await query(`
        SELECT * FROM users WHERE id = $1
      `, [user_id]);

      const userDetails = userResult.rows[0];

      // Get appraisal counts by status for this user
      const statusCountsResult = await query(`
        SELECT status, COUNT(*)::int AS count
        FROM appraisals
        WHERE employee_id = $1
        GROUP BY status
      `, [user_id]);

      const statusCounts = statusCountsResult.rows.reduce((acc, row) => {
        acc[row.status] = row.count;
        return acc;
      }, { 'in-progress': 0, submitted: 0, reviewed: 0, completed: 0 });

      // Total appraisals count
      const totalAppraisalsCountResult = await query(`
        SELECT COUNT(*)::int AS count
        FROM appraisals
        WHERE employee_id = $1
      `, [user_id]);

      // Get count of users who have this user as manager
      const teamCountResult = await query(`
        SELECT COUNT(*)::int AS count
        FROM users
        WHERE manager_id = $1 AND is_active = true
      `, [user_id]);

      const averageRatingResult = await query(`
        SELECT AVG((overall_assessment->>'overallRating')::numeric) AS avg_rating
        FROM appraisals
        WHERE employee_id = $1 AND overall_assessment IS NOT NULL
      `, [user_id]);

      const averageRating = parseFloat(averageRatingResult.rows[0].avg_rating) || 0;

      const recentAppraisalsResult = await query(`
        SELECT a.*, 
               e.first_name as employee_first_name, e.surname as employee_surname, e.employee_id as employee_employee_id,
               ap.first_name as appraiser_first_name, ap.surname as appraiser_surname, ap.employee_id as appraiser_employee_id
        FROM appraisals a
        LEFT JOIN users e ON a.employee_id = e.id
        LEFT JOIN users ap ON a.appraiser_id = ap.id
        WHERE a.employee_id = $1 OR a.appraiser_id = $1
        ORDER BY a.updated_at DESC
        LIMIT 5
      `, [user_id]);

      const recentAppraisals = recentAppraisalsResult.rows.map(row => {
        const appraisal = new Appraisal(row).toJSON();
        // Add employee and appraiser names
        appraisal.employeeName = row.employee_first_name && row.employee_surname
          ? `${row.employee_first_name} ${row.employee_surname}`
          : null;
        appraisal.appraiserName = row.appraiser_first_name && row.appraiser_surname
          ? `${row.appraiser_first_name} ${row.appraiser_surname}`
          : null;
        appraisal.employeeEmployeeId = row.employee_employee_id;
        appraisal.appraiserEmployeeId = row.appraiser_employee_id;
        return appraisal;
      });

      const teamMembers = await User.findByManagerId(user_id);
      const teamMembersCount = teamMembers.length;

      let totalUsers = null;
      if (isAdmin) {
        const totalUsersResult = await query('SELECT COUNT(*)::int AS count FROM users WHERE is_active = true');
        totalUsers = totalUsersResult.rows[0].count;
      }

      return {
        // user: userDetails,
        totalAppraisals: totalAppraisalsCountResult.rows[0].count,
        appraisalsInProgress: statusCounts['in-progress'] || 0,
        appraisalsSubmitted: statusCounts.submitted || 0,
        appraisalsCompleted: statusCounts.completed || 0,
        appraisalsReviewed: statusCounts.reviewed || 0,
        teamMembersCount: teamCountResult.rows[0].count,

        // Legacy fields for backward compatibility
        myAppraisals: totalAppraisalsCountResult.rows[0].count,
        pendingAppraisals: statusCounts['in-progress'] || 0,
        completedAppraisals: statusCounts.completed || 0,
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
  static async getTeamAppraisals(manager_id, options = {}) {
    try {
      // Get manager's subordinates
      const subordinates = await User.findByManagerId(manager_id);
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
        employee_id: subordinateIds
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
        employee_id: appraisal.employeeEmployeeId,
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

  /**
   * Create or get existing appraisal for a user
   * Used when saving the first form (Personal Info)
   */
  static async createOrGetAppraisal(user_id, manager_id, periodStart, periodEnd) {
    try {
      // First, check if user has any active appraisal (in-progress or submitted)
      // If yes, update that one instead of creating new
      const activeAppraisalQuery = `
        SELECT id FROM appraisals 
        WHERE employee_id = $1 
        AND status IN ('in-progress', 'submitted')
        ORDER BY created_at DESC
        LIMIT 1
      `
      const activeAppraisal = await pool.query(activeAppraisalQuery, [user_id])

      if (activeAppraisal.rows.length > 0) {
        // User has an active appraisal, return that ID
        console.log(`Found active appraisal for user ${user_id}: ${activeAppraisal.rows[0].id}`)
        return activeAppraisal.rows[0].id
      }

      // No active appraisal found
      // Check if appraisal already exists for this specific period
      const existingQuery = `
        SELECT id FROM appraisals 
        WHERE employee_id = $1 AND period_start = $2 AND period_end = $3
        LIMIT 1
      `
      const existing = await pool.query(existingQuery, [user_id, periodStart, periodEnd])

      if (existing.rows.length > 0) {
        // Appraisal exists for this period (status is reviewed or completed)
        return existing.rows[0].id
      }

      // No active appraisal and no appraisal for this period
      // Safe to create new appraisal
      const insertQuery = `
        INSERT INTO appraisals (
          employee_id, appraiser_id, period_start, period_end, status,
          employee_info, appraiser_info, training_received, key_result_areas,
          mid_year_review, end_of_year_review, core_competencies, non_core_competencies,
          overall_assessment, appraiser_comments, training_development_plan,
          assessment_decision, appraisee_comments
        ) VALUES (
          $1, $2, $3, $4, 'in-progress',
          '{}', '{}', '[]', '[]', NULL, '{}', '[]', '[]', '{}', NULL, NULL, NULL, NULL
        )
        RETURNING id
      `
      const result = await pool.query(insertQuery, [user_id, manager_id, periodStart, periodEnd])
      console.log(`Created new appraisal for user ${user_id}: ${result.rows[0].id}`)
      return result.rows[0].id
    } catch (error) {
      console.error('Error creating/getting appraisal:', error)
      throw error
    }
  }

  /**
   * Update specific section of appraisal
   * Called when any form is saved
   */
  static async updateAppraisalSection(appraisalId, section, data) {
    try {
      let updateQuery
      let values

      switch (section) {
        case 'employee_info':
          updateQuery = `
            UPDATE appraisals 
            SET employee_info = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'appraiser_info':
          updateQuery = `
            UPDATE appraisals 
            SET appraiser_info = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'training_received':
          updateQuery = `
            UPDATE appraisals 
            SET training_received = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'key_result_areas':
          updateQuery = `
            UPDATE appraisals 
            SET key_result_areas = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'mid_year_review':
          updateQuery = `
            UPDATE appraisals 
            SET mid_year_review = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'end_of_year_review':
          updateQuery = `
            UPDATE appraisals 
            SET end_of_year_review = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
          `
          values = [JSON.stringify(data), appraisalId]
          break

        case 'annual_appraisal':
          updateQuery = `
            UPDATE appraisals 
            SET annual_appraisal = $1, 
                core_competencies = $2, 
                non_core_competencies = $3, 
                overall_assessment = $4, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $5
          `
          values = [
            JSON.stringify(data), // Store complete annual appraisal data
            JSON.stringify(data.coreCompetencies || []),
            JSON.stringify(data.nonCoreCompetencies || []),
            JSON.stringify(data.overallAssessment || {}),
            appraisalId
          ]
          break

        case 'final_sections':
          updateQuery = `
            UPDATE appraisals 
            SET appraiser_comments = $1, training_development_plan = $2,
                assessment_decision = $3, appraisee_comments = $4,
                appraiser_signature = $5, appraiser_signature_date = $6,
                appraisee_signature = $7, appraisee_signature_date = $8,
                hod_comments = $9, hod_name = $10,
                hod_signature = $11, hod_date = $12,
                status = 'submitted', updated_at = CURRENT_TIMESTAMP 
            WHERE id = $13
          `
          values = [
            data.appraiserComments,
            data.careerDevelopmentComments,
            data.assessmentDecision,
            data.appraiseeComments,
            data.appraiserSignatureUrl,
            data.appraiserDate,
            data.appraiseeSignatureUrl,
            data.appraiseeDate,
            data.hodComments,
            data.hodName,
            data.hodSignatureUrl,
            data.hodDate,
            appraisalId
          ]
          break

        default:
          throw new AppError('Invalid section type', 400)
      }

      await pool.query(updateQuery, values)
      return { success: true }
    } catch (error) {
      console.error('Error updating appraisal section:', error)
      throw error
    }
  }

  /**
   * Submit appraisal by consolidating all form data
   */
  static async submitAppraisal(user_id) {
    try {
      // Fetch all required data from individual tables
      const [personalInfo, performancePlanning, midYearReview, endYearReview, annualAppraisal, finalSections] = await Promise.all([
        pool.query('SELECT * FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]),
        pool.query('SELECT * FROM performance_planning WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]),
        pool.query('SELECT * FROM mid_year_review WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]),
        pool.query('SELECT * FROM end_year_review WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]),
        pool.query('SELECT * FROM annual_appraisal WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id]),
        pool.query('SELECT * FROM final_sections WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user_id])
      ])

      console.log('User ID:', user_id)
      console.log('Personal Info found:', personalInfo.rows.length)
      console.log('Performance Planning found:', performancePlanning.rows.length)
      console.log('Mid Year Review found:', midYearReview.rows.length)
      console.log('End Year Review found:', endYearReview.rows.length)
      console.log('Annual Appraisal found:', annualAppraisal.rows.length)
      console.log('Final Sections found:', finalSections.rows.length)

      const pInfo = personalInfo.rows[0]
      const pPlanning = performancePlanning.rows[0]
      const mReview = midYearReview.rows[0]
      const eReview = endYearReview.rows[0]
      const aAppraisal = annualAppraisal.rows[0]
      const fSections = finalSections.rows[0]

      // Validate required data with detailed error messages
      if (!pInfo) {
        console.error('No personal info found for user:', user_id)
        throw new AppError('Personal information is required. Please complete the Personal Info form first.', 400)
      }
      if (!pPlanning) {
        console.error('No performance planning found for user:', user_id)
        throw new AppError('Performance planning is required. Please complete the Performance Planning form first.', 400)
      }
      if (!eReview) {
        console.error('No end-year review found for user:', user_id)
        throw new AppError('End-year review is required. Please complete the End-Year Review form first.', 400)
      }
      // Annual appraisal is optional - only filled by appraiser/manager
      // if (!aAppraisal) {
      //   console.error('No annual appraisal found for user:', user_id)
      //   throw new AppError('Annual appraisal is required. Please complete the Annual Appraisal form first.', 400)
      // }
      if (!fSections) {
        console.error('No final sections found for user:', user_id)
        throw new AppError('Final sections are required. Please complete the Final Sections form first.', 400)
      }

      console.log('Annual Appraisal present:', !!aAppraisal)

      // Consolidate data into appraisals table
      const insertQuery = `
        INSERT INTO appraisals (
          employee_id, appraiser_id, period_start, period_end, status,
          employee_info, appraiser_info, training_received, key_result_areas,
          mid_year_review, end_of_year_review, core_competencies, non_core_competencies,
          overall_assessment, appraiser_comments, training_development_plan,
          assessment_decision, appraisee_comments, appraiser_signature,
          appraiser_signature_date, appraisee_signature, appraisee_signature_date,
          hod_comments, hod_name, hod_signature, hod_date
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
        )
        RETURNING *
      `

      const values = [
        user_id,
        pInfo.manager_id,
        pInfo.period_from,
        pInfo.period_to,
        'submitted',
        JSON.stringify({
          title: pInfo.title,
          other_title: pInfo.other_title,
          surname: pInfo.surname,
          first_name: pInfo.first_name,
          other_names: pInfo.other_names,
          gender: pInfo.gender,
          present_job_title: pInfo.present_job_title,
          grade_salary: pInfo.grade_salary,
          division: pInfo.division,
          date_of_appointment: pInfo.date_of_appointment
        }),
        JSON.stringify({
          title: pInfo.appraiser_title,
          other_title: pInfo.appraiser_other_title,
          surname: pInfo.appraiser_surname,
          first_name: pInfo.appraiser_first_name,
          other_names: pInfo.appraiser_other_names,
          position: pInfo.appraiser_position
        }),
        JSON.stringify(pInfo.training_records || []),
        JSON.stringify(pPlanning.key_result_areas || []),
        mReview ? JSON.stringify({
          targets: mReview.targets,
          competencies: mReview.competencies,
          appraisee_signature_url: mReview.appraisee_signature_url,
          appraisee_date: mReview.appraisee_date,
          appraiser_signature_url: mReview.appraiser_signature_url,
          appraiser_date: mReview.appraiser_date
        }) : null,
        JSON.stringify({
          targets: eReview.targets,
          calculations: eReview.calculations,
          appraisee_signature_url: eReview.appraisee_signature_url,
          appraisee_date: eReview.appraisee_date,
          appraiser_signature_url: eReview.appraiser_signature_url,
          appraiser_date: eReview.appraiser_date
        }),
        // Annual appraisal is optional (only filled by appraiser)
        aAppraisal ? JSON.stringify(aAppraisal.core_competencies || []) : JSON.stringify([]),
        aAppraisal ? JSON.stringify(aAppraisal.non_core_competencies || []) : JSON.stringify([]),
        aAppraisal ? JSON.stringify({
          performance_assessment_score: aAppraisal.performance_assessment_score,
          core_competencies_average: aAppraisal.core_competencies_average,
          non_core_competencies_average: aAppraisal.non_core_competencies_average,
          overall_total: aAppraisal.overall_total,
          overall_score_percentage: aAppraisal.overall_score_percentage
        }) : JSON.stringify({}),
        fSections.appraiser_comments,
        fSections.career_development_comments,
        fSections.assessment_decision,
        fSections.appraisee_comments,
        fSections.appraiser_signature_url,
        fSections.appraiser_date,
        fSections.appraisee_signature_url,
        fSections.appraisee_date,
        fSections.hod_comments,
        fSections.hod_name,
        fSections.hod_signature_url,
        fSections.hod_date
      ]

      const result = await pool.query(insertQuery, values)
      return result.rows[0]
    } catch (error) {
      console.error('Error submitting appraisal:', error)
      throw error
    }
  }

  /**
   * Approve appraisal (manager only)
   */
  static async approveAppraisal(appraisalId, manager_id, comments = null) {
    try {
      const pool = require('../config/database')

      // Check if appraisal exists and is submitted
      // (Permissions already verified by middleware)
      const checkQuery = `
        SELECT id, status FROM appraisals 
        WHERE id = $1 AND status = 'submitted'
      `
      const checkResult = await pool.query(checkQuery, [appraisalId])

      if (checkResult.rows.length === 0) {
        throw new AppError('Appraisal not found or cannot be approved (must be submitted)', 404)
      }

      const updateQuery = `
        UPDATE appraisals
        SET 
          manager_status = 'approved',
          manager_comments = $1,
          reviewed_by = $2,
          reviewed_at = CURRENT_TIMESTAMP,
          status = 'reviewed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `
      const result = await pool.query(updateQuery, [comments, manager_id, appraisalId])
      return result.rows[0]
    } catch (error) {
      console.error('Error approving appraisal:', error)
      throw error
    }
  }

  /**
   * Reject appraisal (manager only)
   */
  static async rejectAppraisal(appraisalId, manager_id, comments) {
    try {
      if (!comments || comments.trim() === '') {
        throw new AppError('Comments are required when rejecting an appraisal', 400)
      }

      const pool = require('../config/database')

      // Check if appraisal exists and is submitted
      // (Permissions already verified by middleware)
      const checkQuery = `
        SELECT id, status FROM appraisals 
        WHERE id = $1 AND status = 'submitted'
      `
      const checkResult = await pool.query(checkQuery, [appraisalId])

      if (checkResult.rows.length === 0) {
        throw new AppError('Appraisal not found or cannot be rejected (must be submitted)', 404)
      }

      const updateQuery = `
        UPDATE appraisals
        SET 
          manager_status = 'rejected',
          manager_comments = $1,
          reviewed_by = $2,
          reviewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `
      const result = await pool.query(updateQuery, [comments, manager_id, appraisalId])
      return result.rows[0]
    } catch (error) {
      console.error('Error rejecting appraisal:', error)
      throw error
    }
  }

  /**
   * Complete appraisal (manager only) - Sets status to reviewed and deletes form records
   */
  static async completeAppraisal(appraisalId, manager_id) {
    try {
      const pool = require('../config/database')

      // Check if appraisal exists and can be completed
      // (Permissions already verified by middleware)
      const checkQuery = `
        SELECT id, employee_id, appraiser_id, status FROM appraisals 
        WHERE id = $1
      `
      const checkResult = await pool.query(checkQuery, [appraisalId])

      if (checkResult.rows.length === 0) {
        throw new AppError('Appraisal not found', 404)
      }

      const appraisal = checkResult.rows[0]

      // Check if appraisal is in a state that can be completed
      if (appraisal.status !== 'reviewed') {
        throw new AppError(`Cannot complete appraisal with status '${appraisal.status}'. Only 'reviewed' appraisals can be completed.`, 400)
      }


      const employee_id = appraisal.employee_id

      // Update appraisal status to 'reviewed'
      const updateQuery = `
        UPDATE appraisals
        SET 
          status = 'reviewed',
          manager_status = 'approved',
          reviewed_by = $1,
          reviewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `
      const result = await pool.query(updateQuery, [manager_id, appraisalId])

      // Delete form records for this appraisal
      await pool.query('DELETE FROM personal_info WHERE appraisal_id = $1', [appraisalId])
      await pool.query('DELETE FROM performance_planning WHERE appraisal_id = $1', [appraisalId])
      await pool.query('DELETE FROM mid_year_review WHERE appraisal_id = $1', [appraisalId])
      await pool.query('DELETE FROM end_year_review WHERE appraisal_id = $1', [appraisalId])
      await pool.query('DELETE FROM annual_appraisal WHERE appraisal_id = $1', [appraisalId])
      await pool.query('DELETE FROM final_sections WHERE appraisal_id = $1', [appraisalId])

      console.log(`Appraisal ${appraisalId} completed and form records deleted`)

      return result.rows[0]
    } catch (error) {
      console.error('Error completing appraisal:', error)
      throw error
    }
  }
}

module.exports = AppraisalService;
