const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.employee_id = data.employee_id;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.title = data.title;
    this.first_name = data.first_name;
    this.surname = data.surname;
    this.other_title = data.other_title;
    this.other_names = data.other_names;
    this.gender = data.gender;
    this.appointment_date = data.appointment_date;
    this.role = data.role;
    this.division = data.division;
    this.unit = data.unit;
    this.position = data.position;
    this.grade = data.grade;
    this.notch = data.notch;
    this.manager_id = data.manager_id;
    this.phone = data.phone;
    this.avatar_url = data.avatar_url;
    this.signature_url = data.signature_url;
    this.is_active = data.is_active;
    this.last_login = data.last_login;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const {
      employee_id,
      email,
      password,
      title,
      first_name,
      surname,
      other_title,
      other_names,
      gender,
      appointment_date,
      role,
      division,
      unit,
      position,
      grade,
      notch,
      manager_id,
      phone
    } = userData;

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(`
      INSERT INTO users (
        employee_id, email, password_hash, title, first_name, surname,
        other_title, other_names, gender, appointment_date, role, division, 
        unit, position, grade, notch, manager_id, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      employee_id, email, password_hash, title, first_name, surname,
      other_title, other_names, gender, appointment_date, role, division,
      unit, position, grade, notch, manager_id, phone
    ]);

    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by employee ID
  static async findByEmployeeId(employee_id) {
    const result = await query('SELECT * FROM users WHERE employee_id = $1', [employee_id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Get all users with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      role,
      division,
      unit,
      is_active = true,
      search
    } = options;

    let whereClause = 'WHERE is_active = $1';
    const params = [is_active];
    let paramCount = 1;

    if (role) {
      paramCount++;
      whereClause += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (division) {
      paramCount++;
      whereClause += ` AND division = $${paramCount}`;
      params.push(division);
    }

    if (unit) {
      paramCount++;
      whereClause += ` AND unit = $${paramCount}`;
      params.push(unit);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (first_name ILIKE $${paramCount} OR surname ILIKE $${paramCount} OR email ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT * FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM users ${whereClause}
    `, params.slice(0, -2));

    return {
      users: result.rows.map(row => new User(row)),
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Get users by manager ID (subordinates)
  static async findByManagerId(manager_id) {
    const result = await query(`
      SELECT * FROM users 
      WHERE manager_id = $1 AND is_active = true
      ORDER BY surname, first_name
    `, [manager_id]);

    return result.rows.map(row => new User(row));
  }

  // Get user hierarchy (manager and subordinates)
  static async getHierarchy(user_id) {
    const user = await this.findById(user_id);
    if (!user) return null;

    const manager = user.manager_id ? await this.findById(user.manager_id) : null;
    const subordinates = await this.findByManagerId(user_id);

    return {
      user,
      manager,
      subordinates
    };
  }

  // Update user
  async update(updateData) {
    const allowedFields = [
      'employee_id', 'email', 'name', 'role', 'division', 'unit',
      'position', 'grade', 'manager_id', 'phone', 'avatar_url', 'signature_url', 'is_active'
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
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Update password
  async updatePassword(newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);

    const result = await query(`
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [password_hash, this.id]);

    this.password_hash = password_hash;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Update last login
  async updateLastLogin() {
    await query(`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.lastLogin = new Date();
    return this;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // Delete user (soft delete)
  async delete() {
    await query(`
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.is_active = false;
    return this;
  }

  // Get user data for API response (without sensitive info)
  toJSON() {
    return {
      id: this.id,
      employee_id: this.employee_id,
      email: this.email,
      name: this.name,
      role: this.role,
      division: this.division,
      unit: this.unit,
      position: this.position,
      grade: this.grade,
      manager_id: this.manager_id,
      phone: this.phone,
      avatar_url: this.avatar_url,
      signature_url: this.signature_url,
      is_active: this.is_active,
      last_login: this.last_login,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Get user data for authentication
  toAuthJSON() {
    return {
      id: this.id,
      employee_id: this.employee_id,
      email: this.email,
      first_name: this.first_name,
      surname: this.surname,
      other_names: this.other_names,
      gender: this.gender,
      appointment_date: this.appointment_date,
      notch: this.notch,
      division: this.division,
      unit: this.unit,
      position: this.position,
      phone: this.phone,
      title: this.title,
      other_title: this.other_title,
      role: this.role,
      manager_id: this.manager_id,
      avatar_url: this.avatar_url,
      signature_url: this.signature_url
    };
  }
}

module.exports = User;
