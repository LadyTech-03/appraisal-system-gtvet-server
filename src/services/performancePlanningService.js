const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

class PerformancePlanningService {
    static async createPerformancePlanning(userId, data) {
        const { keyResultAreas, appraiseeSignatureUrl, appraiserSignatureUrl } = data;

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const managerId = userResult.rows[0]?.manager_id || null;

        // Get appraisal_id from personal_info
        const appraisalQuery = 'SELECT appraisal_id FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
        const appraisalResult = await pool.query(appraisalQuery, [userId]);
        const appraisalId = appraisalResult.rows[0]?.appraisal_id || null;

        const query = `
        INSERT INTO performance_planning (
            user_id, manager_id, appraisal_id, key_result_areas, appraisee_signature_url, appraiser_signature_url
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;

        const values = [
            userId,
            managerId,
            appraisalId,
            JSON.stringify(keyResultAreas),
            appraiseeSignatureUrl,
            appraiserSignatureUrl
        ];

        const result = await pool.query(query, values);
        const performancePlanning = result.rows[0];

        // Update appraisal table
        if (appraisalId) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'key_result_areas', keyResultAreas);
        }

        return performancePlanning;
    }

    static async updatePerformancePlanning(id, data) {
        const { keyResultAreas, appraiseeSignatureUrl, appraiserSignatureUrl } = data;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (keyResultAreas !== undefined) {
            updates.push(`key_result_areas = $${paramCount}`);
            values.push(JSON.stringify(keyResultAreas));
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

        if (updates.length === 0) {
            throw new ValidationError('No fields to update');
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        values.push(id);
        const query = `
      UPDATE performance_planning 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Performance planning record not found');
        }

        const performancePlanning = result.rows[0];

        // Update appraisal table
        if (performancePlanning.appraisal_id && keyResultAreas) {
            await AppraisalService.updateAppraisalSection(performancePlanning.appraisal_id, 'key_result_areas', keyResultAreas);
        }

        return performancePlanning;
    }


    static async getPerformancePlanningById(id) {
        const query = 'SELECT * FROM performance_planning WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Performance planning record not found');
        }

        return result.rows[0];
    }

    static async getPerformancePlanningByUserId(userId) {
        const query = 'SELECT * FROM performance_planning WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async deletePerformancePlanning(id) {
        const query = 'DELETE FROM performance_planning WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Performance planning record not found');
        }
    }
}


module.exports = PerformancePlanningService;
