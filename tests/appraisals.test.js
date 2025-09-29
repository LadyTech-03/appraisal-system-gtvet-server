const request = require('supertest');
const app = require('../src/server');

describe('Appraisals Endpoints', () => {
  let adminToken;
  let userToken;
  let testAppraisalId;
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
    testUserId = userResponse.body.data.user.id;
  });

  describe('GET /api/appraisals', () => {
    it('should get all appraisals with manager token', async () => {
      const response = await request(app)
        .get('/api/appraisals')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.appraisals).toBeDefined();
      expect(Array.isArray(response.body.data.appraisals)).toBe(true);
    });

    it('should not get appraisals without manager privileges', async () => {
      const response = await request(app)
        .get('/api/appraisals')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/appraisals/statistics', () => {
    it('should get appraisal statistics with manager token', async () => {
      const response = await request(app)
        .get('/api/appraisals/statistics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalAppraisals).toBeDefined();
    });
  });

  describe('POST /api/appraisals', () => {
    it('should create new appraisal with manager token', async () => {
      const newAppraisal = {
        employeeId: testUserId,
        appraiserId: testUserId,
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        employeeInfo: {
          title: 'Mr.',
          surname: 'Test',
          firstName: 'User',
          otherNames: '',
          gender: 'Male',
          grade: 'Grade 14',
          position: 'Lecturer',
          unit: 'Engineering',
          appointmentDate: '2020-01-01'
        },
        appraiserInfo: {
          title: 'Mr.',
          surname: 'Test',
          firstName: 'User',
          otherNames: '',
          position: 'Lecturer'
        },
        trainingReceived: [],
        keyResultAreas: [],
        endOfYearReview: {
          targets: [],
          totalScore: 0,
          averageScore: 0,
          weightedScore: 0
        },
        coreCompetencies: {},
        nonCoreCompetencies: {},
        overallAssessment: {
          performanceScore: 0,
          coreCompetenciesScore: 0,
          nonCoreCompetenciesScore: 0,
          overallTotal: 0,
          overallPercentage: 0,
          overallRating: 1,
          ratingDescription: 'Needs Improvement'
        }
      };

      const response = await request(app)
        .post('/api/appraisals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newAppraisal);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      testAppraisalId = response.body.data.id;
    });

    it('should not create appraisal without manager privileges', async () => {
      const newAppraisal = {
        employeeId: testUserId,
        appraiserId: testUserId,
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31'
      };

      const response = await request(app)
        .post('/api/appraisals')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newAppraisal);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/appraisals/:id', () => {
    it('should get appraisal by ID with proper access', async () => {
      const response = await request(app)
        .get(`/api/appraisals/${testAppraisalId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testAppraisalId);
    });

    it('should not get appraisal without proper access', async () => {
      const response = await request(app)
        .get(`/api/appraisals/${testAppraisalId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/appraisals/:id', () => {
    it('should update appraisal with proper access', async () => {
      const updateData = {
        status: 'submitted',
        appraiserComments: 'Good performance overall'
      };

      const response = await request(app)
        .put(`/api/appraisals/${testAppraisalId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
    });
  });

  describe('PATCH /api/appraisals/:id/status', () => {
    it('should update appraisal status', async () => {
      const response = await request(app)
        .patch(`/api/appraisals/${testAppraisalId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'reviewed' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('reviewed');
    });
  });

  describe('POST /api/appraisals/:id/signatures', () => {
    it('should add signature to appraisal', async () => {
      const signatureData = {
        signatoryType: 'appraiser',
        signatoryId: testUserId,
        signatureData: 'base64signaturedata',
        signatureFileUrl: 'https://example.com/signature.png'
      };

      const response = await request(app)
        .post(`/api/appraisals/${testAppraisalId}/signatures`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(signatureData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/appraisals/:id/signatures', () => {
    it('should get appraisal signatures', async () => {
      const response = await request(app)
        .get(`/api/appraisals/${testAppraisalId}/signatures`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /api/appraisals/:id', () => {
    it('should delete appraisal with manager token', async () => {
      const response = await request(app)
        .delete(`/api/appraisals/${testAppraisalId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should not delete appraisal without manager privileges', async () => {
      const response = await request(app)
        .delete(`/api/appraisals/${testAppraisalId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
