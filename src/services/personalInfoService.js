const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');
const AppraisalService = require('./appraisalService');

class PersonalInfoService {
    /**
     * Create new personal info record
     */
    static async createPersonalInfo(user_id, personalInfoData) {
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
        const userResult = await pool.query(userQuery, [user_id]);
        const manager_id = userResult.rows[0]?.manager_id || null;

        // Create or get appraisal record
        const appraisalId = await AppraisalService.createOrGetAppraisal(
            user_id,
            manager_id,
            periodFrom,
            periodTo
        );

        const query = `
      INSERT INTO personal_info (
        user_id, manager_id, appraisal_id, period_from, period_to, title, other_title, surname, 
        first_name, other_names, gender, present_job_title, grade_salary, 
        division, date_of_appointment, training_records,
        appraiser_title, appraiser_other_title, appraiser_surname, appraiser_first_name,
        appraiser_other_names, appraiser_position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

        const values = [
            user_id,
            manager_id,
            appraisalId,
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
        const personalInfo = result.rows[0];

        // Update appraisal with employee and appraiser info
        await AppraisalService.updateAppraisalSection(appraisalId, 'employee_info', {
            title,
            other_title: otherTitle,
            surname,
            first_name: firstName,
            other_names: otherNames,
            gender,
            present_job_title: presentJobTitle,
            grade_salary: gradeSalary,
            division,
            date_of_appointment: dateOfAppointment
        });

        if (appraiserTitle || appraiserSurname) {
            await AppraisalService.updateAppraisalSection(appraisalId, 'appraiser_info', {
                title: appraiserTitle,
                other_title: appraiserOtherTitle,
                surname: appraiserSurname,
                first_name: appraiserFirstName,
                other_names: appraiserOtherNames,
                position: appraiserPosition
            });
        }

        await AppraisalService.updateAppraisalSection(appraisalId, 'training_received', trainingRecords);

        // Update current step to performance-planning
        await AppraisalService.updateCurrentStep(user_id, 'performance-planning');

        return personalInfo;
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

        const personalInfo = result.rows[0];

        // Update appraisal table if appraisal_id exists
        if (personalInfo.appraisal_id) {
            await AppraisalService.updateAppraisalSection(personalInfo.appraisal_id, 'employee_info', {
                title: title || personalInfo.title,
                other_title: otherTitle !== undefined ? otherTitle : personalInfo.other_title,
                surname: surname || personalInfo.surname,
                first_name: firstName || personalInfo.first_name,
                other_names: otherNames !== undefined ? otherNames : personalInfo.other_names,
                gender: gender || personalInfo.gender,
                present_job_title: presentJobTitle || personalInfo.present_job_title,
                grade_salary: gradeSalary || personalInfo.grade_salary,
                division: division || personalInfo.division,
                date_of_appointment: dateOfAppointment || personalInfo.date_of_appointment
            });

            if (appraiserTitle || appraiserSurname) {
                await AppraisalService.updateAppraisalSection(personalInfo.appraisal_id, 'appraiser_info', {
                    title: appraiserTitle || personalInfo.appraiser_title,
                    other_title: appraiserOtherTitle !== undefined ? appraiserOtherTitle : personalInfo.appraiser_other_title,
                    surname: appraiserSurname || personalInfo.appraiser_surname,
                    first_name: appraiserFirstName || personalInfo.appraiser_first_name,
                    other_names: appraiserOtherNames !== undefined ? appraiserOtherNames : personalInfo.appraiser_other_names,
                    position: appraiserPosition || personalInfo.appraiser_position
                });
            }

            if (trainingRecords) {
                await AppraisalService.updateAppraisalSection(personalInfo.appraisal_id, 'training_received', trainingRecords);
            }
        }

        return personalInfo;
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
    static async getPersonalInfoByUserId(user_id) {
        const query = `
      SELECT * FROM personal_info 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    /**
     * Get personal info by manager ID (for team appraisals)
     */
    static async getPersonalInfoByManagerId(manager_id) {
        const query = `
      SELECT pi.*, CONCAT(u.first_name, ' ', u.surname) as user_name, u.email as user_email, u.employee_id, a.status AS status
      FROM personal_info pi
      JOIN users u ON pi.user_id = u.id
      JOIN appraisals a ON pi.appraisal_id = a.id
      WHERE pi.manager_id = $1 
      ORDER BY pi.created_at DESC
    `;
        const result = await pool.query(query, [manager_id]);
        return result.rows;
    }

    /**
     * Get all personal info records (admin only)
     */
    static async getAllPersonalInfo(options = {}) {
        const { limit = 50, offset = 0 } = options;

        const query = `
      SELECT pi.*, CONCAT(u.first_name, ' ', u.surname) as user_name, u.email as user_email, u.employee_id, a.status AS status
      FROM personal_info pi
      JOIN users u ON pi.user_id = u.id
      JOIN appraisals a ON pi.appraisal_id = a.id
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
