'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Assignment, CheckCircle, AttachMoney } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { WriterOrdersOverview } from '@/components/dashboard/WriterOrdersOverview';
import { StatTile } from '@/components/dashboard/StatTile';
import { useGetWriterStatsQuery } from '@/store/api/userApi';
import { useGetMyEarningsQuery } from '@/store/api/paymentApi';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function WriterDashboard() {
  const { user } = useAuth();
  const { data: writerStats, isLoading: statsLoading } = useGetWriterStatsQuery(user?.id || 0);
  const { data: earnings, isLoading: earningsLoading } = useGetMyEarningsQuery({ period: '12m' });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {getGreeting()}, {user?.firstName || user?.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your assigned work and available orders
        </Typography>
      </Box>

      {/* Essential stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<Assignment />} label="Active Orders" color="info.main" loading={statsLoading} value={writerStats?.pendingOrders ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<CheckCircle />} label="Completed" color="success.main" loading={statsLoading} value={writerStats?.completedOrders ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatTile icon={<AttachMoney />} label="Total Earnings" color="primary.main" loading={earningsLoading} value={`$${earnings?.totalEarnings ?? 0}`} />
        </Grid>
      </Grid>

      {/* Assigned orders */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">My Assigned Orders</Typography>
            <Button component={Link} href="/orders" size="small">
              View all
            </Button>
          </Box>
          <WriterOrdersOverview />
        </CardContent>
      </Card>

    </Container>
  );
}

export default function WriterDashboardWithAuth() {
  return (
    <PrivateRoute roles={['writer']}>
      <WriterDashboard />
    </PrivateRoute>
  );
}
