const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class PerformancePlanningService {
    static async createPerformancePlanning(userId, data) {
        const { keyResultAreas, appraiseeSignatureUrl } = data;

        const query = `
      INSERT INTO performance_planning (
        user_id, key_result_areas, appraisee_signature_url
      ) VALUES ($1, $2, $3)
      RETURNING *
    `;

        const values = [
            userId,
            JSON.stringify(keyResultAreas),
            appraiseeSignatureUrl
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updatePerformancePlanning(id, data) {
        const { keyResultAreas, appraiseeSignatureUrl } = data;

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

        return result.rows[0];
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
