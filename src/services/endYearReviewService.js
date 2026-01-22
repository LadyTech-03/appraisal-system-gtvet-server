const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

class EndYearReviewService {
    static async createEndYearReview(user_id, data) {
        const { targets, calculations, appraiseeSignatureUrl, appraiseeDate, appraiserSignatureUrl, appraiserDate } = data;

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);
        const manager_id = userResult.rows[0]?.manager_id || null;

        // Get appraisal_id from personal_info
        const appraisalQuery = 'SELECT appraisal_id FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
        const appraisalResult = await pool.query(appraisalQuery, [user_id]);
        const appraisalId = appraisalResult.rows[0]?.appraisal_id || null;

        const query = `
      INSERT INTO end_year_review (
        user_id, manager_id, appraisal_id, targets, calculations, appraisee_signature_url, appraisee_date, appraiser_signature_url, appraiser_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        const values = [
            user_id,
            manager_id,
            appraisalId,
            JSON.stringify(targets),
            calculations ? JSON.stringify(calculations) : null,
            appraiseeSignatureUrl,
            appraiseeDate,
            appraiserSignatureUrl,
            appraiserDate
        ];

        const result = await pool.query(query, values);
        const endYearReview = result.rows[0];

        // Update appraisal table
        if (appraisalId) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'end_of_year_review', {
                targets,
                calculations,
                appraisee_signature_url: appraiseeSignatureUrl,
                appraisee_date: appraiseeDate,
                appraiser_signature_url: appraiserSignatureUrl,
                appraiser_date: appraiserDate
            });
        }

        return endYearReview;
    }

    static async updateEndYearReview(id, data) {
        const { targets, calculations, appraiseeSignatureUrl, appraiseeDate, appraiserSignatureUrl, appraiserDate } = data;

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

        const endYearReview = result.rows[0];

        // Update appraisal table
        if (endYearReview.appraisal_id) {
            await AppraisalService.updateAppraisalSection(endYearReview.appraisal_id, 'end_of_year_review', {
                targets: targets || endYearReview.targets,
                calculations: calculations || endYearReview.calculations,
                appraisee_signature_url: appraiseeSignatureUrl !== undefined ? appraiseeSignatureUrl : endYearReview.appraisee_signature_url,
                appraisee_date: appraiseeDate !== undefined ? appraiseeDate : endYearReview.appraisee_date,
                appraiser_signature_url: appraiserSignatureUrl !== undefined ? appraiserSignatureUrl : endYearReview.appraiser_signature_url,
                appraiser_date: appraiserDate !== undefined ? appraiserDate : endYearReview.appraiser_date
            });
        }

        // Update current step to final-sections
        await AppraisalService.updateCurrentStep(endYearReview.user_id, 'final-sections');

        return endYearReview;
    }

    static async getEndYearReviewById(id) {
        const query = 'SELECT * FROM end_year_review WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('End-year review record not found');
        }

        return result.rows[0];
    }

    static async getEndYearReviewByUserId(user_id) {
        const query = 'SELECT * FROM end_year_review WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);
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
