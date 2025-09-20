'use client';

import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Button,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Assignment,
  Payment,
  Message,
  CheckCircle,
  Info,
  Warning,
  Error,
  MarkEmailRead,
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '@/store/api/notificationApi';

interface NotificationsListProps {
  limit?: number;
}

export function NotificationsList({ limit = 5 }: NotificationsListProps) {
  const { 
    data: notificationsResponse, 
    isLoading, 
    error 
  } = useGetNotificationsQuery({
    page: 1,
    pageSize: limit,
    ordering: '-createdAt'
  });

  const [markAsRead] = useMarkAsReadMutation();

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order_update':
      case 'order_status':
        return <Assignment />;
      case 'payment':
      case 'payment_received':
        return <Payment />;
      case 'message':
      case 'new_message':
        return <Message />;
      case 'order_completed':
        return <CheckCircle />;
      case 'system':
        return <Info />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return 'action.disabled';
    
    switch (type.toLowerCase()) {
      case 'order_completed':
        return 'success.main';
      case 'payment':
      case 'payment_received':
        return 'success.main';
      case 'order_update':
      case 'order_status':
        return 'info.main';
      case 'message':
      case 'new_message':
        return 'primary.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order_completed':
      case 'payment_received':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'message':
      case 'new_message':
        return 'primary';
      default:
        return 'info';
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width="80%" />}
              secondary={<Skeleton variant="text" width="60%" />}
            />
          </ListItem>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load notifications.
      </Alert>
    );
  }

  if (!notificationsResponse?.results || notificationsResponse.results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No notifications yet
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {notificationsResponse.results.map((notification, index) => (
        <ListItem 
          key={notification.id} 
          sx={{ 
            px: 0, 
            py: 1,
            bgcolor: notification.isRead ? 'transparent' : 'action.hover',
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <ListItemAvatar>
            <Badge 
              variant="dot" 
              color="primary" 
              invisible={notification.isRead}
              sx={{
                '& .MuiBadge-badge': {
                  right: 6,
                  top: 6,
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: notification.isRead ? 'action.disabled' : getNotificationColor(notification.type, notification.isRead),
                  color: 'white',
                  width: 36,
                  height: 36,
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            </Badge>
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: notification.isRead ? 'normal' : 'bold',
                    color: notification.isRead ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {notification.title}
                </Typography>
                <Chip
                  label={notification.type.replace('_', ' ')}
                  color={getSeverityColor(notification.type) as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography 
                  variant="body2" 
                  color={notification.isRead ? 'text.disabled' : 'text.secondary'}
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mt: 0.5
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            }
          />
          
          {!notification.isRead && (
            <IconButton
              size="small"
              onClick={() => handleMarkAsRead(notification.id)}
              title="Mark as read"
              sx={{ ml: 1 }}
            >
              <MarkEmailRead fontSize="small" />
            </IconButton>
          )}
        </ListItem>
      ))}
      
      {notificationsResponse.results.length >= limit && (
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Button
            component={Link}
            href="/notifications"
            variant="outlined"
            size="small"
          >
            View All Notifications
          </Button>
        </Box>
      )}
    </List>
  );
}