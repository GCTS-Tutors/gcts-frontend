'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Assignment,
  Schedule,
  AttachMoney,
  Person,
  Visibility,
  Send,
  Close,
} from '@mui/icons-material';
import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useGetOrdersQuery } from '@/store/api/orderApi';

interface AvailableOrdersListProps {
  limit?: number;
}

export function AvailableOrdersList({ limit = 10 }: AvailableOrdersListProps) {
  const [bidDialog, setBidDialog] = useState<{ open: boolean; order: any | null }>({
    open: false,
    order: null,
  });
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  const { 
    data: ordersResponse, 
    isLoading, 
    error 
  } = useGetOrdersQuery({
    page: 1,
    pageSize: limit,
    ordering: '-createdAt',
    filters: { status: ['pending'] } // Only show pending orders available for bidding
  });

  const handleBidClick = (order: any) => {
    setBidDialog({ open: true, order });
    setBidAmount(order.price?.toString() || '');
    setBidMessage('');
  };

  const handleCloseBidDialog = () => {
    setBidDialog({ open: false, order: null });
    setBidAmount('');
    setBidMessage('');
  };

  const handleSubmitBid = () => {
    // TODO: Implement bid submission
    console.log('Submitting bid:', {
      orderId: bidDialog.order?.id,
      amount: bidAmount,
      message: bidMessage,
    });
    handleCloseBidDialog();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'very_urgent': return 'error';
      case 'urgent': return 'warning';
      default: return 'info';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    const index = subject.length % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Skeleton variant="rectangular" width={60} height={24} />
                  <Skeleton variant="rectangular" width={80} height={24} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load available orders. Please try again later.
      </Alert>
    );
  }

  if (!ordersResponse?.results || ordersResponse.results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Available Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are currently no orders available for bidding
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {ordersResponse.results.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 1 }}>
                    {order.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ fontSize: 20, color: 'success.main' }} />
                    <Typography variant="h6" color="success.main">
                      ${order.price}
                    </Typography>
                  </Box>
                </Box>

                {/* Student Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Student: {order.student?.firstName} {order.student?.lastName}
                  </Typography>
                </Box>

                {/* Order Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {order.description?.substring(0, 120)}
                    {order.description && order.description.length > 120 && '...'}
                  </Typography>
                </Box>

                {/* Metadata */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={order.subject?.name || 'General'}
                    color={getSubjectColor(order.subject?.name || 'General') as any}
                    size="small"
                  />
                  <Chip
                    label={`${order.pages} pages`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={order.academicLevel}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                {/* Deadline */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ fontSize: 16, color: 'warning.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Due: {format(new Date(order.deadline), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                  <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                    ({formatDistanceToNow(new Date(order.deadline), { addSuffix: true })})
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Send />}
                    onClick={() => handleBidClick(order)}
                    sx={{ flexGrow: 1 }}
                  >
                    Place Bid
                  </Button>
                  <IconButton
                    size="small"
                    title="View Details"
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <Visibility />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More */}
      {ordersResponse.results.length >= limit && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large">
            Load More Orders
          </Button>
        </Box>
      )}

      {/* Bid Dialog */}
      <Dialog
        open={bidDialog.open}
        onClose={handleCloseBidDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Place Bid on Order
          <IconButton onClick={handleCloseBidDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {bidDialog.order && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {bidDialog.order.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {bidDialog.order.description}
              </Typography>

              <TextField
                fullWidth
                label="Your Bid Amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                sx={{ mb: 2 }}
                helperText={`Order price: $${bidDialog.order.price}`}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Proposal Message"
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Explain why you're the best choice for this order..."
                helperText="Introduce yourself and explain your qualifications"
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseBidDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitBid}
            disabled={!bidAmount || !bidMessage}
          >
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}