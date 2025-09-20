'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Typography,
  LinearProgress,
  Skeleton,
  Tooltip,
  Menu,
  MenuItem,
  Pagination,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Message,
  Upload,
  GetApp,
  Person,
  Star,
  Assignment,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

interface OrderTableProps {
  orders: any[];
  isLoading: boolean;
  userRole?: string;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalCount: number;
}

export function OrderTable({ 
  orders, 
  isLoading, 
  userRole, 
  onPageChange, 
  currentPage, 
  totalCount 
}: OrderTableProps) {
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
    return 'success';
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

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Writer</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="200px" />
                  <Skeleton variant="rectangular" width="100%" height={4} sx={{ mt: 1 }} />
                </TableCell>
                <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                <TableCell><Skeleton variant="text" width="60px" /></TableCell>
                <TableCell><Skeleton variant="text" width="120px" /></TableCell>
                <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
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
      </Paper>
    );
  }

  const pageCount = Math.ceil(totalCount / 12);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Writer</TableCell>
              <TableCell>Subject & Pages</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {order.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID: #{order.id} • {order.level || 'N/A'}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(order?.status)}
                      sx={{ height: 4, borderRadius: 2 }}
                      color={getStatusColor(order?.status) as any}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={order?.status?.replace('_', ' ') || 'Unknown'}
                    color={getStatusColor(order?.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>

                <TableCell>
                  {order?.user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 1, bgcolor: 'success.main', width: 32, height: 32 }}>
                        <Person sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {order.user.first_name || ''} {order.user.last_name || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user.email || ''}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unknown Student
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {order?.assigned_to ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 1, bgcolor: 'info.main', width: 32, height: 32 }}>
                        <Person sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {order.assigned_to.first_name || ''} {order.assigned_to.last_name || ''}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {order.assigned_to.email || ''}
                          </Typography>
                          {order.assigned_to.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                              <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {order.assigned_to.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not assigned
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Box>
                    <Chip
                      label={order?.subject || 'General'}
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {order?.min_pages || 0} pages
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  {order?.price ? (
                    <Typography variant="subtitle2" color="success.main">
                      ${order.price}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      TBD
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {order?.deadline ? (
                    <Box>
                      <Typography variant="body2">
                        {format(new Date(order.deadline), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(order.deadline), 'HH:mm')}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={`${getUrgencyColor(order.deadline)}.main`}
                      >
                        {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No deadline set
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        component={Link}
                        href={`/orders/${order.id}`}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Role-specific action buttons */}
                    {userRole === 'student' && order?.status !== 'pending' && order?.status !== 'cancelled' && (
                      <Tooltip title="Messages">
                        <IconButton
                          component={Link}
                          href={`/orders/${order.id}/messages`}
                          size="small"
                        >
                          <Message />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {userRole === 'writer' && order?.assigned_to?.id === order.currentUserId && (
                      <>
                        {order?.status === 'in_progress' && (
                          <Tooltip title="Submit Work">
                            <IconButton
                              component={Link}
                              href={`/orders/${order.id}/submit`}
                              size="small"
                              color="primary"
                            >
                              <Upload />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Messages">
                          <IconButton
                            component={Link}
                            href={`/orders/${order.id}/messages`}
                            size="small"
                          >
                            <Message />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, order)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
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