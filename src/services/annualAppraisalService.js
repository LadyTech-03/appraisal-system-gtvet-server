const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class AnnualAppraisalService {
    static async createAnnualAppraisal(userId, data) {
        const {
            coreCompetencies,
            nonCoreCompetencies,
            performanceAssessmentScore,
            coreCompetenciesAverage,
            nonCoreCompetenciesAverage,
            overallTotal,
            overallScorePercentage,
            appraiseeSignatureUrl,
            appraiseeDate
        } = data;

        const query = `
      INSERT INTO annual_appraisal (
        user_id, core_competencies, non_core_competencies,
        performance_assessment_score, core_competencies_average,
        non_core_competencies_average, overall_total, overall_score_percentage,
        appraisee_signature_url, appraisee_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

        const values = [
            userId,
            JSON.stringify(coreCompetencies),
            JSON.stringify(nonCoreCompetencies),
            performanceAssessmentScore,
            coreCompetenciesAverage,
            nonCoreCompetenciesAverage,
            overallTotal,
            overallScorePercentage,
            appraiseeSignatureUrl,
            appraiseeDate
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
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
            appraiseeSignatureUrl,
            appraiseeDate
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
      UPDATE annual_appraisal 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Annual appraisal record not found');
        }

        return result.rows[0];
    }

    static async getAnnualAppraisalById(id) {
        const query = 'SELECT * FROM annual_appraisal WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Annual appraisal record not found');
        }

        return result.rows[0];
    }

    static async getAnnualAppraisalByUserId(userId) {
        const query = 'SELECT * FROM annual_appraisal WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
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
