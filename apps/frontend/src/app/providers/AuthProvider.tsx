import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockAuthService, type AuthService, type AuthUser } from '../../services/auth';

type AuthContextValue = {
  user: AuthUser | null;
  service: AuthService;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>({
    id: 'mock-user-1',
    displayName: 'Alex Harper',
    email: 'alex.harper@example.com',
  });

  const service: AuthService = {
    login: async (email, password) => {
      const result = await mockAuthService.login(email, password);
      if (result.ok) setUser(result.user);
      return result;
    },
    register: async (name, email, password) => {
      const result = await mockAuthService.register(name, email, password);
      if (result.ok) setUser(result.user);
      return result;
    },
    recover: mockAuthService.recover,
    logout: async () => {
      await mockAuthService.logout();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={{ user, service }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
