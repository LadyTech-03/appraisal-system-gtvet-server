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
            trainingRecords = []
        } = personalInfoData;

        // Validate required fields
        if (!periodFrom || !periodTo || !title || !surname || !firstName || !gender ||
            !presentJobTitle || !gradeSalary || !division || !dateOfAppointment) {
            throw new ValidationError('Missing required fields');
        }

        const query = `
      INSERT INTO personal_info (
        user_id, period_from, period_to, title, other_title, surname, 
        first_name, other_names, gender, present_job_title, grade_salary, 
        division, date_of_appointment, training_records
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

        const values = [
            userId,
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
            JSON.stringify(trainingRecords)
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
            trainingRecords
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
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
