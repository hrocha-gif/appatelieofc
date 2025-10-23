import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterData } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      const authenticated = await authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    return result;
  };

  const register = async (userData: RegisterData) => {
    const result = await authService.register(userData);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}