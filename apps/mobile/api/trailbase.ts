import AsyncStorage from '@react-native-async-storage/async-storage';
import { initClient, type Client } from 'trailbase';
import { AppState } from 'react-native';
import { log } from '@/lib/logger';

/**
 * TrailBase Configuration
 */
const trailbaseUrl = process.env.EXPO_PUBLIC_TRAILBASE_URL || 'http://localhost:4000';

export interface TrailbaseCompatClient extends Client {
  auth: {
    signUp: (email: string, password: string) => Promise<any>;
    signInWithPassword: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    getUser: () => Promise<any>;
    getSession: () => Promise<any>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
    getToken: () => string | null;
  };
}

export const trailbase = (() => {
  const rawClient = initClient(trailbaseUrl);
  
  // Custom storage for React Native
  const STORAGE_KEY = 'trailbase_auth_token';
  
  const auth = {
    signUp: async (email: string, password: string) => {
      const res = await rawClient.fetch('/api/auth/v1/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, password_repeat: password }),
        throwOnError: false,
      });
      if (!res.ok && res.status !== 303) {
        const err = await res.text();
        throw new Error(err || 'Registration failed');
      }
      return await auth.signInWithPassword(email, password);
    },
    signInWithPassword: async (email: string, password: string) => {
      await rawClient.login(email, password);
      const token = rawClient.tokens()?.auth_token;
      if (token) {
        await AsyncStorage.setItem(STORAGE_KEY, token);
      }
      return { data: { user: rawClient.user(), session: { access_token: token, user: rawClient.user() } }, error: null };
    },
    signOut: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
      rawClient.logout();
    },
    getUser: async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      if (token && !rawClient.user()) {
        rawClient.setTokens({ auth_token: token });
      }
      const user = rawClient.user();
      return { data: { user }, error: user ? null : new Error('Not authenticated') };
    },
    getSession: async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      if (token && !rawClient.user()) {
        rawClient.setTokens({ auth_token: token });
      }
      const user = rawClient.user();
      return { data: { session: token ? { access_token: token, user } : null }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Basic implementation for compatibility
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getToken: () => rawClient.tokens()?.auth_token || null,
  };

  return { ...rawClient, auth } as unknown as TrailbaseCompatClient;
})();

// Auto-refresh/Re-validate when app becomes active
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    trailbase.auth.getUser().catch(() => {});
  }
});
