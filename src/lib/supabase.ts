import { createClient } from '@supabase/supabase-js';
import { secureTransformer } from './security';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client instance with optimized configuration and security
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    multiTab: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  global: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline';",
    },
  },
  db: {
    schema: 'public',
  },
  // Add request/response interceptors for encryption
  interceptors: {
    requestCallback: async (config) => {
      // Only encrypt sensitive data
      if (config.method === 'POST' || config.method === 'PUT') {
        try {
          config.body = await secureTransformer.transformRequest(config.body);
        } catch (error) {
          console.error('Request encryption error:', error);
        }
      }
      return config;
    },
    responseCallback: async (response) => {
      // Only decrypt sensitive data
      if (response.data && typeof response.data === 'string') {
        try {
          response.data = await secureTransformer.transformResponse(response.data);
        } catch (error) {
          console.error('Response decryption error:', error);
        }
      }
      return response;
    },
  },
});

// Add security headers to all requests
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (input.toString().includes(supabaseUrl)) {
    init = {
      ...init,
      headers: {
        ...init?.headers,
        'Cache-Control': 'public, max-age=3600',
        'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline';",
      },
    };
  }
  return originalFetch(input, init);
};