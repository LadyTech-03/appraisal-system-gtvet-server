const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class MidYearReviewService {
    static async createMidYearReview(userId, data) {
        const { targets, competencies, appraiseeSignatureUrl, appraiseeDate, appraiserSignatureUrl, appraiserDate } = data;

        const query = `
      INSERT INTO mid_year_review (
        user_id, targets, competencies, appraisee_signature_url, appraisee_date, appraiser_signature_url, appraiser_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const values = [
            userId,
            JSON.stringify(targets),
            JSON.stringify(competencies),
            appraiseeSignatureUrl,
            appraiseeDate,
            appraiserSignatureUrl,
            appraiserDate
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateMidYearReview(id, data) {
        const { targets, competencies, appraiseeSignatureUrl, appraiseeDate, appraiserSignatureUrl, appraiserDate } = data;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (targets !== undefined) {
            updates.push(`targets = $${paramCount}`);
            values.push(JSON.stringify(targets));
            paramCount++;
        }

        if (competencies !== undefined) {
            updates.push(`competencies = $${paramCount}`);
            values.push(JSON.stringify(competencies));
            paramCount++;
        }

        if (appraiseeSignatureUrl !== undefined) {
            updates.push(`appraisee_signature_url = $${paramCount}`);
            values.push(appraiseeSignatureUrl);
            paramCount++;
        }

        if (appraiserSignatureUrl !== undefined) {
            updates.push(`appraiser_signature_url = $${paramCount}`);
            values.push(appraiserSignatureUrl);
            paramCount++;
        }

        if (appraiseeDate !== undefined) {
            updates.push(`appraisee_date = $${paramCount}`);
            values.push(appraiseeDate);
            paramCount++;
        }

        if (appraiserDate !== undefined) {
            updates.push(`appraiser_date = $${paramCount}`);
            values.push(appraiserDate);
            paramCount++;
        }

        if (updates.length === 0) {
            throw new ValidationError('No fields to update');
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        values.push(id);
        const query = `
      UPDATE mid_year_review 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Mid-year review record not found');
        }

        return result.rows[0];
    }

    static async getMidYearReviewById(id) {
        const query = 'SELECT * FROM mid_year_review WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Mid-year review record not found');
        }

        return result.rows[0];
    }

    static async getMidYearReviewByUserId(userId) {
        const query = 'SELECT * FROM mid_year_review WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async deleteMidYearReview(id) {
        const query = 'DELETE FROM mid_year_review WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Mid-year review record not found');
        }
    }
}

module.exports = MidYearReviewService;
