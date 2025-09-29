const { query } = require('../config/database');

class TrainingRecord {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.institution = data.institution;
    this.programme = data.programme;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.durationHours = data.duration_hours;
    this.cost = data.cost;
    this.fundingSource = data.funding_source;
    this.status = data.status;
    this.certificateUrl = data.certificate_url;
    this.notes = data.notes;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new training record
  static async create(trainingData) {
    const {
      userId,
      institution,
      programme,
      startDate,
      endDate,
      durationHours,
      cost,
      fundingSource,
      status = 'completed',
      certificateUrl,
      notes
    } = trainingData;

    const result = await query(`
      INSERT INTO training_records (
        user_id, institution, programme, start_date, end_date,
        duration_hours, cost, funding_source, status, certificate_url, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      userId, institution, programme, startDate, endDate,
      durationHours, cost, fundingSource, status, certificateUrl, notes
    ]);

    return new TrainingRecord(result.rows[0]);
  }

  // Find training record by ID
  static async findById(id) {
    const result = await query(`
      SELECT tr.*, u.name as user_name, u.employee_id
      FROM training_records tr
      LEFT JOIN users u ON tr.user_id = u.id
      WHERE tr.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const trainingRecord = new TrainingRecord(result.rows[0]);
    trainingRecord.userName = result.rows[0].user_name;
    trainingRecord.employeeId = result.rows[0].employee_id;

    return trainingRecord;
  }

  // Get all training records with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      userId,
      status,
      institution,
      startDate,
      endDate,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (userId) {
      paramCount++;
      whereClause += ` AND tr.user_id = $${paramCount}`;
      params.push(userId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND tr.status = $${paramCount}`;
      params.push(status);
    }

    if (institution) {
      paramCount++;
      whereClause += ` AND tr.institution ILIKE $${paramCount}`;
      params.push(`%${institution}%`);
    }

    if (startDate) {
      paramCount++;
      whereClause += ` AND tr.start_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereClause += ` AND tr.end_date <= $${paramCount}`;
      params.push(endDate);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (tr.institution ILIKE $${paramCount} OR tr.programme ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT tr.*, u.name as user_name, u.employee_id
      FROM training_records tr
      LEFT JOIN users u ON tr.user_id = u.id
      ${whereClause}
      ORDER BY tr.start_date DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM training_records tr
      LEFT JOIN users u ON tr.user_id = u.id
      ${whereClause}
    `, params.slice(0, -2));

    const trainingRecords = result.rows.map(row => {
      const trainingRecord = new TrainingRecord(row);
      trainingRecord.userName = row.user_name;
      trainingRecord.employeeId = row.employee_id;
      return trainingRecord;
    });

    return {
      trainingRecords,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Get training records by user ID
  static async findByUserId(userId, options = {}) {
    return await this.findAll({ ...options, userId });
  }

  // Get training records by status
  static async findByStatus(status, options = {}) {
    return await this.findAll({ ...options, status });
  }

  // Get training records by institution
  static async findByInstitution(institution, options = {}) {
    return await this.findAll({ ...options, institution });
  }

  // Update training record
  async update(updateData) {
    const allowedFields = [
      'institution', 'programme', 'start_date', 'end_date',
      'duration_hours', 'cost', 'funding_source', 'status',
      'certificate_url', 'notes'
    ];

    const updates = [];
    const values = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(this.id);

    const result = await query(`
      UPDATE training_records 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Update status
  async updateStatus(status) {
    const result = await query(`
      UPDATE training_records 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, this.id]);

    this.status = status;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Delete training record
  async delete() {
    await query('DELETE FROM training_records WHERE id = $1', [this.id]);
    return true;
  }

  // Get training record data for API response
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      institution: this.institution,
      programme: this.programme,
      startDate: this.startDate,
      endDate: this.endDate,
      durationHours: this.durationHours,
      cost: this.cost,
      fundingSource: this.fundingSource,
      status: this.status,
      certificateUrl: this.certificateUrl,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      userName: this.userName,
      employeeId: this.employeeId
    };
  }
}

module.exports = TrainingRecord;
