'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider,
  Paper,
  IconButton,
  Badge,
  Alert,
} from '@mui/material';
import {
  Assignment,
  Payment,
  Star,
  Add,
  Visibility,
  Message,
  Download,
  Schedule,
  CheckCircle,
  Warning,
  AttachMoney,
  TrendingUp,
  Notifications,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { StudentOrdersOverview } from '@/components/dashboard/StudentOrdersOverview';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';
import { NotificationsList } from '@/components/dashboard/NotificationsList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useGetMyOrderStatsQuery } from '@/store/api/orderApi';
import { useGetPaymentStatsQuery } from '@/store/api/paymentApi';
import { useGetUnreadCountQuery } from '@/store/api/notificationApi';

function StudentDashboard() {
  const { user } = useAuth();
  
  // Fetch dashboard data
  const { data: orderStats, isLoading: orderStatsLoading } = useGetMyOrderStatsQuery();
  const { data: paymentStats, isLoading: paymentStatsLoading } = useGetPaymentStatsQuery({ period: '30d' });
  const { data: notificationCount } = useGetUnreadCountQuery();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {getGreeting()}, {user?.firstName || user?.email}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to your student dashboard
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {orderStatsLoading ? '-' : orderStats?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
              {orderStats && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    size="small" 
                    label={`${orderStats.inProgress} Active`}
                    color="info"
                  />
                  <Chip 
                    size="small" 
                    label={`${orderStats.completed} Done`}
                    color="success"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    ${paymentStatsLoading ? '-' : paymentStats?.totalRevenue || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Box>
              {paymentStats && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    ${paymentStats.revenueThisMonth} this month
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {orderStatsLoading ? '-' : orderStats?.pending || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Box>
              {(orderStats?.pending || 0) > 0 && (
                <Button size="small" variant="outlined" fullWidth>
                  View Pending
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Badge badgeContent={notificationCount?.count || 0} color="error">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <Notifications />
                  </Avatar>
                </Badge>
                <Box>
                  <Typography variant="h4" component="div">
                    {notificationCount?.count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifications
                  </Typography>
                </Box>
              </Box>
              {(notificationCount?.count || 0) > 0 && (
                <Button size="small" variant="outlined" fullWidth>
                  View All
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Quick Actions */}
          <Box sx={{ mb: 3 }}>
            <QuickActions />
          </Box>

          {/* Recent Orders */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Orders</Typography>
                <Button 
                  component={Link} 
                  href="/orders" 
                  variant="outlined" 
                  size="small"
                >
                  View All
                </Button>
              </Box>
              <StudentOrdersOverview />
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Statistics
              </Typography>
              <OrderStatusChart />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Notifications</Typography>
                <Badge badgeContent={notificationCount?.count || 0} color="error">
                  <Notifications />
                </Badge>
              </Box>
              <NotificationsList limit={5} />
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Payments</Typography>
                <Button 
                  component={Link} 
                  href="/payments" 
                  variant="outlined" 
                  size="small"
                >
                  View All
                </Button>
              </Box>
              <RecentPayments />
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get assistance with your orders or account
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<Message />}>
                  Contact Support
                </Button>
                <Button variant="outlined" size="small" startIcon={<Star />}>
                  Leave Feedback
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Welcome Message for New Users */}
      {(!orderStats || orderStats.total === 0) && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to GCTS!
            </Typography>
            <Typography variant="body2">
              You haven't placed any orders yet. Start by placing your first order to get academic assistance from our expert writers.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                component={Link} 
                href="/order/place" 
                variant="contained" 
                startIcon={<Add />}
              >
                Place Your First Order
              </Button>
            </Box>
          </Alert>
        </Box>
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