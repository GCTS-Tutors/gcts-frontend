'use client';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
  Alert,
  Pagination,
  Tooltip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Assignment,
  Person,
  Schedule,
  AttachMoney,
  Search,
  FilterList,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useGetOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation } from '@/store/api/orderApi';

export function OrderManagementTab() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { data: ordersResponse, isLoading, error } = useGetOrdersQuery({
    page,
    pageSize: 15,
    ordering: '-createdAt',
    filters: {
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? [statusFilter] : undefined,
    },
  });

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusClick = () => {
    setNewStatus(selectedOrder?.status || '');
    setStatusDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      await updateOrder({
        id: selectedOrder.id,
        data: { status: newStatus as any },
      });
    }
    setStatusDialog(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      await deleteOrder(selectedOrder.id);
    }
    setDeleteDialog(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'revision': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    const index = type.length % colors.length;
    return colors[index];
  };

  const getProgressValue = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 100;
      case 'in_progress': return 70;
      case 'revision': return 85;
      case 'pending': return 20;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['Order', 'Student', 'Writer', 'Status', 'Type', 'Price', 'Due Date', 'Actions'].map((header) => (
                  <TableCell key={header}>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load orders. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Order Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ordersResponse?.count || 0} total orders
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="revision">Revision</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="essay">Essay</MenuItem>
              <MenuItem value="research_paper">Research Paper</MenuItem>
              <MenuItem value="dissertation">Dissertation</MenuItem>
              <MenuItem value="thesis">Thesis</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Details</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Writer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type & Pages</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersResponse?.results?.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {order.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID: #{order.id}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(order.status)}
                      sx={{ height: 4, borderRadius: 2 }}
                      color={getStatusColor(order.status) as any}
                    />
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1, bgcolor: 'success.main', width: 32, height: 32 }}>
                      <Person sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {order.student?.firstName} {order.student?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.student?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  {order.writer ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 1, bgcolor: 'info.main', width: 32, height: 32 }}>
                        <Person sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {order.writer.firstName} {order.writer.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.writer.email}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not assigned
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.status.replace('_', ' ')}
                    color={getStatusColor(order.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>

                <TableCell>
                  <Box>
                    <Chip
                      label={order.orderType?.replace('_', ' ') || 'N/A'}
                      color={getTypeColor(order.orderType || '') as any}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize', mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {order.pages} pages
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="subtitle2" color="success.main">
                      {order.price}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(order.deadline), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        component={Link}
                        href={`/orders/${order.id}`}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
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
      {ordersResponse && ordersResponse.count > 15 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(ordersResponse.count / 15)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
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
        <MenuItem onClick={handleStatusClick}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Update Status
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose()}>
          <Assignment sx={{ mr: 1, fontSize: 20 }} />
          Assign Writer
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete Order
        </MenuItem>
      </Menu>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Order: {selectedOrder?.title}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="revision">Revision Required</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order "{selectedOrder?.title}"? 
            This action cannot be undone and will affect the student and writer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}