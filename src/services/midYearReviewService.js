const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

class MidYearReviewService {
    static async createMidYearReview(user_id, data) {
        const { targets, competencies, appraiseeSignatureUrl, appraiseeDate, appraiserSignatureUrl, appraiserDate } = data;

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);
        const manager_id = userResult.rows[0]?.manager_id || null;

        // Get appraisal_id from personal_info
        const appraisalQuery = 'SELECT appraisal_id FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
        const appraisalResult = await pool.query(appraisalQuery, [user_id]);
        const appraisalId = appraisalResult.rows[0]?.appraisal_id || null;

        const query = `
      INSERT INTO mid_year_review (
        user_id, manager_id, appraisal_id, targets, competencies, appraisee_signature_url, appraisee_date, appraiser_signature_url, appraiser_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        const values = [
            user_id,
            manager_id,
            appraisalId,
            JSON.stringify(targets),
            JSON.stringify(competencies),
            appraiseeSignatureUrl,
            appraiseeDate,
            appraiserSignatureUrl,
            appraiserDate
        ];

        const result = await pool.query(query, values);
        const midYearReview = result.rows[0];

        // Update appraisal table
        if (appraisalId) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'mid_year_review', {
                targets,
                competencies,
                appraisee_signature_url: appraiseeSignatureUrl,
                appraisee_date: appraiseeDate,
                appraiser_signature_url: appraiserSignatureUrl,
                appraiser_date: appraiserDate
            });
        }

        return midYearReview;
    }

    static async updateMidYearReview(id, data) {
        // Check if form is locked first
        const recordQuery = 'SELECT appraisal_id FROM mid_year_review WHERE id = $1';
        const recordResult = await pool.query(recordQuery, [id]);
        if (recordResult.rows.length > 0 && recordResult.rows[0].appraisal_id) {
            const lockQuery = 'SELECT mid_year_review_locked FROM appraisals WHERE id = $1';
            const lockResult = await pool.query(lockQuery, [recordResult.rows[0].appraisal_id]);
            if (lockResult.rows.length > 0 && lockResult.rows[0].mid_year_review_locked) {
                throw new ValidationError('Mid-Year Review form is locked and cannot be modified');
            }
        }

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

        const midYearReview = result.rows[0];

        // Update appraisal table
        if (midYearReview.appraisal_id) {
            await AppraisalService.updateAppraisalSection(midYearReview.appraisal_id, 'mid_year_review', {
                targets: targets || midYearReview.targets,
                competencies: competencies || midYearReview.competencies,
                appraisee_signature_url: appraiseeSignatureUrl !== undefined ? appraiseeSignatureUrl : midYearReview.appraisee_signature_url,
                appraisee_date: appraiseeDate !== undefined ? appraiseeDate : midYearReview.appraisee_date,
                appraiser_signature_url: appraiserSignatureUrl !== undefined ? appraiserSignatureUrl : midYearReview.appraiser_signature_url,
                appraiser_date: appraiserDate !== undefined ? appraiserDate : midYearReview.appraiser_date
            });
        }

        // Auto-create end-of-year review with pre-populated targets from mid-year review
        try {
            console.log('Checking for end-of-year review creation')
            // Check if end-of-year review already exists
            const checkQuery = 'SELECT id FROM end_year_review WHERE user_id = $1';
            const checkResult = await pool.query(checkQuery, [midYearReview.user_id]);

            if (checkResult.rows.length === 0) {
                console.log('Creating end-of-year review from mid-year update')
                // Map targets from mid-year review to end-of-year review structure
                const updatedTargets = targets || midYearReview.targets;
                const mappedTargets = updatedTargets.map((target, index) => ({
                    id: (index + 1).toString(),
                    target: target.description || "",
                    performanceAssessment: "",
                    weightOfTarget: 0.6,
                    score: 0,
                    comments: ""
                }));

                // Create end-of-year review
                const endYearQuery = `
                    INSERT INTO end_year_review (
                        user_id, manager_id, appraisal_id, targets
                    ) VALUES ($1, $2, $3, $4)
                    RETURNING *
                `;

                const endYearValues = [
                    midYearReview.user_id,
                    midYearReview.manager_id,
                    midYearReview.appraisal_id,
                    JSON.stringify(mappedTargets)
                ];

                await pool.query(endYearQuery, endYearValues);
                console.log('End-of-year review auto-created with pre-populated targets');
            }
        } catch (endYearError) {
            console.error('Error auto-creating end-of-year review:', endYearError);
            // Don't fail the whole operation if end-year creation fails
        }

        // Update current step to end-year-review
        await AppraisalService.updateCurrentStep(midYearReview.user_id, 'end-year-review');

        // Check if both signatures are present - if so, lock mid_year_review
        const hasBothSignatures = midYearReview.appraisee_signature_url && midYearReview.appraiser_signature_url;

        if (hasBothSignatures && midYearReview.appraisal_id) {
            try {
                await AppraisalService.lockForms(midYearReview.appraisal_id, ['mid_year_review']);
                console.log('Mid-Year Review and Performance Planning forms locked after both signatures collected');
            } catch (lockError) {
                console.error('Error locking forms:', lockError);
                // Don't fail the main operation if locking fails
            }
        }

        return midYearReview;
    }

    static async getMidYearReviewById(id) {
        const query = 'SELECT * FROM mid_year_review WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Mid-year review record not found');
        }

        return result.rows[0];
    }

    static async getMidYearReviewByUserId(user_id) {
        const query = 'SELECT * FROM mid_year_review WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);
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
