'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useAuth } from '@/contexts/AuthContext';

function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'student':
          router.replace('/dashboard/student');
          break;
        case 'writer':
          router.replace('/dashboard/writer');
          break;
        case 'admin':
          router.replace('/dashboard/admin');
          break;
        default:
          router.replace('/dashboard/student'); // Default fallback
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6">
        Redirecting to your dashboard...
      </Typography>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardRedirect />
    </PrivateRoute>
  );
}