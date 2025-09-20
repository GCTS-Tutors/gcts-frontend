'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import { useGetMyEarningsQuery } from '@/store/api/paymentApi';
import { format, subDays } from 'date-fns';

export function WriterEarningsChart() {
  const { data: earnings, isLoading, error } = useGetMyEarningsQuery({ period: '12m' });

  if (isLoading) {
    return (
      <Box>
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={4} key={index}>
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
        Failed to load earnings data.
      </Alert>
    );
  }

  if (!earnings) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <AttachMoney sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No earnings data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete your first order to start earning
        </Typography>
      </Box>
    );
  }

  const earningsData = [
    {
      label: 'Total Earnings',
      value: `$${earnings.totalEarnings}`,
      icon: <AttachMoney />,
      color: 'success.main',
      bgColor: 'success.50',
    },
    {
      label: 'Available Balance',
      value: `$${earnings.availableBalance}`,
      icon: <CheckCircle />,
      color: 'info.main',
      bgColor: 'info.50',
    },
    {
      label: 'Pending Balance',
      value: `$${earnings.pendingEarnings}`,
      icon: <Schedule />,
      color: 'warning.main',
      bgColor: 'warning.50',
    },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {earningsData.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: item.bgColor,
                border: 1,
                borderColor: item.color,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                }
              }}
            >
              <Box 
                sx={{ 
                  color: item.color, 
                  mb: 1,
                  '& svg': { fontSize: 32 }
                }}
              >
                {item.icon}
              </Box>
              
              <Typography variant="h5" component="div" sx={{ color: item.color, mb: 0.5 }}>
                {item.value}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* This Month Earnings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">This Month</Typography>
            <Chip
              label={`$${earnings.earningsThisMonth}`}
              color="success"
              icon={<TrendingUp />}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your earnings for {format(new Date(), 'MMMM yyyy')}
          </Typography>
        </CardContent>
      </Card>

      {/* Recent Earnings History */}
      {earnings.monthlyEarnings && earnings.monthlyEarnings.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Earnings
            </Typography>
            <Box>
              {earnings.monthlyEarnings.slice(0, 5).map((earning: any, index: number) => (
                <Box key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 2
                  }}>
                    <Box>
                      <Typography variant="subtitle2">
                        Order #{earning.orderId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(earning.date), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="success.main">
                        +${earning.amount}
                      </Typography>
                      <Chip
                        label={earning.status}
                        size="small"
                        color={earning.status === 'completed' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  {index < earnings.monthlyEarnings.slice(0, 5).length - 1 && (
                    <Divider />
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Payout Information */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Payout Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Minimum payout amount: $50
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Payout processing time: 3-5 business days
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}