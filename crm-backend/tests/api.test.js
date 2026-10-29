const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Employee = require('../src/models/Employee');
const Lead = require('../src/models/Lead');

const TEST_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm_leads_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Employee.deleteMany({});
  await Lead.deleteMany({});
});

describe('CRM Backend API Integration Tests', () => {
  const counselorAData = {
    name: 'Counselor Alpha',
    email: 'alpha@edtech.com',
    password: 'Password123!',
  };

  const counselorBData = {
    name: 'Counselor Beta',
    email: 'beta@edtech.com',
    password: 'Password123!',
  };

  describe('1. Public Enquiries (POST /api/v1/public/enquiries)', () => {
    it('should allow public prospective students to submit enquiry without auth', async () => {
      const enquiry = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 234-567-8900',
        courseInterest: 'Full Stack Web Development',
        city: 'Seattle',
        message: 'Looking for a cohort starting next month.',
      };

      const res = await request(app)
        .post('/api/v1/public/enquiries')
        .send(enquiry);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(enquiry.name);
      expect(res.body.data.email).toBe(enquiry.email);
      expect(res.body.data.status).toBe('NEW');
      expect(res.body.data.assignedTo).toBeNull();
    });

    it('should ignore any malicious assignedTo or privileged fields passed by public user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const maliciousEnquiry = {
        name: 'Sneaky User',
        email: 'sneaky@example.com',
        phone: '1234567890',
        courseInterest: 'Cybersecurity',
        assignedTo: fakeId,
        status: 'CONVERTED',
      };

      const res = await request(app)
        .post('/api/v1/public/enquiries')
        .send(maliciousEnquiry);

      expect(res.status).toBe(201);
      expect(res.body.data.assignedTo).toBeNull();
      expect(res.body.data.status).toBe('NEW');
    });

    it('should return 400 for invalid input (e.g., missing required fields or invalid email)', async () => {
      const invalidEnquiry = {
        name: 'J',
        email: 'not-an-email',
      };

      const res = await request(app)
        .post('/api/v1/public/enquiries')
        .send(invalidEnquiry);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('2. Authentication Flow (/api/v1/auth)', () => {
    it('should register a new counselor and return safe profile with JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(counselorAData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.employee.email).toBe(counselorAData.email);
      expect(res.body.data.employee.password).toBeUndefined();
    });

    it('should return 409 conflict when registering with an existing email', async () => {
      await request(app).post('/api/v1/auth/register').send(counselorAData);
      const res = await request(app).post('/api/v1/auth/register').send(counselorAData);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should log in an existing counselor with valid credentials', async () => {
      await request(app).post('/api/v1/auth/register').send(counselorAData);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: counselorAData.email,
        password: counselorAData.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.employee.name).toBe(counselorAData.name);
    });

    it('should reject login with invalid password (401)', async () => {
      await request(app).post('/api/v1/auth/register').send(counselorAData);

      const res = await request(app).post('/api/v1/auth/login').send({
        email: counselorAData.email,
        password: 'WrongPassword999',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should retrieve current counselor profile via GET /api/v1/auth/me', async () => {
      const reg = await request(app).post('/api/v1/auth/register').send(counselorAData);
      const token = reg.body.data.token;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(counselorAData.email);
    });

    it('should return 401 when accessing GET /api/v1/auth/me without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('3. Lead Management & Claiming Mechanics (/api/v1/leads)', () => {
    let tokenA;
    let tokenB;

    beforeEach(async () => {
      const regA = await request(app).post('/api/v1/auth/register').send(counselorAData);
      tokenA = regA.body.data.token;

      const regB = await request(app).post('/api/v1/auth/register').send(counselorBData);
      tokenB = regB.body.data.token;
    });

    it('should return unclaimed leads in GET /api/v1/leads/public with pagination', async () => {
      await Lead.create([
        {
          name: 'Lead 1',
          email: 'lead1@example.com',
          phone: '1111111111',
          courseInterest: 'Data Science',
          assignedTo: null,
        },
        {
          name: 'Lead 2',
          email: 'lead2@example.com',
          phone: '2222222222',
          courseInterest: 'DevOps',
          assignedTo: null,
        },
      ]);

      const res = await request(app)
        .get('/api/v1/leads/public?page=1&limit=10')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.pagination.page).toBe(1);
    });

    it('should atomically claim a lead for Counselor A and prevent Counselor B from claiming it (409 Conflict)', async () => {
      const lead = await Lead.create({
        name: 'Target Lead',
        email: 'target@example.com',
        phone: '9999999999',
        courseInterest: 'AI & ML',
        assignedTo: null,
      });

      // Counselor A claims the lead
      const claimResA = await request(app)
        .patch(`/api/v1/leads/${lead._id}/claim`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(claimResA.status).toBe(200);
      expect(claimResA.body.success).toBe(true);

      // Verify lead is no longer in public unclaimed list
      const publicRes = await request(app)
        .get('/api/v1/leads/public')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(publicRes.body.data.length).toBe(0);

      // Verify lead appears in Counselor A's private list
      const myLeadsA = await request(app)
        .get('/api/v1/leads/my')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(myLeadsA.body.data.length).toBe(1);
      expect(myLeadsA.body.data[0]._id).toBe(lead._id.toString());

      // Verify lead does NOT appear in Counselor B's private list
      const myLeadsB = await request(app)
        .get('/api/v1/leads/my')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(myLeadsB.body.data.length).toBe(0);

      // Counselor B attempts to claim the same lead -> must return 409 Conflict
      const claimResB = await request(app)
        .patch(`/api/v1/leads/${lead._id}/claim`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(claimResB.status).toBe(409);
      expect(claimResB.body.message).toMatch(/already been claimed/i);
    });

    it('should prevent Counselor B from updating status or viewing Counselor A private lead (403 Forbidden)', async () => {
      const lead = await Lead.create({
        name: 'Private Lead',
        email: 'private@example.com',
        phone: '8888888888',
        courseInterest: 'UI/UX Design',
        assignedTo: null,
      });

      // Claim as Counselor A
      await request(app)
        .patch(`/api/v1/leads/${lead._id}/claim`)
        .set('Authorization', `Bearer ${tokenA}`);

      // Counselor B attempts to update status
      const forbiddenStatusRes = await request(app)
        .patch(`/api/v1/leads/${lead._id}/status`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ status: 'CONTACTED' });

      expect(forbiddenStatusRes.status).toBe(403);

      // Counselor B attempts to view private lead details
      const forbiddenViewRes = await request(app)
        .get(`/api/v1/leads/${lead._id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(forbiddenViewRes.status).toBe(403);

      // Counselor A successfully updates status
      const allowedStatusRes = await request(app)
        .patch(`/api/v1/leads/${lead._id}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'CONTACTED' });

      expect(allowedStatusRes.status).toBe(200);
      expect(allowedStatusRes.body.data.status).toBe('CONTACTED');
    });

    it('should return 400 for invalid status transitions/values', async () => {
      const lead = await Lead.create({
        name: 'Status Test Lead',
        email: 'statustest@example.com',
        phone: '7777777777',
        courseInterest: 'Cloud Computing',
        assignedTo: null,
      });

      await request(app)
        .patch(`/api/v1/leads/${lead._id}/claim`)
        .set('Authorization', `Bearer ${tokenA}`);

      const res = await request(app)
        .patch(`/api/v1/leads/${lead._id}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ status: 'INVALID_STATUS' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
