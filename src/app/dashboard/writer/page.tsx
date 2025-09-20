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
  Tab,
  Tabs,
} from '@mui/material';
import {
  Assignment,
  AttachMoney,
  Schedule,
  CheckCircle,
  TrendingUp,
  Notifications,
  Edit,
  Visibility,
  Message,
  Upload,
  Download,
  Star,
  Person,
  WorkOutline,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { WriterOrdersOverview } from '@/components/dashboard/WriterOrdersOverview';
import { WriterEarningsChart } from '@/components/dashboard/WriterEarningsChart';
import { WriterPerformanceMetrics } from '@/components/dashboard/WriterPerformanceMetrics';
import { AvailableOrdersList } from '@/components/dashboard/AvailableOrdersList';
import { NotificationsList } from '@/components/dashboard/NotificationsList';
import { useGetWriterStatsQuery } from '@/store/api/userApi';
import { useGetMyEarningsQuery } from '@/store/api/paymentApi';
import { useGetUnreadCountQuery } from '@/store/api/notificationApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`writer-tabpanel-${index}`}
      aria-labelledby={`writer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function WriterDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch dashboard data
  const { data: writerStats, isLoading: writerStatsLoading } = useGetWriterStatsQuery(user?.id || 0);
  const { data: earnings, isLoading: earningsLoading } = useGetMyEarningsQuery({ period: '12m' });
  const { data: notificationCount } = useGetUnreadCountQuery();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {getGreeting()}, {user?.firstName || user?.email}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to your writer dashboard
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
                    {writerStatsLoading ? '-' : writerStats?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
              {writerStats && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    size="small" 
                    label={`${writerStats.pendingOrders} Pending`}
                    color="warning"
                  />
                  <Chip 
                    size="small" 
                    label={`${writerStats.completedOrders} Done`}
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
                    ${earningsLoading ? '-' : earnings?.totalEarnings || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                </Box>
              </Box>
              {earnings && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    ${earnings.earningsThisMonth} this month
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
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {writerStatsLoading ? '-' : (writerStats?.averageRating || 0).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Rating
                  </Typography>
                </Box>
              </Box>
              {writerStats && writerStats.averageRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      sx={{
                        fontSize: 16,
                        color: index < Math.floor(writerStats.averageRating) ? 'warning.main' : 'grey.300'
                      }}
                    />
                  ))}
                </Box>
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
                    {earnings?.availableBalance || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
              {earnings && earnings.availableBalance > 0 && (
                <Button size="small" variant="outlined" fullWidth>
                  Request Payout
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="writer dashboard tabs"
          variant="fullWidth"
        >
          <Tab label="My Orders" icon={<Assignment />} />
          <Tab label="Available Orders" icon={<WorkOutline />} />
          <Tab label="Performance" icon={<TrendingUp />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* My Orders Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Assigned Orders */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">My Assigned Orders</Typography>
                  <Button 
                    component={Link} 
                    href="/orders" 
                    variant="outlined" 
                    size="small"
                  >
                    View All
                  </Button>
                </Box>
                <WriterOrdersOverview />
              </CardContent>
            </Card>

            {/* Earnings Chart */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Earnings Overview
                </Typography>
                <WriterEarningsChart />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    fullWidth
                  >
                    Submit Work
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Message />}
                    fullWidth
                  >
                    Message Students
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AttachMoney />}
                    fullWidth
                  >
                    Request Payout
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Person />}
                    fullWidth
                  >
                    Update Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Notifications</Typography>
                  <Badge badgeContent={notificationCount?.count || 0} color="error">
                    <Notifications />
                  </Badge>
                </Box>
                <NotificationsList limit={5} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Available Orders Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Orders to Bid On
                </Typography>
                <AvailableOrdersList />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Performance Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WriterPerformanceMetrics />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Welcome Message for New Writers */}
      {(!writerStats || writerStats.totalOrders === 0) && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to the Writer Dashboard!
            </Typography>
            <Typography variant="body2">
              You haven't been assigned any orders yet. Check the "Available Orders" tab to find orders you can bid on.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                onClick={() => setTabValue(1)}
                variant="contained" 
                startIcon={<WorkOutline />}
              >
                View Available Orders
              </Button>
            </Box>
          </Alert>
        </Box>
      )}
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