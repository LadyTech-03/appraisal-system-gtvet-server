const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class FinalSectionsService {
    static async createFinalSections(userId, data) {
        const {
            appraiserComments,
            appraiserSignatureUrl,
            appraiserDate,
            careerDevelopmentComments,
            assessmentDecision,
            appraiseeComments,
            appraiseeSignatureUrl,
            appraiseeDate
        } = data;

        const query = `
      INSERT INTO final_sections (
        user_id, appraiser_comments, appraiser_signature_url, appraiser_date,
        career_development_comments, assessment_decision,
        appraisee_comments, appraisee_signature_url, appraisee_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        const values = [
            userId,
            appraiserComments,
            appraiserSignatureUrl,
            appraiserDate,
            careerDevelopmentComments,
            assessmentDecision,
            appraiseeComments,
            appraiseeSignatureUrl,
            appraiseeDate
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateFinalSections(id, data) {
        const {
            appraiserComments,
            appraiserSignatureUrl,
            appraiserDate,
            careerDevelopmentComments,
            assessmentDecision,
            appraiseeComments,
            appraiseeSignatureUrl,
            appraiseeDate
        } = data;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (appraiserComments !== undefined) {
            updates.push(`appraiser_comments = $${paramCount}`);
            values.push(appraiserComments);
            paramCount++;
        }

        if (appraiserSignatureUrl !== undefined) {
            updates.push(`appraiser_signature_url = $${paramCount}`);
            values.push(appraiserSignatureUrl);
            paramCount++;
        }

        if (appraiserDate !== undefined) {
            updates.push(`appraiser_date = $${paramCount}`);
            values.push(appraiserDate);
            paramCount++;
        }

        if (careerDevelopmentComments !== undefined) {
            updates.push(`career_development_comments = $${paramCount}`);
            values.push(careerDevelopmentComments);
            paramCount++;
        }

        if (assessmentDecision !== undefined) {
            updates.push(`assessment_decision = $${paramCount}`);
            values.push(assessmentDecision);
            paramCount++;
        }

        if (appraiseeComments !== undefined) {
            updates.push(`appraisee_comments = $${paramCount}`);
            values.push(appraiseeComments);
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
      UPDATE final_sections 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Final sections record not found');
        }

        return result.rows[0];
    }

    static async getFinalSectionsById(id) {
        const query = 'SELECT * FROM final_sections WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Final sections record not found');
        }

        return result.rows[0];
    }

    static async getFinalSectionsByUserId(userId) {
        const query = 'SELECT * FROM final_sections WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async deleteFinalSections(id) {
        const query = 'DELETE FROM final_sections WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Final sections record not found');
        }
    }
}

module.exports = FinalSectionsService;
