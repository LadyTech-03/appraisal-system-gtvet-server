const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

class AnnualAppraisalService {
    static async createAnnualAppraisal(user_id, data) {
        const {
            coreCompetencies,
            nonCoreCompetencies,
            performanceAssessmentScore,
            coreCompetenciesAverage,
            nonCoreCompetenciesAverage,
            overallTotal,
            overallScorePercentage,
            appraiserSignatureUrl,
            appraiserDate
        } = data;

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [user_id]);
        const manager_id = userResult.rows[0]?.manager_id || null;

        // Get appraisal_id from personal_info
        const appraisalQuery = 'SELECT appraisal_id FROM personal_info WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
        const appraisalResult = await pool.query(appraisalQuery, [user_id]);
        const appraisalId = appraisalResult.rows[0]?.appraisal_id || null;

        const query = `
      INSERT INTO annual_appraisal (
        user_id, manager_id, appraisal_id, core_competencies, non_core_competencies,
        performance_assessment_score, core_competencies_average,
        non_core_competencies_average, overall_total, overall_score_percentage,
        appraiser_signature_url, appraiser_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

        const values = [
            user_id,
            manager_id,
            appraisalId,
            JSON.stringify(coreCompetencies),
            JSON.stringify(nonCoreCompetencies),
            performanceAssessmentScore,
            coreCompetenciesAverage,
            nonCoreCompetenciesAverage,
            overallTotal,
            overallScorePercentage,
            appraiserSignatureUrl,
            appraiserDate,
        ];

        const result = await pool.query(query, values);
        const annualAppraisal = result.rows[0];

        // Update appraisal table
        if (appraisalId) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'annual_appraisal', {
                coreCompetencies,
                nonCoreCompetencies,
                overallAssessment: {
                    performance_assessment_score: performanceAssessmentScore,
                    core_competencies_average: coreCompetenciesAverage,
                    non_core_competencies_average: nonCoreCompetenciesAverage,
                    overall_total: overallTotal,
                    overall_score_percentage: overallScorePercentage
                }
            });
        }

        return annualAppraisal;
    }

    static async updateAnnualAppraisal(id, data) {
        const {
            coreCompetencies,
            nonCoreCompetencies,
            performanceAssessmentScore,
            coreCompetenciesAverage,
            nonCoreCompetenciesAverage,
            overallTotal,
            overallScorePercentage,
            appraiserSignatureUrl,
            appraiserDate,
        } = data;

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (coreCompetencies !== undefined) {
            updates.push(`core_competencies = $${paramCount}`);
            values.push(JSON.stringify(coreCompetencies));
            paramCount++;
        }

        if (nonCoreCompetencies !== undefined) {
            updates.push(`non_core_competencies = $${paramCount}`);
            values.push(JSON.stringify(nonCoreCompetencies));
            paramCount++;
        }

        if (performanceAssessmentScore !== undefined) {
            updates.push(`performance_assessment_score = $${paramCount}`);
            values.push(performanceAssessmentScore);
            paramCount++;
        }

        if (coreCompetenciesAverage !== undefined) {
            updates.push(`core_competencies_average = $${paramCount}`);
            values.push(coreCompetenciesAverage);
            paramCount++;
        }

        if (nonCoreCompetenciesAverage !== undefined) {
            updates.push(`non_core_competencies_average = $${paramCount}`);
            values.push(nonCoreCompetenciesAverage);
            paramCount++;
        }

        if (overallTotal !== undefined) {
            updates.push(`overall_total = $${paramCount}`);
            values.push(overallTotal);
            paramCount++;
        }

        if (overallScorePercentage !== undefined) {
            updates.push(`overall_score_percentage = $${paramCount}`);
            values.push(overallScorePercentage);
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
      UPDATE annual_appraisal 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Annual appraisal record not found');
        }

        const annualAppraisal = result.rows[0];

        // Update appraisal table
        if (annualAppraisal.appraisal_id) {
            await AppraisalService.updateAppraisalSection(annualAppraisal.appraisal_id, 'annual_appraisal', {
                coreCompetencies: coreCompetencies || annualAppraisal.core_competencies,
                nonCoreCompetencies: nonCoreCompetencies || annualAppraisal.non_core_competencies,
                overallAssessment: {
                    performance_assessment_score: performanceAssessmentScore !== undefined ? performanceAssessmentScore : annualAppraisal.performance_assessment_score,
                    core_competencies_average: coreCompetenciesAverage !== undefined ? coreCompetenciesAverage : annualAppraisal.core_competencies_average,
                    non_core_competencies_average: nonCoreCompetenciesAverage !== undefined ? nonCoreCompetenciesAverage : annualAppraisal.non_core_competencies_average,
                    overall_total: overallTotal !== undefined ? overallTotal : annualAppraisal.overall_total,
                    overall_score_percentage: overallScorePercentage !== undefined ? overallScorePercentage : annualAppraisal.overall_score_percentage
                }
            });
        }

        return annualAppraisal;
    }

    static async getAnnualAppraisalById(id) {
        const query = 'SELECT * FROM annual_appraisal WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Annual appraisal record not found');
        }

        return result.rows[0];
    }

    static async getAnnualAppraisalByUserId(user_id) {
        const query = 'SELECT * FROM annual_appraisal WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    static async getPerformanceAssessment(user_id) {
        const query = 'SELECT calculations FROM end_year_review WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    static async deleteAnnualAppraisal(id) {
        const query = 'DELETE FROM annual_appraisal WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Annual appraisal record not found');
        }
    }
}

module.exports = AnnualAppraisalService;
