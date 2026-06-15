import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { setUnauthorizedHandler } from '../../shared/api/http';
import type { AuthUser } from './types';
import { fetchSession, login as loginRequest, logout as logoutRequest } from './api/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthValue = {
  status: AuthStatus;
  user: AuthUser | null;
  /** Sign in; rejects with a user-facing message on bad credentials. */
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Restore any existing session on first load.
  useEffect(() => {
    let active = true;
    fetchSession()
      .then((restored) => {
        if (!active) return;
        setUser(restored);
        setStatus(restored ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus('unauthenticated');
      });
    return () => {
      active = false;
    };
  }, []);

  // When any API call reports the session is gone, drop back to the login screen.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus('unauthenticated');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const signedIn = await loginRequest(username, password);
    setUser(signedIn);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      // Clear local state regardless of the server's response.
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
