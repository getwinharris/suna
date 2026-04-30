'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { createClient } from '@/lib/trailbase/client';
import { clearUserLocalStorage } from '@/lib/utils/clear-local-storage';
import { setBootstrapAuthToken, setCachedAuthToken } from '@/lib/auth-token';

type AuthContextType = {
  trailbase: any;
  session: any | null;
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const trailbase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const currentUser = await trailbase.auth.getUser();

        if (currentUser) {
          setUser(currentUser);
          setSession({ user: currentUser, access_token: trailbase.auth.getToken() });
          setCachedAuthToken(trailbase.auth.getToken());
        }
      } catch (error) {
        console.error('[AuthProvider] Init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Trailbase doesn't have onAuthStateChange in the same way, 
    // we rely on explicit login/logout calls for now or polling if needed.
  }, [trailbase]);

  const signOut = useCallback(async () => {
    try {
      await trailbase.auth.signOut();
      setSession(null);
      setUser(null);
      setCachedAuthToken(null);
      clearUserLocalStorage();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [trailbase]);

  const value = useMemo<AuthContextType>(
    () => ({ trailbase, session, user, isLoading, signOut }),
    [trailbase, session, user, isLoading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
