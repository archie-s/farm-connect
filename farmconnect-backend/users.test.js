const request = require('supertest');
const app = require('./app');

describe('User Endpoints', () => {
  let farmerToken, buyerToken, farmerId, buyerId;

  beforeAll(async () => {
    // Get actual user IDs from seeded data
    const farmer = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'farmer1@farmconnect.co.ke',
        password: 'password123',
      });

    expect(farmer.status).toBe(200);
    if (farmer.status !== 200) {
      throw new Error(`Farmer login failed: ${JSON.stringify(farmer.body)}`);
    }
    
    const buyer = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'buyer1@farmconnect.co.ke',
        password: 'password123',
      });

    expect(buyer.status).toBe(200);
    if (buyer.status !== 200) {
      throw new Error(`Buyer login failed: ${JSON.stringify(buyer.body)}`);
    }

    farmerId = farmer.body.data.user.id;
    buyerId = buyer.body.data.user.id;
    farmerToken = farmer.body.data.accessToken;
    buyerToken = buyer.body.data.accessToken;
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${farmerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('farmer1@farmconnect.co.ke');
      expect(response.body.data.user.role).toBe('FARMER');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        location: 'Updated Location',
      };

      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updateData.firstName);
      expect(response.body.data.user.lastName).toBe(updateData.lastName);
      expect(response.body.data.user.location).toBe(updateData.location);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        phoneNumber: 'invalid-phone',
        profileImageUrl: 'not-a-url',
      };

      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should get public user profile successfully', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${farmerId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBeDefined();
      expect(response.body.data.user.role).toBe('FARMER');
      expect(response.body.data.user.email).toBeUndefined(); // Should not include private info
      expect(response.body.data.user.phoneNumber).toBeUndefined();
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
