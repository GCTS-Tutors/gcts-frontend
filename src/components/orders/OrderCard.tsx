'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Skeleton,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Assignment,
  Person,
  Schedule,
  AttachMoney,
  MoreVert,
  Message,
  Upload,
  GetApp,
  Star,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  orders: any[];
  isLoading: boolean;
  userRole?: string;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalCount: number;
}

export function OrderCard({ 
  orders, 
  isLoading, 
  userRole, 
  onPageChange, 
  currentPage, 
  totalCount 
}: OrderCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'revision': return 'secondary';
      default: return 'default';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 100;
      case 'in_progress': return 70;
      case 'revision': return 85;
      case 'pending': return 20;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getUrgencyColor = (deadline: string) => {
    const now = new Date();
    const due = new Date(deadline);
    const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 24) return 'error';
    if (hoursLeft < 72) return 'warning';
    return 'info';
  };

  const canEdit = (order: any) => {
    if (userRole === 'admin') return true;
    if (userRole === 'student' && order?.status === 'pending') return true;
    return false;
  };

  const canDelete = (order: any) => {
    if (userRole === 'admin') return true;
    if (userRole === 'student' && order?.status === 'pending') return true;
    return false;
  };

  const getActionButtons = (order: any) => {
    const buttons = [];

    // View Details - Available to all
    buttons.push(
      <Button
        key="view"
        size="small"
        startIcon={<Visibility />}
        component={Link}
        href={`/orders/${order.id}`}
      >
        View
      </Button>
    );

    // Role-specific actions
    if (userRole === 'student') {
      if (order?.status !== 'pending' && order?.status !== 'cancelled') {
        buttons.push(
          <Button
            key="message"
            size="small"
            startIcon={<Message />}
            component={Link}
            href={`/orders/${order.id}/messages`}
          >
            Message
          </Button>
        );
      }
    } else if (userRole === 'writer') {
      if (order.assigned_to?.id === order.currentUserId) {
        if (order?.status === 'in_progress') {
          buttons.push(
            <Button
              key="submit"
              size="small"
              startIcon={<Upload />}
              variant="contained"
              component={Link}
              href={`/orders/${order.id}/submit`}
            >
              Submit
            </Button>
          );
        }
        buttons.push(
          <Button
            key="message"
            size="small"
            startIcon={<Message />}
            component={Link}
            href={`/orders/${order.id}/messages`}
          >
            Message
          </Button>
        );
      }
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Skeleton variant="rectangular" width={60} height={24} />
                  <Skeleton variant="rectangular" width={80} height={24} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={4} sx={{ mt: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="30%" />
                </Box>
              </CardContent>
              <CardActions>
                <Skeleton variant="rectangular" width={60} height={32} />
                <Skeleton variant="rectangular" width={80} height={32} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No Orders Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === 'student' 
            ? "You haven't placed any orders yet."
            : userRole === 'writer'
            ? "No orders match your current filters."
            : "No orders found matching the selected criteria."
          }
        </Typography>
      </Box>
    );
  }

  const pageCount = Math.ceil(totalCount / 12);

  return (
    <Box>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} lg={4} key={order.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 1 }}>
                    {order.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, order)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Status and Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={order?.status?.replace('_', ' ') || 'Unknown'}
                      color={getStatusColor(order?.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    {order?.price && (
                      <Chip
                        label={`$${order.price}`}
                        icon={<AttachMoney />}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressValue(order?.status)}
                    sx={{ height: 6, borderRadius: 3 }}
                    color={getStatusColor(order?.status) as any}
                  />
                </Box>

                {/* Order Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.description?.substring(0, 100)}
                    {order.description && order.description.length > 100 && '...'}
                  </Typography>
                </Box>

                {/* Metadata */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={order?.subject || 'General'}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={`${order?.min_pages || 0} pages`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={order?.level || 'N/A'}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                {/* People */}
                <Box sx={{ mb: 2 }}>
                  {order?.user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Student: {order.user.first_name || ''} {order.user.last_name || ''}
                      </Typography>
                    </Box>
                  )}
                  {order?.assigned_to && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Writer: {order.assigned_to.first_name || ''} {order.assigned_to.last_name || ''}
                      </Typography>
                      {order.assigned_to.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {order.assigned_to.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Deadline */}
                {order?.deadline && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, mr: 1, color: getUrgencyColor(order.deadline) }} />
                      <Typography variant="body2" color="text.secondary">
                        Due: {format(new Date(order.deadline), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={`${getUrgencyColor(order.deadline)}.main`}>
                      {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                    </Typography>
                  </>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                {getActionButtons(order)}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} href={`/orders/${selectedOrder?.id}`}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        
        {canEdit(selectedOrder) && (
          <MenuItem component={Link} href={`/orders/${selectedOrder?.id}/edit`}>
            <Edit sx={{ mr: 1 }} />
            Edit Order
          </MenuItem>
        )}
        
        {selectedOrder?.status !== 'cancelled' && selectedOrder?.status !== 'completed' && (
          <MenuItem component={Link} href={`/orders/${selectedOrder?.id}/messages`}>
            <Message sx={{ mr: 1 }} />
            Messages
          </MenuItem>
        )}
        
        
        {canDelete(selectedOrder) && (
          <MenuItem sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete Order
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}