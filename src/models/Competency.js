const { query } = require('../config/database');

class Competency {
  constructor(data) {
    this.id = data.id;
    this.appraisalId = data.appraisal_id;
    this.competencyType = data.competency_type;
    this.competencyName = data.competency_name;
    this.description = data.description;
    this.weight = data.weight;
    this.midYearScore = data.mid_year_score;
    this.endYearScore = data.end_year_score;
    this.midYearComments = data.mid_year_comments;
    this.endYearComments = data.end_year_comments;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new competency
  static async create(competencyData) {
    const {
      appraisalId,
      competencyType,
      competencyName,
      description,
      weight = 0.00
    } = competencyData;

    const result = await query(`
      INSERT INTO competencies (
        appraisal_id, competency_type, competency_name, description, weight
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [appraisalId, competencyType, competencyName, description, weight]);

    return new Competency(result.rows[0]);
  }

  // Find competency by ID
  static async findById(id) {
    const result = await query(`
      SELECT c.*, a.employee_id, a.appraiser_id, u.name as employee_name
      FROM competencies c
      LEFT JOIN appraisals a ON c.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const competency = new Competency(result.rows[0]);
    competency.employee_id = result.rows[0].employee_id;
    competency.appraiserId = result.rows[0].appraiser_id;
    competency.employeeName = result.rows[0].employee_name;

    return competency;
  }

  // Get all competencies for an appraisal
  static async findByAppraisalId(appraisalId) {
    const result = await query(`
      SELECT * FROM competencies 
      WHERE appraisal_id = $1
      ORDER BY competency_type, competency_name
    `, [appraisalId]);

    return result.rows.map(row => new Competency(row));
  }

  // Get competencies by type for an appraisal
  static async findByAppraisalIdAndType(appraisalId, competencyType) {
    const result = await query(`
      SELECT * FROM competencies 
      WHERE appraisal_id = $1 AND competency_type = $2
      ORDER BY competency_name
    `, [appraisalId, competencyType]);

    return result.rows.map(row => new Competency(row));
  }

  // Get all competencies with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      appraisalId,
      competencyType,
      competencyName,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (appraisalId) {
      paramCount++;
      whereClause += ` AND c.appraisal_id = $${paramCount}`;
      params.push(appraisalId);
    }

    if (competencyType) {
      paramCount++;
      whereClause += ` AND c.competency_type = $${paramCount}`;
      params.push(competencyType);
    }

    if (competencyName) {
      paramCount++;
      whereClause += ` AND c.competency_name ILIKE $${paramCount}`;
      params.push(`%${competencyName}%`);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (c.competency_name ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT c.*, a.employee_id, a.appraiser_id, u.name as employee_name
      FROM competencies c
      LEFT JOIN appraisals a ON c.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      ${whereClause}
      ORDER BY c.competency_type, c.competency_name
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM competencies c
      LEFT JOIN appraisals a ON c.appraisal_id = a.id
      LEFT JOIN users u ON a.employee_id = u.id
      ${whereClause}
    `, params.slice(0, -2));

    const competencies = result.rows.map(row => {
      const competency = new Competency(row);
      competency.employee_id = row.employee_id;
      competency.appraiserId = row.appraiser_id;
      competency.employeeName = row.employee_name;
      return competency;
    });

    return {
      competencies,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Update competency
  async update(updateData) {
    const allowedFields = [
      'competency_name', 'description', 'weight', 'mid_year_score',
      'end_year_score', 'mid_year_comments', 'end_year_comments'
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
      UPDATE competencies 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Update mid-year score
  async updateMidYearScore(score, comments) {
    const result = await query(`
      UPDATE competencies 
      SET mid_year_score = $1, mid_year_comments = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [score, comments, this.id]);

    this.midYearScore = score;
    this.midYearComments = comments;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Update end-year score
  async updateEndYearScore(score, comments) {
    const result = await query(`
      UPDATE competencies 
      SET end_year_score = $1, end_year_comments = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [score, comments, this.id]);

    this.endYearScore = score;
    this.endYearComments = comments;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Delete competency
  async delete() {
    await query('DELETE FROM competencies WHERE id = $1', [this.id]);
    return true;
  }

  // Get competency data for API response
  toJSON() {
    return {
      id: this.id,
      appraisalId: this.appraisalId,
      competencyType: this.competencyType,
      competencyName: this.competencyName,
      description: this.description,
      weight: this.weight,
      midYearScore: this.midYearScore,
      endYearScore: this.endYearScore,
      midYearComments: this.midYearComments,
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

module.exports = Competency;
