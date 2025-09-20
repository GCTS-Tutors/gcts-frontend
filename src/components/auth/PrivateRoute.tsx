'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/api';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: UserRole | UserRole[];
  redirectTo?: string;
  requireAll?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  roles,
  redirectTo = '/login',
  requireAll = false,
}) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while still initializing
    if (isInitializing) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if roles are specified
    if (roles && user) {
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      const hasAccess = requireAll 
        ? requiredRoles.every(role => user.role === role)
        : requiredRoles.some(role => user.role === role);

      if (!hasAccess) {
        // Redirect based on user role
        const roleRedirects: Record<UserRole, string> = {
          student: '/dashboard',
          writer: '/dashboard',
          admin: '/dashboard',
        };
        
        router.push(roleRedirects[user.role] || '/');
        return;
      }
    }
  }, [isAuthenticated, isInitializing, user, roles, requireAll, router, redirectTo]);

  // Show loading state while initializing
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Show loading state while redirecting
  if (!isAuthenticated) {
    return <LoadingScreen message="Redirecting to login..." />;
  }

  // Check role access
  if (roles && user) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const hasAccess = requireAll 
      ? requiredRoles.every(role => user.role === role)
      : requiredRoles.some(role => user.role === role);

    if (!hasAccess) {
      return <LoadingScreen message="Redirecting..." />;
    }
  }

  return <>{children}</>;
};

// Loading screen component
const LoadingScreen: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: 2,
    }}
  >
    <CircularProgress size={48} />
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Higher-order component version
export const withPrivateRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    roles?: UserRole | UserRole[];
    redirectTo?: string;
    requireAll?: boolean;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <PrivateRoute 
      roles={options?.roles}
      redirectTo={options?.redirectTo}
      requireAll={options?.requireAll}
    >
      <Component {...props} />
    </PrivateRoute>
  );

  WrappedComponent.displayName = `withPrivateRoute(${Component.displayName || Component.name})`;
  return WrappedComponent;
};