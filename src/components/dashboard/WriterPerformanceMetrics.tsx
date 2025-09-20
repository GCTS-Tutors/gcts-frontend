'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  Alert,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Star,
  Schedule,
  CheckCircle,
  TrendingUp,
  Assignment,
  ThumbUp,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useGetWriterStatsQuery } from '@/store/api/userApi';

export function WriterPerformanceMetrics() {
  const { user } = useAuth();
  const { data: writerStats, isLoading, error } = useGetWriterStatsQuery(user?.id || 0);

  if (isLoading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load performance metrics.
      </Alert>
    );
  }

  if (!writerStats) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No performance data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete orders to see your performance metrics
        </Typography>
      </Box>
    );
  }

  const performanceMetrics = [
    {
      label: 'Overall Rating',
      value: writerStats.averageRating,
      displayValue: `${writerStats.averageRating.toFixed(1)}/5.0`,
      percentage: (writerStats.averageRating / 5) * 100,
      icon: <Star />,
      color: 'warning.main',
      bgColor: 'warning.50',
    },
    {
      label: 'Completion Rate',
      value: writerStats.totalOrders > 0 ? (writerStats.completedOrders / writerStats.totalOrders) * 100 : 0,
      displayValue: `${writerStats.totalOrders > 0 ? Math.round((writerStats.completedOrders / writerStats.totalOrders) * 100) : 0}%`,
      percentage: writerStats.totalOrders > 0 ? (writerStats.completedOrders / writerStats.totalOrders) * 100 : 0,
      icon: <CheckCircle />,
      color: 'success.main',
      bgColor: 'success.50',
    },
    {
      label: 'On-Time Delivery',
      value: writerStats.onTimeDeliveryRate,
      displayValue: `${Math.round(writerStats.onTimeDeliveryRate)}%`,
      percentage: writerStats.onTimeDeliveryRate,
      icon: <Schedule />,
      color: 'info.main',
      bgColor: 'info.50',
    },
    {
      label: 'Total Orders',
      value: writerStats.totalOrders,
      displayValue: writerStats.totalOrders.toString(),
      percentage: Math.min((writerStats.totalOrders / 100) * 100, 100), // Cap at 100 orders for progress bar
      icon: <Assignment />,
      color: 'primary.main',
      bgColor: 'primary.50',
    },
    {
      label: 'Total Earnings',
      value: writerStats.totalEarnings,
      displayValue: `$${writerStats.totalEarnings}`,
      percentage: Math.min((writerStats.totalEarnings / 1000) * 100, 100), // Cap at $1000 for progress bar
      icon: <TrendingUp />,
      color: 'success.main',
      bgColor: 'success.50',
    },
    {
      label: 'Customer Satisfaction',
      value: writerStats.averageRating > 4 ? 95 : (writerStats.averageRating / 5) * 100,
      displayValue: writerStats.averageRating > 4 ? 'Excellent' : writerStats.averageRating > 3 ? 'Good' : 'Needs Improvement',
      percentage: writerStats.averageRating > 4 ? 95 : (writerStats.averageRating / 5) * 100,
      icon: <ThumbUp />,
      color: 'secondary.main',
      bgColor: 'secondary.50',
    },
  ];

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return { level: 'Excellent', color: 'success' };
    if (rating >= 4.0) return { level: 'Very Good', color: 'info' };
    if (rating >= 3.5) return { level: 'Good', color: 'warning' };
    return { level: 'Needs Improvement', color: 'error' };
  };

  const performanceLevel = getPerformanceLevel(writerStats.averageRating);

  return (
    <Box>
      {/* Performance Level Banner */}
      <Card sx={{ mb: 3, bgcolor: `${performanceLevel.color}.50`, border: 1, borderColor: `${performanceLevel.color}.main` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ color: `${performanceLevel.color}.main` }}>
                Performance Level: {performanceLevel.level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on your overall rating and completion metrics
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ color: `${performanceLevel.color}.main` }}>
                {writerStats.averageRating.toFixed(1)}★
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average Rating
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      color: metric.color, 
                      mr: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: metric.bgColor,
                      '& svg': { fontSize: 24 }
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h6" sx={{ color: metric.color }}>
                      {metric.displayValue}
                    </Typography>
                  </Box>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={metric.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: metric.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Insights */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Insights
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Strengths
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {writerStats.averageRating >= 4.0 && (
                    <Chip label="High Customer Satisfaction" color="success" size="small" />
                  )}
                  {writerStats.onTimeDeliveryRate >= 90 && (
                    <Chip label="Excellent Delivery Rate" color="info" size="small" />
                  )}
                  {writerStats.completedOrders >= 10 && (
                    <Chip label="Experienced Writer" color="primary" size="small" />
                  )}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Areas for Improvement
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {writerStats.averageRating < 4.0 && (
                    <Chip label="Focus on Quality" color="warning" size="small" />
                  )}
                  {writerStats.onTimeDeliveryRate < 90 && (
                    <Chip label="Improve Delivery Time" color="error" size="small" />
                  )}
                  {writerStats.completedOrders < 5 && (
                    <Chip label="Build Experience" color="default" size="small" />
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Performance metrics are updated after each completed order
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}