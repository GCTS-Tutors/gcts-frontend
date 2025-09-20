'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  People,
  Assignment,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import { useGetDashboardStatsQuery, useGetSystemHealthQuery } from '@/store/api/adminApi';
import { useGetUserActivityQuery } from '@/store/api/userApi';
import { format } from 'date-fns';

export function AdminOverviewTab() {
  const { data: dashboardStats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: systemHealth, isLoading: healthLoading } = useGetSystemHealthQuery();
  const { data: userActivity, isLoading: activityLoading } = useGetUserActivityQuery({ period: '7d' });

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'critical': return <Error />;
      default: return <Schedule />;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              {healthLoading ? (
                <Box>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : systemHealth ? (
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getHealthColor(systemHealth.database.status)}.main` }}>
                        {getHealthIcon(systemHealth.database.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Database"
                      secondary={`Response time: ${systemHealth.database.responseTime}ms`}
                    />
                    <Chip
                      label={systemHealth.database.status}
                      color={getHealthColor(systemHealth.database.status) as any}
                      size="small"
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getHealthColor(systemHealth.redis.status)}.main` }}>
                        {getHealthIcon(systemHealth.redis.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Cache (Redis)"
                      secondary={`Response time: ${systemHealth.redis.responseTime}ms`}
                    />
                    <Chip
                      label={systemHealth.redis.status}
                      color={getHealthColor(systemHealth.redis.status) as any}
                      size="small"
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getHealthColor(systemHealth.storage.status)}.main` }}>
                        {getHealthIcon(systemHealth.storage.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="File Storage"
                      secondary={`${systemHealth.storage.usedSpace}GB / ${systemHealth.storage.totalSpace}GB`}
                    />
                    <Chip
                      label={systemHealth.storage.status}
                      color={getHealthColor(systemHealth.storage.status) as any}
                      size="small"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        {getHealthIcon('healthy')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Email Service"
                      secondary="Mail delivery system"
                    />
                    <Chip
                      label="healthy"
                      color="success"
                      size="small"
                    />
                  </ListItem>
                </List>
              ) : (
                <Alert severity="warning">
                  Unable to load system health data
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Activity (Last 7 Days)
              </Typography>
              {activityLoading ? (
                <Box>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Box>
              ) : userActivity && userActivity.length > 0 ? (
                <Box>
                  {userActivity.slice(0, 7).map((activity, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {format(new Date(activity.date), 'MMM dd')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.logins} logins, {activity.orders} orders
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((activity.logins / 100) * 100, 100)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  No activity data available
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Performance Indicators
              </Typography>
              {statsLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : dashboardStats ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                        <People />
                      </Avatar>
                      <Typography variant="h5" color="primary.main">
                        12.3%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        User Growth Rate
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                      <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                        <Assignment />
                      </Avatar>
                      <Typography variant="h5" color="success.main">
                        89.5%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Order Completion Rate
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                      <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                        <AttachMoney />
                      </Avatar>
                      <Typography variant="h5" color="info.main">
                        $245
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Order Value
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                        <TrendingUp />
                      </Avatar>
                      <Typography variant="h5" color="warning.main">
                        4.7
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer Satisfaction
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="warning">
                  Unable to load dashboard statistics
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}