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
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
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
  Alert,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Message,
  Upload,
  GetApp,
  Schedule,
  AttachMoney,
  Person,
  Assignment,
  Visibility,
  MoreVert,
  Phone,
  Email,
  School,
  Description,
  AttachFile,
  Star,
  Warning,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetOrderQuery, useUpdateOrderMutation, useDeleteOrderMutation } from '@/store/api/orderApi';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { data: order, isLoading, error, refetch } = useGetOrderQuery(params.id);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async () => {
    if (order && newStatus) {
      await updateOrder({
        id: order.id,
        data: { status: newStatus as any },
      });
      setStatusDialog(false);
      setNewStatus('');
      refetch();
    }
  };

  const handleDeleteOrder = async () => {
    if (order) {
      await deleteOrder(order.id);
      setDeleteDialog(false);
      router.push('/orders');
    }
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <Schedule />;
      case 'pending': return <Warning />;
      case 'cancelled': return <Cancel />;
      case 'revision': return <Refresh />;
      default: return <Assignment />;
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

  const canEdit = () => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'student' && order?.user === user.id && order?.status === 'pending') return true;
    return false;
  };

  const canDelete = () => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'student' && order?.user === user.id && order?.status === 'pending') return true;
    return false;
  };

  const canUpdateStatus = () => {
    return user?.role === 'admin' || (user?.role === 'writer' && order?.assigned_to === user.id);
  };

  const getOrderSteps = () => {
    return [
      'Order Placed',
      'Writer Assigned',
      'Work in Progress',
      'Submitted for Review',
      'Completed'
    ];
  };

  const getActiveStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 0;
      case 'in_progress': return 2;
      case 'revision': return 3;
      case 'completed': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading order details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or you don't have permission to view it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          Orders
        </Link>
        <Typography color="text.primary">Order #{order.id}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} href="/orders">
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1">
              {order.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Order #{order.id}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status.replace('_', ' ')}
            color={getStatusColor(order.status) as any}
            sx={{ textTransform: 'capitalize' }}
          />
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Progress
          </Typography>
          <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
            {getOrderSteps().map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {order.description}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText
                        primary="Order Type"
                        secondary={order.type?.replace('_', ' ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>
                      <ListItemText
                        primary="Academic Level"
                        secondary={order.level}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText
                        primary="Subject"
                        secondary={order.subject || 'General'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pages"
                        secondary={`${order.min_pages} pages`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoney />
                      </ListItemIcon>
                      <ListItemText
                        primary="Price"
                        secondary={`$${order.price}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary="Deadline"
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {format(new Date(order.deadline), 'PPP p')}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color={`${getUrgencyColor(order.deadline)}.main`}
                            >
                              {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {/* Instructions */}
              {order.instructions && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Special Instructions
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2">
                      {order.instructions}
                    </Typography>
                  </Paper>
                </Box>
              )}

            </CardContent>
          </Card>

          {/* Order History/Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText
                    primary="Order created"
                    secondary={format(new Date(order.created_at), 'PPP p')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Student Info */}
          {order.user && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {order.user.first_name} {order.user.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Student ID: {order.user.id}
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary={order.user.email} />
                  </ListItem>
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Message />}
                  component={Link}
                  href={`/orders/${order.id}/messages`}
                  sx={{ mt: 2 }}
                >
                  Message Student
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Writer Info */}
          {order.assigned_to ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assigned Writer
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'info.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {order.assigned_to.first_name} {order.assigned_to.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Writer ID: {order.assigned_to.id}
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary={order.assigned_to.email} />
                  </ListItem>
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Message />}
                  component={Link}
                  href={`/orders/${order.id}/messages`}
                  sx={{ mt: 2 }}
                >
                  Message Writer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Writer Assignment
                </Typography>
                <Alert severity="info">
                  No writer assigned yet. The order is available for writers to bid on.
                </Alert>
                {user?.role === 'admin' && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Assign Writer
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {canEdit() && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    component={Link}
                    href={`/orders/${order.id}/edit`}
                  >
                    Edit Order
                  </Button>
                )}
                
                {canUpdateStatus() && (
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => setStatusDialog(true)}
                  >
                    Update Status
                  </Button>
                )}
                
                {user?.role === 'writer' && order.assigned_to?.id === user.id && order.status === 'in_progress' && (
                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    component={Link}
                    href={`/orders/${order.id}/submit`}
                  >
                    Submit Work
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<Message />}
                  component={Link}
                  href={`/orders/${order.id}/messages`}
                >
                  View Messages
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canEdit() && (
          <MenuItem component={Link} href={`/orders/${order.id}/edit`}>
            <Edit sx={{ mr: 1 }} />
            Edit Order
          </MenuItem>
        )}
        
        <MenuItem component={Link} href={`/orders/${order.id}/messages`}>
          <Message sx={{ mr: 1 }} />
          Messages
        </MenuItem>
        
        {canUpdateStatus() && (
          <MenuItem onClick={() => { setStatusDialog(true); handleMenuClose(); }}>
            <Refresh sx={{ mr: 1 }} />
            Update Status
          </MenuItem>
        )}
        
        {canDelete() && (
          <MenuItem onClick={() => { setDeleteDialog(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete Order
          </MenuItem>
        )}
      </Menu>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function OrderDetailsPageWithAuth({ params }: OrderDetailsPageProps) {
  return (
    <PrivateRoute>
      <OrderDetailsPage params={params} />
    </PrivateRoute>
  );
}