/**
 * Security Module Tests
 * Comprehensive tests for encryption, storage, and security features
 */
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { 
  generateEncryptionKey,
  encryptData,
  decryptData,
  checkRateLimit,
  SecureStorage,
  SecureDataTransformer
} from '../security';

describe('Security Module', () => {
  describe('Rate Limiting', () => {
    test('should allow requests within limit', () => {
      const userId = 'test-user';
      for (let i = 0; i < 100; i++) {
        expect(checkRateLimit(userId)).toBe(true);
      }
      expect(checkRateLimit(userId)).toBe(false);
    });

    test('should reset after window expires', async () => {
      const userId = 'test-user';
      expect(checkRateLimit(userId)).toBe(true);
      await new Promise(resolve => setTimeout(resolve, 60000));
      expect(checkRateLimit(userId)).toBe(true);
    });
  });

  describe('Encryption', () => {
    let key: CryptoKey;

    beforeEach(async () => {
      key = await generateEncryptionKey();
    });

    test('should encrypt and decrypt data correctly', async () => {
      const testData = 'sensitive information';
      const encrypted = await encryptData(testData, key);
      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(testData);
    });

    test('should handle empty data', async () => {
      await expect(encryptData('', key)).rejects.toThrow();
    });

    test('should handle large data', async () => {
      const largeData = 'x'.repeat(2 * 1024 * 1024); // 2MB
      await expect(encryptData(largeData, key)).rejects.toThrow('Data size exceeds limit');
    });
  });

  describe('Secure Storage', () => {
    let storage: SecureStorage;

    beforeEach(() => {
      storage = new SecureStorage();
    });

    afterEach(() => {
      storage.clear();
    });

    test('should initialize only once', async () => {
      await storage.initialize();
      await storage.initialize(); // Second call should be no-op
      expect(true).toBe(true); // No error thrown
    });

    test('should store and retrieve data', async () => {
      const testKey = 'test-key';
      const testValue = 'test-value';
      await storage.setItem(testKey, testValue);
      const retrieved = await storage.getItem(testKey);
      expect(retrieved).toBe(testValue);
    });

    test('should handle invalid keys', async () => {
      await expect(storage.getItem('')).rejects.toThrow();
    });
  });

  describe('Secure Data Transformer', () => {
    let transformer: SecureDataTransformer;

    beforeEach(() => {
      transformer = new SecureDataTransformer();
    });

    test('should transform request and response', async () => {
      const testData = { key: 'value' };
      const transformed = await transformer.transformRequest(testData);
      const restored = await transformer.transformResponse(transformed);
      expect(restored).toEqual(testData);
    });

    test('should handle invalid data', async () => {
      await expect(transformer.transformRequest(null)).rejects.toThrow();
      await expect(transformer.transformResponse('')).rejects.toThrow();
    });
  });
});