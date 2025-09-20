'use client';

import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Alert,
  Pagination,
  Skeleton,
  Menu,
  Divider,
} from '@mui/material';
import {
  Circle,
  Assignment,
  Payment,
  Message,
  Star,
  AdminPanelSettings,
  MoreVert,
  MarkEmailRead,
  Delete,
  Clear,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useDeleteNotificationMutation,
  useMarkAllAsReadMutation 
} from '@/store/api/notificationApi';

function NotificationsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: '',
    isRead: '',
    page: 1,
    pageSize: 20,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { data: notificationsData, isLoading, error, refetch } = useGetNotificationsQuery({
    filters: {
      type: filters.type ? [filters.type] : undefined,
      isRead: filters.isRead ? filters.isRead === 'true' : undefined,
    },
    page: filters.page,
    pageSize: filters.pageSize,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, notification: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
    refetch();
    handleMenuClose();
  };

  const handleDelete = async (notificationId: number) => {
    await deleteNotification(notificationId);
    refetch();
    handleMenuClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order': return <Assignment />;
      case 'payment': return <Payment />;
      case 'message': return <Message />;
      case 'review': return <Star />;
      case 'system': return <AdminPanelSettings />;
      default: return <Circle />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order': return 'info.main';
      case 'payment': return 'success.main';
      case 'message': return 'primary.main';
      case 'review': return 'warning.main';
      case 'system': return 'error.main';
      default: return 'grey.500';
    }
  };

  const notifications = notificationsData?.results || [];
  const totalCount = notificationsData?.count || 0;
  const pageCount = Math.ceil(totalCount / filters.pageSize);
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Stay updated with all your platform activities
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="order">Orders</MenuItem>
              <MenuItem value="payment">Payments</MenuItem>
              <MenuItem value="message">Messages</MenuItem>
              <MenuItem value="review">Reviews</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isRead}
              label="Status"
              onChange={(e) => handleFilterChange('isRead', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="false">Unread</MenuItem>
              <MenuItem value="true">Read</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={() => setFilters({ type: '', isRead: '', page: 1, pageSize: 20 })}
          >
            Clear Filters
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {notifications.length} of {totalCount} notifications
        </Typography>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <List>
          {Array.from({ length: 5 }).map((_, index) => (
            <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              <ListItemIcon>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemIcon>
              <ListItemText
                primary={<Skeleton variant="text" width="60%" />}
                secondary={<Skeleton variant="text" width="80%" />}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load notifications. Please try again.
        </Alert>
      )}

      {/* Notifications List */}
      {!isLoading && !error && (
        <>
          {notifications.length > 0 ? (
            <List>
              {notifications.map((notification: any) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  component={notification.actionUrl ? Link : 'div'}
                  href={notification.actionUrl || ''}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: getNotificationColor(notification.type),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: notification.isRead ? 'normal' : 'medium' }}>
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                        <Chip
                          label={notification.type}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMenuClick(e, notification);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Notifications Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filters.type || filters.isRead 
                  ? "No notifications match your current filters."
                  : "You're all caught up! No notifications to show."
                }
              </Typography>
            </Paper>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={filters.page}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.isRead && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <MarkEmailRead sx={{ mr: 1 }} />
            Mark as Read
          </MenuItem>
        )}
        
        <MenuItem onClick={() => handleDelete(selectedNotification?.id)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete Notification
        </MenuItem>
      </Menu>
    </Container>
  );
}

export default function NotificationsPageWithAuth() {
  return (
    <PrivateRoute>
      <NotificationsPage />
    </PrivateRoute>
  );
}