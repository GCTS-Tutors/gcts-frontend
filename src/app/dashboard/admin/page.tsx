'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Tab,
  Tabs,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Assignment,
  AttachMoney,
  TrendingUp,
  Security,
  Settings,
  Analytics,
  Notifications,
  CloudDownload,
  Article,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AdminOverviewTab } from '@/components/dashboard/AdminOverviewTab';
import { UserManagementTab } from '@/components/dashboard/UserManagementTab';
import { OrderManagementTab } from '@/components/dashboard/OrderManagementTab';
import { PapersManagementTab } from '@/components/dashboard/PapersManagementTab';
import { SystemAnalyticsTab } from '@/components/dashboard/SystemAnalyticsTab';
import { SystemSettingsTab } from '@/components/dashboard/SystemSettingsTab';
import { useGetDashboardStatsQuery } from '@/store/api/adminApi';
import { useGetUserStatsQuery } from '@/store/api/userApi';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch dashboard data
  const { data: dashboardStats, isLoading: dashboardLoading } = useGetDashboardStatsQuery();
  const { data: userStats, isLoading: userStatsLoading } = useGetUserStatsQuery();

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
          {getGreeting()}, Administrator!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          System administration and management dashboard
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {userStatsLoading ? '-' : userStats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
              {userStats && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    size="small" 
                    label={`${userStats.activeUsers} Active`}
                    color="success"
                  />
                  <Chip 
                    size="small" 
                    label={`${userStats.newUsersThisMonth} New`}
                    color="info"
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
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {dashboardLoading ? '-' : dashboardStats?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
              {dashboardStats && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    size="small" 
                    label={`${dashboardStats.activeOrders} Active`}
                    color="warning"
                  />
                  <Chip 
                    size="small" 
                    label={`${dashboardStats.completedOrders} Done`}
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
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    ${dashboardLoading ? '-' : dashboardStats?.totalRevenue || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
              {dashboardStats && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    ${dashboardStats.monthlyRevenue} this month
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
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {dashboardLoading ? '-' : dashboardStats ? ((dashboardStats.completedOrders / dashboardStats.totalOrders) * 100).toFixed(1) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Box>
              </Box>
              {dashboardStats && (
                <Typography variant="caption" color="text.secondary">
                  Orders to completions ratio
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          System Status: All systems operational
        </Typography>
        <Typography variant="body2">
          Last backup: Today at 3:00 AM • Server uptime: 99.9% • No critical issues detected
        </Typography>
      </Alert>

      {/* Tabs for Different Admin Sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: 72,
              fontSize: '0.875rem'
            }
          }}
        >
          <Tab 
            label="Overview" 
            icon={<DashboardIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Users" 
            icon={<People />} 
            iconPosition="start"
          />
          <Tab
            label="Orders"
            icon={<Assignment />}
            iconPosition="start"
          />
          <Tab
            label="Papers"
            icon={<Article />}
            iconPosition="start"
          />
          <Tab
            label="Analytics"
            icon={<Analytics />}
            iconPosition="start"
          />
          <Tab
            label="Settings"
            icon={<Settings />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <AdminOverviewTab />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UserManagementTab />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <OrderManagementTab />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <PapersManagementTab />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <SystemAnalyticsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <SystemSettingsTab />
      </TabPanel>

      {/* Quick Admin Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CloudDownload />}
              sx={{ py: 1.5 }}
            >
              Export Data
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Security />}
              sx={{ py: 1.5 }}
            >
              Security Logs
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Notifications />}
              sx={{ py: 1.5 }}
            >
              Send Announcement
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Settings />}
              sx={{ py: 1.5 }}
            >
              System Maintenance
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default function AdminDashboardWithAuth() {
  return (
    <PrivateRoute roles={['admin']}>
      <AdminDashboard />
    </PrivateRoute>
  );
}