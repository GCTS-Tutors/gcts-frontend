'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Assignment,
  AttachMoney,
  Schedule,
  Star,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useState } from 'react';
import { format } from 'date-fns';
import { useGetApplicationMetricsQuery, useGetServerMetricsQuery } from '@/store/api/adminApi';

export function SystemAnalyticsTab() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const { data: appMetrics, isLoading: appLoading } = useGetApplicationMetricsQuery();
  const { data: serverMetrics, isLoading: serverLoading } = useGetServerMetricsQuery();

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'success.main' : 'error.main';
  };

  const getPerformanceColor = (value: number, threshold = 80) => {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.7) return 'warning';
    return 'error';
  };

  if (appLoading || serverLoading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={8} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          System Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 3 months</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div">
                    {appMetrics?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: getTrendColor(5.2) }}>
                    {getTrendIcon(5.2)}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      5.2%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((appMetrics?.activeUsers || 0) / 200 * 100, 100)}
                sx={{ height: 6, borderRadius: 3 }}
              />
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
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div">
                    {appMetrics?.ordersToday || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders Today
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: getTrendColor(8.7) }}>
                    {getTrendIcon(8.7)}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      8.7%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((appMetrics?.ordersToday || 0) / 50 * 100, 100)}
                sx={{ height: 6, borderRadius: 3 }}
                color="success"
              />
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
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div">
                    ${appMetrics?.revenueToday || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenue Today
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: getTrendColor(12.3) }}>
                    {getTrendIcon(12.3)}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      12.3%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((appMetrics?.revenueToday || 0) / 5000 * 100, 100)}
                sx={{ height: 6, borderRadius: 3 }}
                color="info"
              />
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
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div">
                    {(appMetrics?.cacheHitRate || 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cache Hit Rate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label="Excellent"
                    color="success"
                    size="small"
                  />
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={appMetrics?.cacheHitRate || 0}
                sx={{ height: 6, borderRadius: 3 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Performance
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Response Time</Typography>
                  <Typography variant="body2">{appMetrics?.averageResponseTime || 0}ms</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(100 - (appMetrics?.averageResponseTime || 0) / 10, 0)}
                  color={getPerformanceColor(100 - (appMetrics?.averageResponseTime || 0) / 10) as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2">{(serverMetrics?.cpu.usage || 0).toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={serverMetrics?.cpu.usage || 0}
                  color={getPerformanceColor(100 - (serverMetrics?.cpu.usage || 0), 80) as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Error Rate</Typography>
                  <Typography variant="body2">{(appMetrics?.errorRate || 0).toFixed(2)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(100 - (appMetrics?.errorRate || 0) * 10, 0)}
                  color={getPerformanceColor(100 - (appMetrics?.errorRate || 0) * 10) as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2">{(serverMetrics?.memory.usage || 0).toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={serverMetrics?.memory.usage || 0}
                  color={getPerformanceColor(100 - (serverMetrics?.memory.usage || 0), 80) as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Metrics
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Queue Size</Typography>
                  <Typography variant="body2">{appMetrics?.queueSize || 0} items</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((appMetrics?.queueSize || 0) / 100 * 100, 100)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Active Connections</Typography>
                  <Typography variant="body2">{serverMetrics?.activeConnections || 0}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((serverMetrics?.activeConnections || 0) / 1000 * 100, 100)}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Requests/Minute</Typography>
                  <Typography variant="body2">{serverMetrics?.requestsPerMinute || 0}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((serverMetrics?.requestsPerMinute || 0) / 1000 * 100, 100)}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Disk Usage</Typography>
                  <Typography variant="body2">{(serverMetrics?.disk.usage || 0).toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={serverMetrics?.disk.usage || 0}
                  color={getPerformanceColor(100 - (serverMetrics?.disk.usage || 0), 80) as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Events & Top Performers */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent System Events
              </Typography>
              <Box>
                {[
                  { type: 'success', message: 'System backup completed successfully', timestamp: new Date() },
                  { type: 'warning', message: 'High memory usage detected', timestamp: new Date(Date.now() - 3600000) },
                  { type: 'info', message: 'Database optimization completed', timestamp: new Date(Date.now() - 7200000) },
                  { type: 'success', message: 'Security scan completed - no issues found', timestamp: new Date(Date.now() - 10800000) },
                ].map((event, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      mr: 2, 
                      width: 32, 
                      height: 32,
                      bgcolor: event.type === 'error' ? 'error.main' : 
                              event.type === 'warning' ? 'warning.main' : 
                              event.type === 'info' ? 'info.main' : 'success.main'
                    }}>
                      {event.type === 'error' ? <Error /> : 
                       event.type === 'warning' ? <Warning /> : 
                       event.type === 'info' ? <Schedule /> : <CheckCircle />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{event.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(event.timestamp, 'MMM dd, HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Writers (Mock Data)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Writer</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { id: 1, firstName: 'John', lastName: 'Smith', ordersCompleted: 25, totalRevenue: 3250, rating: 4.8 },
                      { id: 2, firstName: 'Sarah', lastName: 'Johnson', ordersCompleted: 22, totalRevenue: 2890, rating: 4.7 },
                      { id: 3, firstName: 'Mike', lastName: 'Davis', ordersCompleted: 19, totalRevenue: 2470, rating: 4.6 },
                      { id: 4, firstName: 'Emma', lastName: 'Wilson', ordersCompleted: 17, totalRevenue: 2210, rating: 4.9 },
                    ].map((writer, index) => (
                      <TableRow key={writer.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, width: 24, height: 24, fontSize: 12 }}>
                              {writer.firstName[0]}
                            </Avatar>
                            <Typography variant="body2">
                              {writer.firstName} {writer.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{writer.ordersCompleted}</TableCell>
                        <TableCell align="right">${writer.totalRevenue}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={writer.rating.toFixed(1)}
                            color={writer.rating >= 4.5 ? 'success' : writer.rating >= 4 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}