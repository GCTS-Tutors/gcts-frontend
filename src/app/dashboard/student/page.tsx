'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import { Assignment, Schedule, CheckCircle, Add } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { StudentOrdersOverview } from '@/components/dashboard/StudentOrdersOverview';
import { StatTile } from '@/components/dashboard/StatTile';
import { useGetMyOrderStatsQuery } from '@/store/api/orderApi';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function StudentDashboard() {
  const { user } = useAuth();
  const { data: orderStats, isLoading } = useGetMyOrderStatsQuery();

  const hasNoOrders = !isLoading && (!orderStats || orderStats.total === 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header + primary action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {getGreeting()}, {user?.firstName || user?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here&apos;s an overview of your orders
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/order/place"
          variant="contained"
          size="large"
          startIcon={<Add />}
        >
          New Order
        </Button>
      </Box>

      {/* Essential stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<Assignment />} label="Active" color="info.main" loading={isLoading} value={orderStats?.inProgress ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<Schedule />} label="Pending" color="warning.main" loading={isLoading} value={orderStats?.pending ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<CheckCircle />} label="Completed" color="success.main" loading={isLoading} value={orderStats?.completed ?? 0} />
        </Grid>
      </Grid>

      {/* Primary content: recent orders, or a first-order prompt */}
      {hasNoOrders ? (
        <Paper variant="outlined" sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You haven&apos;t placed any orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by placing your first order to get academic assistance from our expert writers.
          </Typography>
          <Button component={Link} href="/order/place" variant="contained" startIcon={<Add />}>
            Place Your First Order
          </Button>
        </Paper>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button component={Link} href="/orders" size="small">
                View all
              </Button>
            </Box>
            <StudentOrdersOverview />
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default function StudentDashboardWithAuth() {
  return (
    <PrivateRoute roles={['student']}>
      <StudentDashboard />
    </PrivateRoute>
  );
}
