/**
 * Security Module
 * Handles encryption, secure storage, and key management using Web Crypto API
 */

// Constants for encryption
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const MAX_RETRIES = 3;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * Rate limiter implementation
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || (now - userLimit.timestamp) > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Utility functions for base64 encoding/decoding with input validation
 */
const base64 = {
  encode: (buffer: ArrayBuffer): string => {
    if (!buffer || buffer.byteLength === 0) {
      throw new Error('Invalid buffer for encoding');
    }
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  },
  
  decode: (base64: string): Uint8Array => {
    if (!base64 || !/^[A-Za-z0-9+/=]+$/.test(base64)) {
      throw new Error('Invalid base64 string');
    }
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }
};

/**
 * Generates a cryptographically secure key with retry mechanism
 */
export async function generateEncryptionKey(retries = MAX_RETRIES): Promise<CryptoKey> {
  try {
    return await crypto.subtle.generateKey(
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    if (retries > 0) {
      console.warn('Key generation failed, retrying...', retries);
      return generateEncryptionKey(retries - 1);
    }
    throw new Error('Failed to generate encryption key after multiple attempts');
  }
}

/**
 * Encrypts data using AES-GCM with enhanced error handling
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  if (!data || !key) {
    throw new Error('Invalid encryption parameters');
  }

  try {
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Encode data with size validation
    if (data.length > 1024 * 1024) { // 1MB limit
      throw new Error('Data size exceeds limit');
    }
    const encodedData = new TextEncoder().encode(data);
    
    // Encrypt
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH * 8,
      },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data with integrity check
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    // Return as base64
    return base64.encode(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES-GCM with enhanced validation
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  if (!encryptedData || !key) {
    throw new Error('Invalid decryption parameters');
  }

  try {
    // Decode base64 with validation
    const combined = base64.decode(encryptedData);
    
    // Validate data length
    if (combined.length <= IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('Invalid encrypted data length');
    }
    
    // Extract IV and data
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);
    
    // Decrypt with integrity verification
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH * 8,
      },
      key,
      data
    );
    
    // Return as string with encoding validation
    const decoded = new TextDecoder().decode(decryptedData);
    if (!decoded) {
      throw new Error('Failed to decode decrypted data');
    }
    return decoded;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Securely stores sensitive data with enhanced security measures
 */
export class SecureStorage {
  private key: CryptoKey | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.key = await generateEncryptionKey();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize secure storage:', error);
        throw error;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!key || !value) {
      throw new Error('Invalid storage parameters');
    }

    try {
      const encryptedValue = await encryptData(value, this.key!);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to store item:', error);
      throw new Error('Storage operation failed');
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!key) {
      throw new Error('Invalid key');
    }

    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return await decryptData(encryptedValue, this.key!);
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!key) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
      this.initialized = false;
      this.key = null;
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

/**
 * Secure data transformer with enhanced validation and error handling
 */
export class SecureDataTransformer {
  private key: CryptoKey | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.key = await generateEncryptionKey();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize transformer:', error);
        throw error;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  async transformRequest(data: any): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!data) {
      throw new Error('Invalid request data');
    }

    try {
      return await encryptData(JSON.stringify(data), this.key!);
    } catch (error) {
      console.error('Request transformation failed:', error);
      throw new Error('Failed to transform request');
    }
  }

  async transformResponse(encryptedData: string): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!encryptedData) {
      throw new Error('Invalid response data');
    }

    try {
      const decryptedData = await decryptData(encryptedData, this.key!);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Response transformation failed:', error);
      throw new Error('Failed to transform response');
    }
  }
}

// Export singleton instances
export const secureStorage = new SecureStorage();
export const secureTransformer = new SecureDataTransformer();

// Security audit logging
export function logSecurityEvent(event: string, details: any): void {
  console.info('Security Event:', {
    timestamp: new Date().toISOString(),
    event,
    details,
    // Add user context if available
    user: 'system',
  });
}