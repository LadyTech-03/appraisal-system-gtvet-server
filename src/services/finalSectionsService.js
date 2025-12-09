const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

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

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const managerId = userResult.rows[0]?.manager_id || null;

        // Get appraisal_id from personal_info
        const appraisalQuery = 'SELECT appraisal_id FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
        const appraisalResult = await pool.query(appraisalQuery, [userId]);
        const appraisalId = appraisalResult.rows[0]?.appraisal_id || null;

        const query = `
      INSERT INTO final_sections (
        user_id, manager_id, appraisal_id, appraiser_comments, appraiser_signature_url, appraiser_date,
        career_development_comments, assessment_decision,
        appraisee_comments, appraisee_signature_url, appraisee_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

        const values = [
            userId,
            managerId,
            appraisalId,
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
        const finalSections = result.rows[0];

        // Update appraisal table and set status to 'submitted'
        if (appraisalId) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'final_sections', {
                appraiserComments,
                careerDevelopmentComments,
                assessmentDecision,
                appraiseeComments,
                appraiserSignatureUrl,
                appraiserDate,
                appraiseeSignatureUrl,
                appraiseeDate
            });
        }

        return finalSections;
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
            throw new NotFoundError('Record not found');
        }

        const finalSections = result.rows[0];

        // Update appraisal table
        if (finalSections.appraisal_id) {
            await AppraisalService.updateAppraisalSection(finalSections.appraisal_id, 'final_sections', data);
        }

        return finalSections;
    }

    static async getFinalSectionsById(id) {
        const query = 'SELECT * FROM final_sections WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Record not found');
        }

        return result.rows;
    }

    static async getFinalSectionsByUserId(userId) {
        const query = 'SELECT * FROM final_sections WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Record not found');
        }
        console.log(result.rows, 'this is the final sections')
        return result.rows;
    }

    static async deleteFinalSections(id) {
        const query = 'DELETE FROM final_sections WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Record not found');
        }
    }
}

module.exports = FinalSectionsService;
