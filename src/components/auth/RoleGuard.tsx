'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/api';
import { Box, Typography, Alert } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, user needs ANY role
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  fallback,
  requireAll = false,
}) => {
  const { user, isAuthenticated, isInitializing } = useAuth();

  // Show loading state while initializing
  if (isInitializing) {
    return null; // Or a loading spinner
  }

  // User not authenticated
  if (!isAuthenticated || !user) {
    return fallback || <UnauthorizedFallback message="Please log in to access this content." />;
  }

  // Normalize roles to array
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  // Check if user has required roles
  const hasAccess = requireAll 
    ? requiredRoles.every(role => user.role === role)
    : requiredRoles.some(role => user.role === role);

  if (!hasAccess) {
    return fallback || (
      <UnauthorizedFallback 
        message={`Access denied. Required role(s): ${requiredRoles.join(', ')}`} 
      />
    );
  }

  return <>{children}</>;
};

// Default unauthorized component
const UnauthorizedFallback: React.FC<{ message: string }> = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      p: 4,
    }}
  >
    <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h5" gutterBottom color="text.secondary">
      Access Restricted
    </Typography>
    <Alert severity="warning" sx={{ mt: 2, maxWidth: '400px' }}>
      {message}
    </Alert>
  </Box>
);

// Hook for conditional rendering based on roles
export const useRoleAccess = () => {
  const { user, hasRole, hasAnyRole, isStudent, isWriter, isAdmin } = useAuth();

  const canAccess = (roles: UserRole | UserRole[], requireAll = false): boolean => {
    if (!user) return false;
    
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    return requireAll 
      ? requiredRoles.every(role => user.role === role)
      : requiredRoles.some(role => user.role === role);
  };

  return {
    canAccess,
    hasRole,
    hasAnyRole,
    isStudent,
    isWriter,
    isAdmin,
    userRole: user?.role,
  };
};

// HOC for wrapping components with role guards
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  roles: UserRole | UserRole[],
  options?: {
    fallback?: React.ReactNode;
    requireAll?: boolean;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <RoleGuard 
      roles={roles} 
      fallback={options?.fallback}
      requireAll={options?.requireAll}
    >
      <Component {...props} />
    </RoleGuard>
  );

  WrappedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name})`;
  return WrappedComponent;
};