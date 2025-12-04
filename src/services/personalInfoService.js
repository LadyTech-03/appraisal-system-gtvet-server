const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

class PersonalInfoService {
    /**
     * Create new personal info record
     */
    static async createPersonalInfo(userId, personalInfoData) {
        const {
            periodFrom,
            periodTo,
            title,
            otherTitle,
            surname,
            firstName,
            otherNames,
            gender,
            presentJobTitle,
            gradeSalary,
            division,
            dateOfAppointment,
            trainingRecords = [],
            // Appraiser fields (nullable)
            appraiserTitle,
            appraiserOtherTitle,
            appraiserSurname,
            appraiserFirstName,
            appraiserOtherNames,
            appraiserPosition
        } = personalInfoData;

        // Validate required fields
        if (!periodFrom || !periodTo || !title || !surname || !firstName || !gender ||
            !presentJobTitle || !gradeSalary || !division || !dateOfAppointment) {
            throw new ValidationError('Missing required fields');
        }

        // Get user's manager_id from users table
        const userQuery = 'SELECT manager_id FROM users WHERE id = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const managerId = userResult.rows[0]?.manager_id || null;

        const query = `
      INSERT INTO personal_info (
        user_id, manager_id, period_from, period_to, title, other_title, surname, 
        first_name, other_names, gender, present_job_title, grade_salary, 
        division, date_of_appointment, training_records,
        appraiser_title, appraiser_other_title, appraiser_surname, appraiser_first_name,
        appraiser_other_names, appraiser_position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;

        const values = [
            userId,
            managerId,
            periodFrom,
            periodTo,
            title,
            otherTitle || null,
            surname,
            firstName,
            otherNames || null,
            gender,
            presentJobTitle,
            gradeSalary,
            division,
            dateOfAppointment,
            JSON.stringify(trainingRecords),
            appraiserTitle || null,
            appraiserOtherTitle || null,
            appraiserSurname || null,
            appraiserFirstName || null,
            appraiserOtherNames || null,
            appraiserPosition || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Update existing personal info
     */
    static async updatePersonalInfo(id, personalInfoData) {
        const {
            periodFrom,
            periodTo,
            title,
            otherTitle,
            surname,
            firstName,
            otherNames,
            gender,
            presentJobTitle,
            gradeSalary,
            division,
            dateOfAppointment,
            trainingRecords,
            // Appraiser fields (nullable)
            appraiserTitle,
            appraiserOtherTitle,
            appraiserSurname,
            appraiserFirstName,
            appraiserOtherNames,
            appraiserPosition
        } = personalInfoData;

        const query = `
      UPDATE personal_info
      SET 
        period_from = COALESCE($1, period_from),
        period_to = COALESCE($2, period_to),
        title = COALESCE($3, title),
        other_title = $4,
        surname = COALESCE($5, surname),
        first_name = COALESCE($6, first_name),
        other_names = $7,
        gender = COALESCE($8, gender),
        present_job_title = COALESCE($9, present_job_title),
        grade_salary = COALESCE($10, grade_salary),
        division = COALESCE($11, division),
        date_of_appointment = COALESCE($12, date_of_appointment),
        training_records = COALESCE($13, training_records),
        appraiser_title = COALESCE($14, appraiser_title),
        appraiser_other_title = COALESCE($15, appraiser_other_title),
        appraiser_surname = COALESCE($16, appraiser_surname),
        appraiser_first_name = COALESCE($17, appraiser_first_name),
        appraiser_other_names = COALESCE($18, appraiser_other_names),
        appraiser_position = COALESCE($19, appraiser_position),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $20
      RETURNING *
    `;

        const values = [
            periodFrom,
            periodTo,
            title,
            otherTitle,
            surname,
            firstName,
            otherNames,
            gender,
            presentJobTitle,
            gradeSalary,
            division,
            dateOfAppointment,
            trainingRecords ? JSON.stringify(trainingRecords) : null,
            appraiserTitle,
            appraiserOtherTitle,
            appraiserSurname,
            appraiserFirstName,
            appraiserOtherNames,
            appraiserPosition,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new NotFoundError('Personal info not found');
        }

        return result.rows[0];
    }

    /**
     * Get personal info by ID
     */
    static async getPersonalInfoById(id) {
        const query = 'SELECT * FROM personal_info WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Personal info not found');
        }

        return result.rows[0];
    }

    /**
     * Get personal info by user ID
     */
    static async getPersonalInfoByUserId(userId) {
        const query = `
      SELECT * FROM personal_info 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    /**
     * Get personal info by manager ID (for team appraisals)
     */
    static async getPersonalInfoByManagerId(managerId) {
        const query = `
      SELECT pi.*, u.name as user_name, u.email as user_email, u.employee_id
      FROM personal_info pi
      JOIN users u ON pi.user_id = u.id
      WHERE pi.manager_id = $1 
      ORDER BY pi.created_at DESC
    `;
        const result = await pool.query(query, [managerId]);
        return result.rows;
    }

    /**
     * Get all personal info records (admin only)
     */
    static async getAllPersonalInfo(options = {}) {
        const { limit = 50, offset = 0 } = options;

        const query = `
      SELECT pi.*, u.name as user_name, u.email as user_email
      FROM personal_info pi
      JOIN users u ON pi.user_id = u.id
      ORDER BY pi.created_at DESC
      LIMIT $1 OFFSET $2
    `;

        const countQuery = 'SELECT COUNT(*) FROM personal_info';

        const [dataResult, countResult] = await Promise.all([
            pool.query(query, [limit, offset]),
            pool.query(countQuery)
        ]);

        return {
            data: dataResult.rows,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset
        };
    }

    /**
     * Delete personal info
     */
    static async deletePersonalInfo(id) {
        const query = 'DELETE FROM personal_info WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            throw new NotFoundError('Personal info not found');
        }

        return { message: 'Personal info deleted successfully' };
    }
}

module.exports = PersonalInfoService;
