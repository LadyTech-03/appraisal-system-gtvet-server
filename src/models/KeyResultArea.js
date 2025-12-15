const { query } = require('../config/database');

class KeyResultArea {
  constructor(data) {
    this.id = data.id;
    this.appraisalId = data.appraisal_id;
    this.area = data.area;
    this.targets = data.targets;
    this.resourcesRequired = data.resources_required;
    this.weight = data.weight;
    this.midYearProgress = data.mid_year_progress;
    this.midYearRemarks = data.mid_year_remarks;
    this.endYearAssessment = data.end_year_assessment;
    this.endYearScore = data.end_year_score;
    this.endYearComments = data.end_year_comments;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new key result area
  static async create(kraData) {
    const {
      appraisalId,
      area,
      targets,
      resourcesRequired,
      weight = 0.00
    } = kraData;

    const result = await query(`
      INSERT INTO key_result_areas (
        appraisal_id, area, targets, resources_required, weight
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [appraisalId, area, targets, resourcesRequired, weight]);

    return new KeyResultArea(result.rows[0]);
  }

  // Find key result area by ID
  static async findById(id) {
    const result = await query(`
      SELECT kra.*, a.employee_id, a.appraiser_id, u.name as employee_name
      FROM key_result_areas kra
      LEFT JOIN appraisals a ON kra.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      WHERE kra.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const kra = new KeyResultArea(result.rows[0]);
    kra.employee_id = result.rows[0].employee_id;
    kra.appraiserId = result.rows[0].appraiser_id;
    kra.employeeName = result.rows[0].employee_name;

    return kra;
  }

  // Get all key result areas for an appraisal
  static async findByAppraisalId(appraisalId) {
    const result = await query(`
      SELECT * FROM key_result_areas 
      WHERE appraisal_id = $1
      ORDER BY created_at
    `, [appraisalId]);

    return result.rows.map(row => new KeyResultArea(row));
  }

  // Get all key result areas with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      appraisalId,
      area,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (appraisalId) {
      paramCount++;
      whereClause += ` AND kra.appraisal_id = $${paramCount}`;
      params.push(appraisalId);
    }

    if (area) {
      paramCount++;
      whereClause += ` AND kra.area ILIKE $${paramCount}`;
      params.push(`%${area}%`);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (kra.area ILIKE $${paramCount} OR kra.targets ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT kra.*, a.employee_id, a.appraiser_id, u.name as employee_name
      FROM key_result_areas kra
      LEFT JOIN appraisals a ON kra.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      ${whereClause}
      ORDER BY kra.created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM key_result_areas kra
      LEFT JOIN appraisals a ON kra.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      ${whereClause}
    `, params.slice(0, -2));

    const kras = result.rows.map(row => {
      const kra = new KeyResultArea(row);
      kra.employee_id = row.employee_id;
      kra.appraiserId = row.appraiser_id;
      kra.employeeName = row.employee_name;
      return kra;
    });

    return {
      keyResultAreas: kras,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Update key result area
  async update(updateData) {
    const allowedFields = [
      'area', 'targets', 'resources_required', 'weight',
      'mid_year_progress', 'mid_year_remarks', 'end_year_assessment',
      'end_year_score', 'end_year_comments'
    ];

    const updates = [];
    const values = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(this.id);

    const result = await query(`
      UPDATE key_result_areas 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Update mid-year review
  async updateMidYearReview(progress, remarks) {
    const result = await query(`
      UPDATE key_result_areas 
      SET mid_year_progress = $1, mid_year_remarks = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [progress, remarks, this.id]);

    this.midYearProgress = progress;
    this.midYearRemarks = remarks;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Update end-year assessment
  async updateEndYearAssessment(assessment, score, comments) {
    const result = await query(`
      UPDATE key_result_areas 
      SET end_year_assessment = $1, end_year_score = $2, end_year_comments = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [assessment, score, comments, this.id]);

    this.endYearAssessment = assessment;
    this.endYearScore = score;
    this.endYearComments = comments;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Delete key result area
  async delete() {
    await query('DELETE FROM key_result_areas WHERE id = $1', [this.id]);
    return true;
  }

  // Get key result area data for API response
  toJSON() {
    return {
      id: this.id,
      appraisalId: this.appraisalId,
      area: this.area,
      targets: this.targets,
      resourcesRequired: this.resourcesRequired,
      weight: this.weight,
      midYearProgress: this.midYearProgress,
      midYearRemarks: this.midYearRemarks,
      endYearAssessment: this.endYearAssessment,
      endYearScore: this.endYearScore,
      endYearComments: this.endYearComments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      employee_id: this.employee_id,
      appraiserId: this.appraiserId,
      employeeName: this.employeeName
    };
  }
}

module.exports = KeyResultArea;
