const request = require('supertest');
const { app, startServer } = require('../src/server');

describe('Full Stack Job Portal - End-to-End API Test Suite', () => {
  let authToken = '';
  let sampleJobId = '';
  const testUser = {
    name: 'Jane Doe',
    email: `jane_${Date.now()}@test.com`,
    password: 'securePassword123'
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await startServer();
  });

  // Test Case 1: Register User -> User Created (201)
  it('1. Register User: should register a new user successfully and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User Registered');
    expect(res.body.token).toBeDefined();
  });

  // Edge Case: Duplicate Email -> 400 "Email Already Exists"
  it('1b. Duplicate Email: should reject registration if email is already taken', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email Already Exists');
  });

  // Edge Case: Empty Form Fields -> 400 "All Fields Required"
  it('1c. Empty Fields: should reject registration if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: '', password: '' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All Fields Required');
  });

  // Test Case 2: Login User -> JWT Generated (200)
  it('2. Login User: should authenticate user and generate valid JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token; // Save token for protected route tests
  });

  // Test Case 3: Invalid Password -> Error Message (401)
  it('3. Invalid Password: should return 401 Wrong Password for incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrong_password_xyz'
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Wrong Password');
  });

  // Test Case: Invalid User
  it('3b. Invalid User: should return 401 Invalid User if user email is not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent_user_999@test.com',
        password: 'somepassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid User');
  });

  // Test Case 4: Access Dashboard / Protected Route -> Allowed
  it('4. Access Dashboard: should allow access to protected profile with valid JWT token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email.toLowerCase());
    expect(res.body.password).toBeUndefined(); // Password must never be exposed
  });

  // Test Case 5: Access Protected Route Without Login -> 401 Unauthorized
  it('5. Access Dashboard Without Login: should reject request without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized');
  });

  // Edge Case: Invalid Token -> 401 "Invalid Token"
  it('5b. Invalid Token: should reject request with tampered/expired token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.tampered.token');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid Token');
  });

  // Test Case: View Jobs -> Returns List of Jobs
  it('6. View Jobs: should fetch list of available job listings', async () => {
    const res = await request(app)
      .get('/api/jobs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    sampleJobId = res.body[0]._id;
  });

  // Test Case 6b: Apply Job -> Application Saved
  it('7. Apply Job: should submit application and save to database', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        jobId: sampleJobId,
        coverNote: 'I would love to join your engineering team!'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Application Submitted');
    expect(res.body.application).toBeDefined();
    expect(res.body.application.status).toBe('Submitted');
  });

  // Test Case: Duplicate Application Check
  it('7b. Prevent Duplicate Application: should reject second application for same job', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        jobId: sampleJobId,
        coverNote: 'Applying again'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('You have already applied for this position');
  });

  // Test Case: Fetch User Applications
  it('8. Fetch My Applications: should return applications submitted by current user', async () => {
    const res = await request(app)
      .get('/api/applications/my')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].jobId).toBeDefined();
  });
});
