const request = require('supertest');
const app = require('./app');

describe('Listing Endpoints', () => {
  let farmerToken, buyerToken, farmerId, listingId;

  beforeAll(async () => {
    // Login as farmer
    const farmerLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'farmer1@farmconnect.co.ke',
        password: 'password123',
      });

    expect(farmerLogin.status).toBe(200);
    if (farmerLogin.status !== 200) {
      throw new Error(`Farmer login failed: ${JSON.stringify(farmerLogin.body)}`);
    }

    // Login as buyer
    const buyerLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'buyer1@farmconnect.co.ke',
        password: 'password123',
      });

    expect(buyerLogin.status).toBe(200);
    if (buyerLogin.status !== 200) {
      throw new Error(`Buyer login failed: ${JSON.stringify(buyerLogin.body)}`);
    }

    farmerId = farmerLogin.body.data.user.id;
    farmerToken = farmerLogin.body.data.accessToken;
    buyerToken = buyerLogin.body.data.accessToken;
  });

  describe('GET /api/v1/listings', () => {
    it('should get all listings successfully', async () => {
      const response = await request(app)
        .get('/api/v1/listings')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toBeDefined();
      expect(Array.isArray(response.body.data.listings)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter listings by category', async () => {
      const response = await request(app)
        .get('/api/v1/listings?category=Vegetables')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.listings.forEach(listing => {
        expect(listing.category.toLowerCase()).toContain('vegetables');
      });
    });

    it('should filter listings by price range', async () => {
      const response = await request(app)
        .get('/api/v1/listings?minPrice=30&maxPrice=60')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.listings.forEach(listing => {
        expect(listing.pricePerUnit).toBeGreaterThanOrEqual(30);
        expect(listing.pricePerUnit).toBeLessThanOrEqual(60);
      });
    });

    it('should search listings by title', async () => {
      const response = await request(app)
        .get('/api/v1/listings?search=tomatoes')
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.listings.length > 0) {
        const hasMatchingTitle = response.body.data.listings.some(listing =>
          listing.title.toLowerCase().includes('tomatoes') ||
          listing.description.toLowerCase().includes('tomatoes')
        );
        expect(hasMatchingTitle).toBe(true);
      }
    });
  });

  describe('POST /api/v1/listings', () => {
    it('should create a new listing successfully (farmer only)', async () => {
      const listingData = {
        title: 'Test Carrots',
        description: 'Fresh organic carrots from our farm',
        category: 'Vegetables',
        pricePerUnit: 45.0,
        unitType: 'kg',
        quantityAvailable: 200,
        location: 'Test Farm, Kenya',
        harvestDate: '2024-10-01',
        expiryDate: '2024-10-20',
      };

      const response = await request(app)
        .post('/api/v1/listings')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send(listingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listing.title).toBe(listingData.title);
      expect(response.body.data.listing.farmerId).toBe(farmerId);
      
      listingId = response.body.data.listing.id; // Save for later tests
    });

    it('should return error when buyer tries to create listing', async () => {
      const listingData = {
        title: 'Test Product',
        description: 'Test description',
        category: 'Test',
        pricePerUnit: 50.0,
        unitType: 'kg',
        quantityAvailable: 100,
        location: 'Test Location',
      };

      const response = await request(app)
        .post('/api/v1/listings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(listingData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        pricePerUnit: -10, // Negative price
        quantityAvailable: 0, // Zero quantity
      };

      const response = await request(app)
        .post('/api/v1/listings')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/listings/:listingId', () => {
    it('should get listing by ID successfully', async () => {
      // Get the first listing from seed data
      const listingsResponse = await request(app)
        .get('/api/v1/listings')
        .expect(200);

      const firstListing = listingsResponse.body.data.listings[0];

      const response = await request(app)
        .get(`/api/v1/listings/${firstListing.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listing.id).toBe(firstListing.id);
      expect(response.body.data.listing.farmer).toBeDefined();
    });

    it('should return error for non-existent listing', async () => {
      const response = await request(app)
        .get('/api/v1/listings/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/listings/:listingId', () => {
    it('should update listing successfully (owner only)', async () => {
      if (!listingId) {
        // Create a listing first if we don't have one
        const createResponse = await request(app)
          .post('/api/v1/listings')
          .set('Authorization', `Bearer ${farmerToken}`)
          .send({
            title: 'Test Update Listing',
            description: 'Test description',
            category: 'Test',
            pricePerUnit: 50.0,
            unitType: 'kg',
            quantityAvailable: 100,
            location: 'Test Location',
          });
        listingId = createResponse.body.data.listing.id;
      }

      const updateData = {
        title: 'Updated Test Carrots',
        pricePerUnit: 50.0,
        quantityAvailable: 150,
      };

      const response = await request(app)
        .put(`/api/v1/listings/${listingId}`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listing.title).toBe(updateData.title);
      expect(response.body.data.listing.pricePerUnit).toBe(updateData.pricePerUnit);
    });

    it('should return error when non-owner tries to update', async () => {
      const updateData = {
        title: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/v1/listings/${listingId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/listings/:listingId', () => {
    it('should delete listing successfully (owner only)', async () => {
      const response = await request(app)
        .delete(`/api/v1/listings/${listingId}`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return error for already deleted listing', async () => {
      const response = await request(app)
        .get(`/api/v1/listings/${listingId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
