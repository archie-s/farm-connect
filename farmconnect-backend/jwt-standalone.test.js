// Standalone JWT tests that don't require database connection
const jwt = require('jsonwebtoken');

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const { generateTokens, verifyToken } = require('../../src/utils/jwt');

describe('JWT Utilities (Standalone)', () => {
  const testPayload = {
    userId: 'test-user-id',
    role: 'FARMER',
  };

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = generateTokens(testPayload);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different payloads', () => {
      const tokens1 = generateTokens({ userId: 'user1', role: 'FARMER' });
      const tokens2 = generateTokens({ userId: 'user2', role: 'BUYER' });

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', () => {
      const { accessToken } = generateTokens(testPayload);
      const decoded = verifyToken(accessToken);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should verify valid refresh token', () => {
      const { refreshToken } = generateTokens(testPayload);
      const decoded = verifyToken(refreshToken, true);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', () => {
      const decoded = verifyToken('malformed.token.here');
      expect(decoded).toBeNull();
    });
  });
});
