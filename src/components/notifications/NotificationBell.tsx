'use client';

import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  Circle,
  Assignment,
  Payment,
  Message,
  Star,
  AdminPanelSettings,
  MarkEmailRead,
  Clear,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '@/store/api/notificationApi';

interface NotificationBellProps {
  userId?: number;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds

  const { 
    data: notificationsData, 
    isLoading, 
    error,
    refetch 
  } = useGetNotificationsQuery(
    { 
      filters: { isRead: false }, 
      page: 1, 
      pageSize: 10 
    }, 
    { pollingInterval }
  );

  const notifications = notificationsData?.results || [];

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    handleClose();
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

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  // Update polling interval based on unread notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setPollingInterval(10000); // Poll more frequently when there are unread notifications
    } else {
      setPollingInterval(60000); // Poll less frequently when no unread notifications
    }
  }, [unreadCount]);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          {isLoading && (
            <Box sx={{ p: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load notifications
            </Alert>
          )}

          {!isLoading && !error && notifications.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up!
              </Typography>
            </Box>
          )}

          {!isLoading && !error && notifications.length > 0 && notifications.map((notification: any, index: number) => (
            <Box key={notification.id}>
              <MenuItem
                component={notification.actionUrl ? Link : 'div'}
                href={notification.actionUrl || ''}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 1.5,
                  alignItems: 'flex-start',
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <ListItemIcon sx={{ mt: 0.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: getNotificationColor(notification.type),
                      width: 32,
                      height: 32,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 'normal' : 'medium' }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </MenuItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              component={Link}
              href="/notifications"
              onClick={handleClose}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
}