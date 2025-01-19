/**
 * Test Setup
 * Global test configuration and mocks
 */
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Web Crypto API
const cryptoMock = {
  getRandomValues: (buffer: Uint8Array) => buffer.map(() => Math.floor(Math.random() * 256)),
  subtle: {
    generateKey: async () => ({
      type: 'secret',
      extractable: true,
      algorithm: { name: 'AES-GCM' },
      usages: ['encrypt', 'decrypt']
    }),
    encrypt: async () => new Uint8Array([1, 2, 3]),
    decrypt: async () => new TextEncoder().encode('test')
  }
};

beforeAll(() => {
  // Setup global mocks
  global.crypto = cryptoMock as any;
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
});

afterEach(() => {
  cleanup(); // Clean up React components
});

afterAll(() => {
  // Clean up global mocks
});