const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class EndYearReviewService {
    static async createEndYearReview(userId, data) {
        const { targets, calculations, appraiseeSignatureUrl, appraiseeDate } = data;

        const query = `
      INSERT INTO end_year_review (
        user_id, targets, calculations, appraisee_signature_url, appraisee_date
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const values = [
            userId,
            JSON.stringify(targets),
            calculations ? JSON.stringify(calculations) : null,
            appraiseeSignatureUrl,
            appraiseeDate
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateEndYearReview(id, data) {
        const { targets, calculations, appraiseeSignatureUrl, appraiseeDate } = data;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (targets !== undefined) {
            updates.push(`targets = $${paramCount}`);
            values.push(JSON.stringify(targets));
            paramCount++;
        }

        if (calculations !== undefined) {
            updates.push(`calculations = $${paramCount}`);
            values.push(calculations ? JSON.stringify(calculations) : null);
            paramCount++;
        }

        if (appraiseeSignatureUrl !== undefined) {
            updates.push(`appraisee_signature_url = $${paramCount}`);
            values.push(appraiseeSignatureUrl);
            paramCount++;
        }

        if (appraiseeDate !== undefined) {
            updates.push(`appraisee_date = $${paramCount}`);
            values.push(appraiseeDate);
            paramCount++;
        }

        if (updates.length === 0) {
            throw new ValidationError('No fields to update');
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        values.push(id);
        const query = `
      UPDATE end_year_review 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('End-year review record not found');
        }

        return result.rows[0];
    }

    static async getEndYearReviewById(id) {
        const query = 'SELECT * FROM end_year_review WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('End-year review record not found');
        }

        return result.rows[0];
    }

    static async getEndYearReviewByUserId(userId) {
        const query = 'SELECT * FROM end_year_review WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async deleteEndYearReview(id) {
        const query = 'DELETE FROM end_year_review WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('End-year review record not found');
        }
    }
}

module.exports = EndYearReviewService;
