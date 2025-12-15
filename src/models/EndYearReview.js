const { query } = require('../config/database');

class EndYearReview {
  constructor(data) {
    this.id = data.id;
    this.appraisalId = data.appraisal_id;
    this.reviewDate = data.review_date;
    this.targetAssessments = data.target_assessments;
    this.competencyAssessments = data.competency_assessments;
    this.totalScore = data.total_score;
    this.averageScore = data.average_score;
    this.weightedScore = data.weighted_score;
    this.overallPerformance = data.overall_performance;
    this.strengths = data.strengths;
    this.areasForImprovement = data.areas_for_improvement;
    this.developmentRecommendations = data.development_recommendations;
    this.appraiserSignature = data.appraiser_signature;
    this.appraiseeSignature = data.appraisee_signature;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new end-year review
  static async create(reviewData) {
    const {
      appraisalId,
      reviewDate,
      targetAssessments = [],
      competencyAssessments = [],
      totalScore = 0.00,
      averageScore = 0.00,
      weightedScore = 0.00,
      overallPerformance,
      strengths,
      areasForImprovement,
      developmentRecommendations,
      status = 'draft'
    } = reviewData;

    const result = await query(`
      INSERT INTO end_year_reviews (
        appraisal_id, review_date, target_assessments, competency_assessments,
        total_score, average_score, weighted_score, overall_performance,
        strengths, areas_for_improvement, development_recommendations, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      appraisalId, reviewDate, JSON.stringify(targetAssessments), JSON.stringify(competencyAssessments),
      totalScore, averageScore, weightedScore, overallPerformance,
      strengths, areasForImprovement, developmentRecommendations, status
    ]);

    return new EndYearReview(result.rows[0]);
  }

  // Find end-year review by ID
  static async findById(id) {
    const result = await query(`
      SELECT eyr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM end_year_reviews eyr
      LEFT JOIN appraisals a ON eyr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      WHERE eyr.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const review = new EndYearReview(result.rows[0]);
    review.employee_id = result.rows[0].employee_id;
    review.appraiserId = result.rows[0].appraiser_id;
    review.employeeName = result.rows[0].employee_name;
    review.appraiserName = result.rows[0].appraiser_name;

    return review;
  }

  // Find end-year review by appraisal ID
  static async findByAppraisalId(appraisalId) {
    const result = await query(`
      SELECT eyr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM end_year_reviews eyr
      LEFT JOIN appraisals a ON eyr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      WHERE eyr.appraisal_id = $1
    `, [appraisalId]);

    if (result.rows.length === 0) return null;

    const review = new EndYearReview(result.rows[0]);
    review.employee_id = result.rows[0].employee_id;
    review.appraiserId = result.rows[0].appraiser_id;
    review.employeeName = result.rows[0].employee_name;
    review.appraiserName = result.rows[0].appraiser_name;

    return review;
  }

  // Get all end-year reviews with pagination
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
      whereClause += ` AND eyr.appraisal_id = $${paramCount}`;
      params.push(appraisalId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND eyr.status = $${paramCount}`;
      params.push(status);
    }

    if (reviewDate) {
      paramCount++;
      whereClause += ` AND eyr.review_date = $${paramCount}`;
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
      SELECT eyr.*, a.employee_id, a.appraiser_id, 
             e.name as employee_name, ap.name as appraiser_name
      FROM end_year_reviews eyr
      LEFT JOIN appraisals a ON eyr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
      ORDER BY eyr.review_date DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM end_year_reviews eyr
      LEFT JOIN appraisals a ON eyr.appraisal_id = a.id
      LEFT JOIN users e ON a.employee_id = e.id
      LEFT JOIN users ap ON a.appraiser_id = ap.id
      ${whereClause}
    `, params.slice(0, -2));

    const reviews = result.rows.map(row => {
      const review = new EndYearReview(row);
      review.employee_id = row.employee_id;
      review.appraiserId = row.appraiser_id;
      review.employeeName = row.employee_name;
      review.appraiserName = row.appraiser_name;
      return review;
    });

    return {
      endYearReviews: reviews,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Update end-year review
  async update(updateData) {
    const allowedFields = [
      'review_date', 'target_assessments', 'competency_assessments',
      'total_score', 'average_score', 'weighted_score', 'overall_performance',
      'strengths', 'areas_for_improvement', 'development_recommendations',
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
      UPDATE end_year_reviews 
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
      UPDATE end_year_reviews 
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
      UPDATE end_year_reviews 
      SET ${field} = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [signature, this.id]);

    this[field] = signature;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Delete end-year review
  async delete() {
    await query('DELETE FROM end_year_reviews WHERE id = $1', [this.id]);
    return true;
  }

  // Get end-year review data for API response
  toJSON() {
    return {
      id: this.id,
      appraisalId: this.appraisalId,
      reviewDate: this.reviewDate,
      targetAssessments: this.targetAssessments,
      competencyAssessments: this.competencyAssessments,
      totalScore: this.totalScore,
      averageScore: this.averageScore,
      weightedScore: this.weightedScore,
      overallPerformance: this.overallPerformance,
      strengths: this.strengths,
      areasForImprovement: this.areasForImprovement,
      developmentRecommendations: this.developmentRecommendations,
      appraiserSignature: this.appraiserSignature,
      appraiseeSignature: this.appraiseeSignature,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      employee_id: this.employee_id,
      appraiserId: this.appraiserId,
      employeeName: this.employeeName,
      appraiserName: this.appraiserName
    };
  }
}

module.exports = EndYearReview;
