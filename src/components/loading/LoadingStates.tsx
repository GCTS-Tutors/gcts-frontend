'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fade,
  Backdrop,
} from '@mui/material';
import { keyframes } from '@mui/system';

// Loading animation keyframes
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Basic Loading Spinner
interface LoadingSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  message?: string;
}

export function LoadingSpinner({ size = 40, color = 'primary', message }: LoadingSpinnerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 2 }}>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

// Full Page Loading Screen
interface FullPageLoadingProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export function FullPageLoading({ message = 'Loading...', progress, showProgress = false }: FullPageLoadingProps) {
  return (
    <Backdrop
      open={true}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.primary">
        {message}
      </Typography>
      {showProgress && progress !== undefined && (
        <Box sx={{ width: 300 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      )}
    </Backdrop>
  );
}

// Inline Loading Component
interface InlineLoadingProps {
  height?: number;
  message?: string;
}

export function InlineLoading({ height = 200, message = 'Loading...' }: InlineLoadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

// Card Loading Skeleton
export function CardLoadingSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={118} />
        <Box sx={{ pt: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
      </CardContent>
    </Card>
  );
}

// Table Loading Skeleton
interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableLoadingSkeleton({ rows = 5, columns = 4 }: TableLoadingSkeletonProps) {
  return (
    <Paper sx={{ p: 2 }}>
      {/* Table Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="100%" height={40} />
        ))}
      </Box>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="100%" height={30} />
          ))}
        </Box>
      ))}
    </Paper>
  );
}

// List Loading Skeleton
interface ListLoadingSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export function ListLoadingSkeleton({ items = 5, showAvatar = true }: ListLoadingSkeletonProps) {
  return (
    <List>
      {Array.from({ length: items }).map((_, index) => (
        <ListItem key={index}>
          {showAvatar && (
            <ListItemIcon>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />}
            secondary={<Skeleton variant="text" width="40%" />}
          />
        </ListItem>
      ))}
    </List>
  );
}

// Dashboard Loading Skeleton
export function DashboardLoadingSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={60} height={30} />
                  </Box>
                  <Skeleton variant="circular" width={40} height={40} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
      </Grid>
    </Box>
  );
}

// Form Loading Skeleton
export function FormLoadingSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
      
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      ))}
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Box>
  );
}

// Progress Bar with Steps
interface StepProgressProps {
  steps: string[];
  currentStep: number;
  loading?: boolean;
}

export function StepProgress({ steps, currentStep, loading = false }: StepProgressProps) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <LinearProgress 
        variant={loading ? 'indeterminate' : 'determinate'} 
        value={(currentStep / (steps.length - 1)) * 100}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {steps.map((step, index) => (
          <Typography
            key={step}
            variant="caption"
            color={index <= currentStep ? 'primary' : 'text.secondary'}
            sx={{ fontWeight: index === currentStep ? 'bold' : 'normal' }}
          >
            {step}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

// Animated Loading Dots
export function LoadingDots() {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `${pulse} 1.4s infinite ease-in-out`,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
}

// Loading Button State
interface LoadingButtonContentProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function LoadingButtonContent({ loading, children, loadingText = 'Loading...' }: LoadingButtonContentProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} color="inherit" />
        {loadingText}
      </Box>
    );
  }
  return <>{children}</>;
}

// Shimmer Loading Effect
interface ShimmerLoadingProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
}

export function ShimmerLoading({ width = '100%', height = 20, borderRadius = 4 }: ShimmerLoadingProps) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '400% 100%',
        animation: `${shimmer} 1.2s ease-in-out infinite`,
      }}
    />
  );
}

// Loading Overlay for containers
interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}

export function LoadingOverlay({ loading, children, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {loading && (
        <Fade in={loading}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
}