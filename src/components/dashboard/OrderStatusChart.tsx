'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Warning,
  Error,
  Assignment,
} from '@mui/icons-material';
import { useGetMyOrderStatsQuery } from '@/store/api/orderApi';

export function OrderStatusChart() {
  const { data: orderStats, isLoading, error } = useGetMyOrderStatsQuery();

  if (isLoading) {
    return (
      <Box>
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load order statistics.
      </Alert>
    );
  }

  if (!orderStats || orderStats.total === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No order data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Place your first order to see statistics
        </Typography>
      </Box>
    );
  }

  const statusData = [
    {
      label: 'Completed',
      value: orderStats.completed,
      total: orderStats.total,
      icon: <CheckCircle />,
      color: 'success.main',
      bgColor: 'success.50',
    },
    {
      label: 'In Progress',
      value: orderStats.inProgress,
      total: orderStats.total,
      icon: <Schedule />,
      color: 'info.main',
      bgColor: 'info.50',
    },
    {
      label: 'Pending',
      value: orderStats.pending,
      total: orderStats.total,
      icon: <Warning />,
      color: 'warning.main',
      bgColor: 'warning.50',
    },
    {
      label: 'Cancelled',
      value: orderStats.cancelled,
      total: orderStats.total,
      icon: <Error />,
      color: 'error.main',
      bgColor: 'error.50',
    },
  ];

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {statusData.map((status, index) => {
          const percentage = getPercentage(status.value, status.total);
          
          return (
            <Grid item xs={6} sm={3} key={index}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: status.bgColor,
                  border: 1,
                  borderColor: status.color,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    color: status.color, 
                    mb: 1,
                    '& svg': { fontSize: 32 }
                  }}
                >
                  {status.icon}
                </Box>
                
                <Typography variant="h4" component="div" sx={{ color: status.color, mb: 0.5 }}>
                  {status.value}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {status.label}
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: status.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {percentage}% of total
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Summary Statistics */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {orderStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </Box>
          </Grid>
          
          {orderStats.averageRating && (
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {orderStats.averageRating.toFixed(1)}★
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Box>
            </Grid>
          )}
          
          {orderStats.totalEarnings && (
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  ${orderStats.totalEarnings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}