'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole, AuthTokens, LoginRequest, RegisterRequest } from '@/types/api';
import { TokenManager } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isStudent: () => boolean;
  isWriter: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    error: null,
  });

  // Clear error message
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Role checking utilities
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  const isStudent = useCallback(() => hasRole('student'), [hasRole]);
  const isWriter = useCallback(() => hasRole('writer'), [hasRole]);
  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);

  // Fetch current user from API
  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const { AuthService } = await import('@/services/authService');
      const userData = await AuthService.getCurrentUser();
      return userData;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      TokenManager.clearTokens();
      return null;
    }
  }, []);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isInitializing: true }));
    
    try {
      if (TokenManager.isAuthenticated()) {
        const userData = await fetchCurrentUser();
        if (userData) {
          setState(prev => ({
            ...prev,
            user: userData,
            isAuthenticated: true,
            isInitializing: false,
          }));
        } else {
          // Token is invalid, clear it
          TokenManager.clearTokens();
          setState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isInitializing: false,
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isInitializing: false,
        }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isInitializing: false,
        error: 'Failed to initialize authentication',
      }));
    }
  }, [fetchCurrentUser]);

  // Login function
  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { AuthService } = await import('@/services/authService');
      const response = await AuthService.login(credentials);
      
      // Store tokens
      TokenManager.setTokens(response.access, response.refresh);
      
      // Update state with user data
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed. Please check your credentials.',
      }));
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { AuthService } = await import('@/services/authService');
      const response = await AuthService.register(userData);
      
      // Store tokens
      TokenManager.setTokens(response.access, response.refresh);
      
      // Update state with user data
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed. Please try again.',
      }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { AuthService } = await import('@/services/authService');
      
      // Call logout endpoint if refresh token exists
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await AuthService.logout(refreshToken);
        } catch (error) {
          // Logout endpoint failed, but continue with local logout
          console.warn('Server logout failed:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and state regardless of API call success
      TokenManager.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        error: null,
      });
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!TokenManager.isAuthenticated()) return;
    
    try {
      const userData = await fetchCurrentUser();
      if (userData) {
        setState(prev => ({ ...prev, user: userData }));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [fetchCurrentUser]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for storage changes (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gcts_access_token' && !event.newValue) {
        // Token was removed, user logged out in another tab
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    hasRole,
    hasAnyRole,
    isStudent,
    isWriter,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};