const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.employeeId = data.employee_id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.name = data.name;
    this.role = data.role;
    this.division = data.division;
    this.unit = data.unit;
    this.position = data.position;
    this.grade = data.grade;
    this.managerId = data.manager_id;
    this.phone = data.phone;
    this.avatarUrl = data.avatar_url;
    this.signatureUrl = data.signature_url;
    this.isActive = data.is_active;
    this.lastLogin = data.last_login;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const {
      employeeId,
      email,
      password,
      name,
      role,
      division,
      unit,
      position,
      grade,
      managerId,
      phone
    } = userData;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(`
      INSERT INTO users (
        employee_id, email, password_hash, name, role, division, 
        unit, position, grade, manager_id, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      employeeId, email, passwordHash, name, role, division,
      unit, position, grade, managerId, phone
    ]);

    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Find user by employee ID
  static async findByEmployeeId(employeeId) {
    const result = await query('SELECT * FROM users WHERE employee_id = $1', [employeeId]);
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
      isActive = true,
      search
    } = options;

    let whereClause = 'WHERE is_active = $1';
    const params = [isActive];
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
      whereClause += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
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
  static async findByManagerId(managerId) {
    const result = await query(`
      SELECT * FROM users 
      WHERE manager_id = $1 AND is_active = true
      ORDER BY name
    `, [managerId]);

    return result.rows.map(row => new User(row));
  }

  // Get user hierarchy (manager and subordinates)
  static async getHierarchy(userId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const manager = user.managerId ? await this.findById(user.managerId) : null;
    const subordinates = await this.findByManagerId(userId);

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
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const result = await query(`
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [passwordHash, this.id]);

    this.passwordHash = passwordHash;
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
    return await bcrypt.compare(password, this.passwordHash);
  }

  // Delete user (soft delete)
  async delete() {
    await query(`
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.isActive = false;
    return this;
  }

  // Get user data for API response (without sensitive info)
  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      email: this.email,
      name: this.name,
      role: this.role,
      division: this.division,
      unit: this.unit,
      position: this.position,
      grade: this.grade,
      managerId: this.managerId,
      phone: this.phone,
      avatarUrl: this.avatarUrl,
      signatureUrl: this.signatureUrl,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Get user data for authentication
  toAuthJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      email: this.email,
      name: this.name,
      role: this.role,
      division: this.division,
      unit: this.unit,
      position: this.position,
      grade: this.grade,
      managerId: this.managerId,
      avatarUrl: this.avatarUrl,
      signatureUrl: this.signatureUrl
    };
  }
}

module.exports = User;
