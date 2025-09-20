'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Alert,
  Pagination,
  Card,
  CardContent,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FilterList,
  Clear,
  Payment as PaymentIcon,
  Receipt,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { 
  useGetPaymentsQuery, 
  useGetUserPaymentsQuery,
  useDownloadPaymentReceiptMutation,
  useRefundPaymentMutation 
} from '@/store/api/paymentApi';
import { PaymentCard } from '@/components/payments/PaymentCard';

function PaymentsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    orderId: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    page: 1,
    pageSize: 12,
  });
  const [refundDialog, setRefundDialog] = useState<{ open: boolean; payment: any | null }>({
    open: false,
    payment: null,
  });
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Use different queries based on user role
  const isAdmin = user?.role === 'admin';
  
  const queryFilters = {
    ...filters,
    orderId: filters.orderId ? parseInt(filters.orderId) : undefined,
    dateFrom: filters.dateFrom?.toISOString(),
    dateTo: filters.dateTo?.toISOString(),
  };

  const { data: paymentsData, isLoading, error } = isAdmin 
    ? useGetPaymentsQuery(queryFilters)
    : useGetUserPaymentsQuery({ page: filters.page, pageSize: filters.pageSize });

  const [downloadReceipt, { isLoading: downloadingReceipt }] = useDownloadPaymentReceiptMutation();
  const [refundPayment, { isLoading: refunding }] = useRefundPaymentMutation();

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

  const clearFilters = () => {
    setFilters({
      status: '',
      paymentMethod: '',
      orderId: '',
      dateFrom: null,
      dateTo: null,
      page: 1,
      pageSize: 12,
    });
  };

  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      const blob = await downloadReceipt(paymentId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-receipt-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

  const handleRefund = (payment: any) => {
    setRefundDialog({ open: true, payment });
    setRefundAmount(payment.amount.toString());
    setRefundReason('');
  };

  const handleRefundSubmit = async () => {
    if (!refundDialog.payment) return;

    try {
      await refundPayment({
        id: refundDialog.payment.id,
        data: {
          amount: refundAmount ? parseFloat(refundAmount) : undefined,
          reason: refundReason.trim() || undefined,
        },
      }).unwrap();
      
      setRefundDialog({ open: false, payment: null });
      setRefundAmount('');
      setRefundReason('');
    } catch (error) {
      console.error('Failed to refund payment:', error);
    }
  };

  const payments = paymentsData?.results || [];
  const totalCount = paymentsData?.count || 0;
  const pageCount = Math.ceil(totalCount / filters.pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isAdmin ? 'Manage all payments and transactions' : 'View your payment history'}
        </Typography>
      </Box>

      {/* Filters - Only show for admin */}
      {isAdmin && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FilterList />
              <Typography variant="h6">Filters</Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Method</InputLabel>
                  <Select
                    value={filters.paymentMethod}
                    label="Method"
                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                  >
                    <MenuItem value="">All Methods</MenuItem>
                    <MenuItem value="card">Credit Card</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Order ID"
                  type="number"
                  value={filters.orderId}
                  onChange={(e) => handleFilterChange('orderId', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  sx={{ height: '40px' }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary">
              Showing {payments.length} of {totalCount} payments
            </Typography>
          </LocalizationProvider>
        </Paper>
      )}

      {/* Loading State */}
      {isLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load payments. Please try again.
        </Alert>
      )}

      {/* Payments Grid */}
      {!isLoading && !error && (
        <>
          {payments.length > 0 ? (
            <Grid container spacing={3}>
              {payments.map((payment: any) => (
                <Grid item xs={12} md={6} key={payment.id}>
                  <PaymentCard
                    payment={payment}
                    currentUserRole={user?.role}
                    currentUserId={user?.id}
                    showOrder={true}
                    showStudent={isAdmin}
                    onDownloadReceipt={handleDownloadReceipt}
                    onRefund={handleRefund}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <PaymentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Payments Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAdmin 
                  ? "No payments match your current filters."
                  : "You haven't made any payments yet."
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

      {/* Refund Dialog */}
      <Dialog open={refundDialog.open} onClose={() => setRefundDialog({ open: false, payment: null })}>
        <DialogTitle>Refund Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Payment #{refundDialog.payment?.id} - ${refundDialog.payment?.amount}
          </Typography>
          
          <TextField
            fullWidth
            label="Refund Amount"
            type="number"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, max: refundDialog.payment?.amount, step: 0.01 }}
            helperText="Leave empty to refund full amount"
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Refund Reason"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Reason for refund (optional)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialog({ open: false, payment: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleRefundSubmit} 
            variant="contained" 
            color="warning"
            disabled={refunding}
          >
            {refunding ? 'Processing...' : 'Refund Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function PaymentsPageWithAuth() {
  return (
    <PrivateRoute>
      <PaymentsPage />
    </PrivateRoute>
  );
}