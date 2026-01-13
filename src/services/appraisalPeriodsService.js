const pool = require('../config/database');
const { NotFoundError } = require('../middleware/errorHandler');

class AppraisalPeriodsService {
    /**
     * Get availability status for all sections
     * Checks dates and updates is_available in database before returning
     */
    static async getAvailability() {
        // First, update any sections where opens_at has passed
        await pool.query(`
            UPDATE appraisal_periods
            SET is_available = true
            WHERE opens_at IS NOT NULL 
            AND opens_at <= CURRENT_TIMESTAMP
            AND is_available = false
        `);

        // Then fetch and return the current state
        const query = `
            SELECT section_name, is_available, opens_at, message
            FROM appraisal_periods
            ORDER BY 
                CASE section_name
                    WHEN 'personal_info' THEN 1
                    WHEN 'performance_planning' THEN 2
                    WHEN 'mid_year_review' THEN 3
                    WHEN 'end_year_review' THEN 4
                    WHEN 'final_sections' THEN 5
                    ELSE 6
                END
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    /**
     * Get availability status for a specific section
     * Checks dates and updates is_available in database before returning
     */
    static async getSectionAvailability(sectionName) {
        // First, update if opens_at has passed
        await pool.query(`
            UPDATE appraisal_periods
            SET is_available = true
            WHERE section_name = $1
            AND opens_at IS NOT NULL 
            AND opens_at <= CURRENT_TIMESTAMP
            AND is_available = false
        `, [sectionName]);

        // Then fetch and return
        const query = `
            SELECT section_name, is_available, opens_at, message
            FROM appraisal_periods
            WHERE section_name = $1
        `;
        const result = await pool.query(query, [sectionName]);

        if (result.rows.length === 0) {
            throw new NotFoundError(`Section '${sectionName}' not found`);
        }

        return result.rows[0];
    }

    /**
     * Update availability for a section (Admin only)
     * Toggle OFF: Clears opens_at and sets is_available = false
     * Toggle ON: Keeps/sets opens_at and calculates is_available based on date
     */
    static async updateAvailability(sectionName, data) {
        const { isAvailable, opensAt, message } = data;

        const updates = [];
        const values = [];
        let paramCount = 1;

        // Handle toggle logic
        if (isAvailable !== undefined) {
            if (isAvailable === false) {
                // Toggle OFF: Clear opens_at and set is_available = false
                updates.push(`is_available = false`);
                updates.push(`opens_at = NULL`);
            } else { // isAvailable === true
                // Toggle ON: Calculate is_available based on opens_at
                if (opensAt !== undefined) {
                    // If setting a new opens_at date with toggle ON
                    updates.push(`opens_at = $${paramCount}`);
                    values.push(opensAt);
                    paramCount++;

                    // Check if the date has already passed
                    const checkDate = new Date(opensAt);
                    const now = new Date();
                    updates.push(`is_available = ${checkDate <= now ? 'true' : 'false'}`);
                } else {
                    // Toggle ON without changing opens_at - set immediately available
                    updates.push(`is_available = true`);
                }
            }
        } else if (opensAt !== undefined) {
            // Just updating opens_at without toggle - update date and recalculate
            updates.push(`opens_at = $${paramCount}`);
            values.push(opensAt);
            paramCount++;

            const checkDate = new Date(opensAt);
            const now = new Date();
            updates.push(`is_available = ${checkDate <= now ? 'true' : 'false'}`);
        }

        if (message !== undefined) {
            updates.push(`message = $${paramCount}`);
            values.push(message);
            paramCount++;
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(sectionName); // sectionName is the last parameter for the WHERE clause

        const query = `
            UPDATE appraisal_periods
            SET ${updates.join(', ')}
            WHERE section_name = $${paramCount}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError(`Section '${sectionName}' not found`);
        }

        return result.rows[0];
    }
}

module.exports = AppraisalPeriodsService;
