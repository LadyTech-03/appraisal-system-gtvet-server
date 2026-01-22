const { query } = require('../config/database');

class Appraisal {
  constructor(data) {
    this.id = data.id;
    this.employee_id = data.employee_id;
    this.appraiserId = data.appraiser_id;
    this.periodStart = data.period_start;
    this.periodEnd = data.period_end;
    this.status = data.status;
    this.employeeInfo = data.employee_info;
    this.appraiserInfo = data.appraiser_info;
    this.trainingReceived = data.training_received;
    this.keyResultAreas = data.key_result_areas;
    this.midYearReview = data.mid_year_review;
    this.endOfYearReview = data.end_of_year_review;
    this.coreCompetencies = data.core_competencies;
    this.nonCoreCompetencies = data.non_core_competencies;
    this.overallAssessment = data.overall_assessment;
    this.appraiserComments = data.appraiser_comments;
    this.trainingDevelopmentPlan = data.training_development_plan;
    this.assessmentDecision = data.assessment_decision;
    this.appraiseeComments = data.appraisee_comments;
    this.appraiseeCommentsDate = data.appraisee_comments_date;
    this.hodComments = data.hod_comments;
    this.hodName = data.hod_name;
    this.hodSignature = data.hod_signature;
    this.hodDate = data.hod_date;
    this.appraiserSignature = data.appraiser_signature;
    this.appraiserSignatureDate = data.appraiser_signature_date;
    this.appraiseeSignature = data.appraisee_signature;
    this.currentStep = data.current_step;
    this.managerCurrentStep = data.manager_current_step;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new appraisal
  static async create(appraisalData) {
    const {
      employee_id,
      appraiserId,
      periodStart,
      periodEnd,
      employeeInfo,
      appraiserInfo,
      trainingReceived = [],
      keyResultAreas = [],
      endOfYearReview,
      coreCompetencies,
      nonCoreCompetencies,
      overallAssessment
    } = appraisalData;

    const result = await query(`
      INSERT INTO appraisals (
        employee_id, appraiser_id, period_start, period_end,
        employee_info, appraiser_info, training_received, key_result_areas,
        end_of_year_review, core_competencies, non_core_competencies, overall_assessment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      employee_id, appraiserId, periodStart, periodEnd,
      JSON.stringify(employeeInfo), JSON.stringify(appraiserInfo),
      JSON.stringify(trainingReceived), JSON.stringify(keyResultAreas),
      JSON.stringify(endOfYearReview), JSON.stringify(coreCompetencies),
      JSON.stringify(nonCoreCompetencies), JSON.stringify(overallAssessment)
    ]);

    return new Appraisal(result.rows[0]);
  }

  // Find appraisal by ID
  static async findById(id) {
    const result = await query(`
      SELECT a.*, 
             CONCAT(e.first_name, ' ', e.surname) as employee_name, e.employee_id as employee_employee_id,
             CONCAT(ap.first_name, ' ', ap.surname) as appraiser_name, ap.employee_id as appraiser_employee_id
      FROM appraisals a
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const appraisal = new Appraisal(result.rows[0]);
    appraisal.employeeName = result.rows[0].employee_name;
    appraisal.employeeEmployeeId = result.rows[0].employee_employee_id;
    appraisal.appraiserName = result.rows[0].appraiser_name;
    appraisal.appraiserEmployeeId = result.rows[0].appraiser_employee_id;

    return appraisal;
  }

  // Get all appraisals with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      employee_id,
      appraiserId,
      status,
      periodStart,
      periodEnd,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (employee_id) {
      paramCount++;
      whereClause += ` AND a.employee_id = $${paramCount}`;
      params.push(employee_id);
    }

    if (appraiserId) {
      paramCount++;
      whereClause += ` AND a.appraiser_id = $${paramCount}`;
      params.push(appraiserId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    if (periodStart) {
      paramCount++;
      whereClause += ` AND a.period_start >= $${paramCount}`;
      params.push(periodStart);
    }

    if (periodEnd) {
      paramCount++;
      whereClause += ` AND a.period_end <= $${paramCount}`;
      params.push(periodEnd);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (e.first_name ILIKE $${paramCount} OR e.surname ILIKE $${paramCount} OR ap.first_name ILIKE $${paramCount} OR ap.surname ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT a.*, 
             CONCAT(e.first_name, ' ', e.surname) as employee_name, e.employee_id as employee_employee_id,
             CONCAT(ap.first_name, ' ', ap.surname) as appraiser_name, ap.employee_id as appraiser_employee_id
      FROM appraisals a
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM appraisals a
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
    `, params.slice(0, -2));

    const appraisals = result.rows.map(row => {
      const appraisal = new Appraisal(row);
      appraisal.employeeName = row.employee_name;
      appraisal.employeeEmployeeId = row.employee_employee_id;
      appraisal.appraiserName = row.appraiser_name;
      appraisal.appraiserEmployeeId = row.appraiser_employee_id;
      return appraisal;
    });

    return {
      appraisals,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Get appraisals by employee ID
  static async findByEmployeeId(employee_id, options = {}) {
    console.log(employee_id, 'employee_id')
    return await this.findAll({ ...options, employee_id });
  }

  // Get appraisals by appraiser ID
  static async findByAppraiserId(appraiserId, options = {}) {
    return await this.findAll({ ...options, appraiserId });
  }

  // Get appraisals for a specific period
  static async findByPeriod(periodStart, periodEnd, options = {}) {
    return await this.findAll({ ...options, periodStart, periodEnd });
  }

  // Update appraisal
  async update(updateData) {
    const allowedFields = [
      'status', 'current_step', 'manager_current_step', 'employee_info', 'appraiser_info', 'training_received',
      'key_result_areas', 'mid_year_review', 'end_of_year_review',
      'core_competencies', 'non_core_competencies', 'overall_assessment',
      'appraiser_comments', 'training_development_plan', 'assessment_decision',
      'appraisee_comments', 'hod_comments', 'hod_name', 'hod_signature',
      'hod_date', 'appraiser_signature', 'appraiser_signature_date',
      'appraisee_signature', 'appraisee_signature_date'
    ];

    const updates = [];
    const values = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        // Stringify JSON fields
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(this.id);

    const result = await query(`
      UPDATE appraisals 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Update status
  async updateStatus(status) {
    const result = await query(`
      UPDATE appraisals 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, this.id]);

    this.status = status;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Add signature
  async addSignature(signatureData) {
    const {
      signatoryType,
      signatoryId,
      signatureData: signature,
      signatureFileUrl,
      ipAddress,
      userAgent
    } = signatureData;

    await query(`
      INSERT INTO signatures (
        appraisal_id, signatory_type, signatory_id, signature_data,
        signature_file_url, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      this.id, signatoryType, signatoryId, signature,
      signatureFileUrl, ipAddress, userAgent
    ]);

    return this;
  }

  // Get signatures
  async getSignatures() {
    const result = await query(`
      SELECT s.*, CONCAT(u.first_name, ' ', u.surname) as signatory_name
      FROM signatures s
      LEFT JOIN users u ON s.signatory_id = u.id
      WHERE s.appraisal_id = $1
      ORDER BY s.signed_at
    `, [this.id]);

    return result.rows;
  }

  // Delete appraisal
  async delete() {
    await query('DELETE FROM appraisals WHERE id = $1', [this.id]);
    return true;
  }

  // Get appraisal data for API response
  toJSON() {
    return {
      id: this.id,
      employee_id: this.employee_id,
      appraiserId: this.appraiserId,
      periodStart: this.periodStart,
      periodEnd: this.periodEnd,
      status: this.status,
      employeeInfo: this.employeeInfo,
      appraiserInfo: this.appraiserInfo,
      trainingReceived: this.trainingReceived,
      keyResultAreas: this.keyResultAreas,
      midYearReview: this.midYearReview,
      endOfYearReview: this.endOfYearReview,
      coreCompetencies: this.coreCompetencies,
      nonCoreCompetencies: this.nonCoreCompetencies,
      overallAssessment: this.overallAssessment,
      appraiserComments: this.appraiserComments,
      trainingDevelopmentPlan: this.trainingDevelopmentPlan,
      assessmentDecision: this.assessmentDecision,
      appraiseeComments: this.appraiseeComments,
      appraiseeCommentsDate: this.appraiseeCommentsDate,
      hodComments: this.hodComments,
      hodName: this.hodName,
      hodSignature: this.hodSignature,
      hodDate: this.hodDate,
      appraiserSignature: this.appraiserSignature,
      appraiserSignatureDate: this.appraiserSignatureDate,
      appraiseeSignature: this.appraiseeSignature,
      currentStep: this.currentStep,
      managerCurrentStep: this.managerCurrentStep,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      employeeName: this.employeeName,
      employeeEmployeeId: this.employeeEmployeeId,
      appraiserName: this.appraiserName,
      appraiserEmployeeId: this.appraiserEmployeeId
    };
  }
}

module.exports = Appraisal;
