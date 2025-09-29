const { query } = require('../config/database');

class MidYearReview {
  constructor(data) {
    this.id = data.id;
    this.appraisalId = data.appraisal_id;
    this.reviewDate = data.review_date;
    this.targetReviews = data.target_reviews;
    this.competencyReviews = data.competency_reviews;
    this.overallProgress = data.overall_progress;
    this.challengesFaced = data.challenges_faced;
    this.supportNeeded = data.support_needed;
    this.appraiserSignature = data.appraiser_signature;
    this.appraiseeSignature = data.appraisee_signature;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new mid-year review
  static async create(reviewData) {
    const {
      appraisalId,
      reviewDate,
      targetReviews = [],
      competencyReviews = [],
      overallProgress,
      challengesFaced,
      supportNeeded,
      status = 'draft'
    } = reviewData;

    const result = await query(`
      INSERT INTO mid_year_reviews (
        appraisal_id, review_date, target_reviews, competency_reviews,
        overall_progress, challenges_faced, support_needed, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      appraisalId, reviewDate, JSON.stringify(targetReviews), JSON.stringify(competencyReviews),
      overallProgress, challengesFaced, supportNeeded, status
    ]);

    return new MidYearReview(result.rows[0]);
  }

  // Find mid-year review by ID
  static async findById(id) {
    const result = await query(`
      SELECT myr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM mid_year_reviews myr
      LEFT JOIN appraisals a ON myr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      WHERE myr.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const review = new MidYearReview(result.rows[0]);
    review.employeeId = result.rows[0].employee_id;
    review.appraiserId = result.rows[0].appraiser_id;
    review.employeeName = result.rows[0].employee_name;
    review.appraiserName = result.rows[0].appraiser_name;

    return review;
  }

  // Find mid-year review by appraisal ID
  static async findByAppraisalId(appraisalId) {
    const result = await query(`
      SELECT myr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM mid_year_reviews myr
      LEFT JOIN appraisals a ON myr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      WHERE myr.appraisal_id = $1
    `, [appraisalId]);

    if (result.rows.length === 0) return null;

    const review = new MidYearReview(result.rows[0]);
    review.employeeId = result.rows[0].employee_id;
    review.appraiserId = result.rows[0].appraiser_id;
    review.employeeName = result.rows[0].employee_name;
    review.appraiserName = result.rows[0].appraiser_name;

    return review;
  }

  // Get all mid-year reviews with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      appraisalId,
      status,
      reviewDate,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (appraisalId) {
      paramCount++;
      whereClause += ` AND myr.appraisal_id = $${paramCount}`;
      params.push(appraisalId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND myr.status = $${paramCount}`;
      params.push(status);
    }

    if (reviewDate) {
      paramCount++;
      whereClause += ` AND myr.review_date = $${paramCount}`;
      params.push(reviewDate);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (e.name ILIKE $${paramCount} OR ap.name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT myr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM mid_year_reviews myr
      LEFT JOIN appraisals a ON myr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
      ORDER BY myr.review_date DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM mid_year_reviews myr
      LEFT JOIN appraisals a ON myr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
    `, params.slice(0, -2));

    const reviews = result.rows.map(row => {
      const review = new MidYearReview(row);
      review.employeeId = row.employee_id;
      review.appraiserId = row.appraiser_id;
      review.employeeName = row.employee_name;
      review.appraiserName = row.appraiser_name;
      return review;
    });

    return {
      midYearReviews: reviews,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Update mid-year review
  async update(updateData) {
    const allowedFields = [
      'review_date', 'target_reviews', 'competency_reviews',
      'overall_progress', 'challenges_faced', 'support_needed',
      'appraiser_signature', 'appraisee_signature', 'status'
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
      UPDATE mid_year_reviews 
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
      UPDATE mid_year_reviews 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, this.id]);

    this.status = status;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Add signature
  async addSignature(signatureType, signature) {
    const field = signatureType === 'appraiser' ? 'appraiser_signature' : 'appraisee_signature';
    
    const result = await query(`
      UPDATE mid_year_reviews 
      SET ${field} = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [signature, this.id]);

    this[field] = signature;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Delete mid-year review
  async delete() {
    await query('DELETE FROM mid_year_reviews WHERE id = $1', [this.id]);
    return true;
  }

  // Get mid-year review data for API response
  toJSON() {
    return {
      id: this.id,
      appraisalId: this.appraisalId,
      reviewDate: this.reviewDate,
      targetReviews: this.targetReviews,
      competencyReviews: this.competencyReviews,
      overallProgress: this.overallProgress,
      challengesFaced: this.challengesFaced,
      supportNeeded: this.supportNeeded,
      appraiserSignature: this.appraiserSignature,
      appraiseeSignature: this.appraiseeSignature,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      employeeId: this.employeeId,
      appraiserId: this.appraiserId,
      employeeName: this.employeeName,
      appraiserName: this.appraiserName
    };
  }
}

module.exports = MidYearReview;
