const request = require('supertest');
const app = require('../src/server');

describe('Users Endpoints', () => {
  let adminToken;
  let userToken;
  let testUserId;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@tvet.gov.gh',
        password: 'admin123'
      });

    adminToken = adminResponse.body.data.token;

    // Login as regular user
    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'newpassword123'
      });

    userToken = userResponse.body.data.token;
  });

  describe('GET /api/users', () => {
    it('should get all users with admin token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    it('should not get users without admin privileges', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should not get users without token', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/statistics', () => {
    it('should get user statistics with admin token', async () => {
      const response = await request(app)
        .get('/api/users/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalUsers).toBeDefined();
    });

    it('should not get statistics without admin privileges', async () => {
      const response = await request(app)
        .get('/api/users/statistics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/search', () => {
    it('should search users with manager token', async () => {
      const response = await request(app)
        .get('/api/users/search?q=test')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/users', () => {
    it('should create new user with admin token', async () => {
      const newUser = {
        employee_id: 'TEST002',
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test User 2',
        role: 'Assistant Lecturer',
        division: 'Academic Affairs',
        unit: 'Engineering',
        position: 'Assistant Lecturer',
        grade: 'Grade 13'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      testUserId = response.body.data.id;
    });

    it('should not create user without admin privileges', async () => {
      const newUser = {
        employee_id: 'TEST003',
        email: 'test3@example.com',
        password: 'password123',
        name: 'Test User 3',
        role: 'Assistant Lecturer'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newUser);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by ID with admin token', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testUserId);
    });

    it('should not get user without proper access', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user with admin token', async () => {
      const updateData = {
        name: 'Updated Test User 2',
        phone: '1234567890'
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user with admin token', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should not delete user without admin privileges', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
