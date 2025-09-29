const { query } = require('../config/database');

class AccessRequest {
  constructor(data) {
    this.id = data.id;
    this.requesterId = data.requester_id;
    this.targetUserId = data.target_user_id;
    this.requestType = data.request_type;
    this.reason = data.reason;
    this.status = data.status;
    this.reviewedBy = data.reviewed_by;
    this.reviewedAt = data.reviewed_at;
    this.reviewNotes = data.review_notes;
    this.expiresAt = data.expires_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new access request
  static async create(requestData) {
    const {
      requesterId,
      targetUserId,
      requestType,
      reason,
      expiresAt
    } = requestData;

    const result = await query(`
      INSERT INTO access_requests (
        requester_id, target_user_id, request_type, reason, expires_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [requesterId, targetUserId, requestType, reason, expiresAt]);

    return new AccessRequest(result.rows[0]);
  }

  // Find access request by ID
  static async findById(id) {
    const result = await query(`
      SELECT ar.*, 
             r.name as requester_name, r.employee_id as requester_employee_id,
             t.name as target_user_name, t.employee_id as target_user_employee_id,
             rb.name as reviewed_by_name
      FROM access_requests ar
      LEFT JOIN users r ON ar.requester_id = r.id
      LEFT JOIN users t ON ar.target_user_id = t.id
      LEFT JOIN users rb ON ar.reviewed_by = rb.id
      WHERE ar.id = $1
    `, [id]);

    if (result.rows.length === 0) return null;

    const request = new AccessRequest(result.rows[0]);
    request.requesterName = result.rows[0].requester_name;
    request.requesterEmployeeId = result.rows[0].requester_employee_id;
    request.targetUserName = result.rows[0].target_user_name;
    request.targetUserEmployeeId = result.rows[0].target_user_employee_id;
    request.reviewedByName = result.rows[0].reviewed_by_name;

    return request;
  }

  // Get all access requests with pagination
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      requesterId,
      targetUserId,
      requestType,
      status,
      reviewedBy,
      search
    } = options;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (requesterId) {
      paramCount++;
      whereClause += ` AND ar.requester_id = $${paramCount}`;
      params.push(requesterId);
    }

    if (targetUserId) {
      paramCount++;
      whereClause += ` AND ar.target_user_id = $${paramCount}`;
      params.push(targetUserId);
    }

    if (requestType) {
      paramCount++;
      whereClause += ` AND ar.request_type = $${paramCount}`;
      params.push(requestType);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND ar.status = $${paramCount}`;
      params.push(status);
    }

    if (reviewedBy) {
      paramCount++;
      whereClause += ` AND ar.reviewed_by = $${paramCount}`;
      params.push(reviewedBy);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (r.name ILIKE $${paramCount} OR t.name ILIKE $${paramCount} OR ar.reason ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    paramCount++;
    params.push(limit);
    paramCount++;
    params.push(offset);

    const result = await query(`
      SELECT ar.*, 
             r.name as requester_name, r.employee_id as requester_employee_id,
             t.name as target_user_name, t.employee_id as target_user_employee_id,
             rb.name as reviewed_by_name
      FROM access_requests ar
      LEFT JOIN users r ON ar.requester_id = r.id
      LEFT JOIN users t ON ar.target_user_id = t.id
      LEFT JOIN users rb ON ar.reviewed_by = rb.id
      ${whereClause}
      ORDER BY ar.created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) FROM access_requests ar
      LEFT JOIN users r ON ar.requester_id = r.id
      LEFT JOIN users t ON ar.target_user_id = t.id
      LEFT JOIN users rb ON ar.reviewed_by = rb.id
      ${whereClause}
    `, params.slice(0, -2));

    const requests = result.rows.map(row => {
      const request = new AccessRequest(row);
      request.requesterName = row.requester_name;
      request.requesterEmployeeId = row.requester_employee_id;
      request.targetUserName = row.target_user_name;
      request.targetUserEmployeeId = row.target_user_employee_id;
      request.reviewedByName = row.reviewed_by_name;
      return request;
    });

    return {
      accessRequests: requests,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  // Get access requests by requester ID
  static async findByRequesterId(requesterId, options = {}) {
    return await this.findAll({ ...options, requesterId });
  }

  // Get access requests by target user ID
  static async findByTargetUserId(targetUserId, options = {}) {
    return await this.findAll({ ...options, targetUserId });
  }

  // Get access requests by status
  static async findByStatus(status, options = {}) {
    return await this.findAll({ ...options, status });
  }

  // Get pending access requests
  static async findPending(options = {}) {
    return await this.findByStatus('pending', options);
  }

  // Update access request
  async update(updateData) {
    const allowedFields = [
      'target_user_id', 'request_type', 'reason', 'status',
      'reviewed_by', 'reviewed_at', 'review_notes', 'expires_at'
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
      UPDATE access_requests 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update instance properties
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Approve access request
  async approve(reviewedBy, reviewNotes) {
    const result = await query(`
      UPDATE access_requests 
      SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, 
          review_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [reviewedBy, reviewNotes, this.id]);

    this.status = 'approved';
    this.reviewedBy = reviewedBy;
    this.reviewedAt = result.rows[0].reviewed_at;
    this.reviewNotes = reviewNotes;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Reject access request
  async reject(reviewedBy, reviewNotes) {
    const result = await query(`
      UPDATE access_requests 
      SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, 
          review_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [reviewedBy, reviewNotes, this.id]);

    this.status = 'rejected';
    this.reviewedBy = reviewedBy;
    this.reviewedAt = result.rows[0].reviewed_at;
    this.reviewNotes = reviewNotes;
    this.updatedAt = result.rows[0].updated_at;
    return this;
  }

  // Check if request is expired
  isExpired() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
  }

  // Check if request is pending
  isPending() {
    return this.status === 'pending';
  }

  // Check if request is approved
  isApproved() {
    return this.status === 'approved';
  }

  // Check if request is rejected
  isRejected() {
    return this.status === 'rejected';
  }

  // Delete access request
  async delete() {
    await query('DELETE FROM access_requests WHERE id = $1', [this.id]);
    return true;
  }

  // Get access request data for API response
  toJSON() {
    return {
      id: this.id,
      requesterId: this.requesterId,
      targetUserId: this.targetUserId,
      requestType: this.requestType,
      reason: this.reason,
      status: this.status,
      reviewedBy: this.reviewedBy,
      reviewedAt: this.reviewedAt,
      reviewNotes: this.reviewNotes,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // Additional fields from joins
      requesterName: this.requesterName,
      requesterEmployeeId: this.requesterEmployeeId,
      targetUserName: this.targetUserName,
      targetUserEmployeeId: this.targetUserEmployeeId,
      reviewedByName: this.reviewedByName
    };
  }
}

module.exports = AccessRequest;
