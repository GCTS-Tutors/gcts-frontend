'use client';

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  MoreVert,
  Receipt,
  Refresh,
  Undo,
  CreditCard,
  AccountBalance,
  Wallet,
  Payment as PaymentIcon,
  CheckCircle,
  Error,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

interface PaymentCardProps {
  payment: any;
  currentUserRole?: string;
  currentUserId?: number;
  showOrder?: boolean;
  showStudent?: boolean;
  onDownloadReceipt?: (paymentId: number) => void;
  onRefund?: (payment: any) => void;
  onRetry?: (paymentId: number) => void;
}

export function PaymentCard({
  payment,
  currentUserRole,
  currentUserId,
  showOrder = true,
  showStudent = false,
  onDownloadReceipt,
  onRefund,
  onRetry,
}: PaymentCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadReceipt = () => {
    if (onDownloadReceipt) onDownloadReceipt(payment.id);
    handleMenuClose();
  };

  const handleRefund = () => {
    if (onRefund) onRefund(payment);
    handleMenuClose();
  };

  const handleRetry = () => {
    if (onRetry) onRetry(payment.id);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle />;
      case 'processing': return <Schedule />;
      case 'pending': return <Schedule />;
      case 'failed': return <Error />;
      case 'cancelled': return <Cancel />;
      case 'refunded': return <Undo />;
      default: return <PaymentIcon />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card': return <CreditCard />;
      case 'paypal': return <PaymentIcon />;
      case 'bank_transfer': return <AccountBalance />;
      case 'wallet': return <Wallet />;
      default: return <PaymentIcon />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Bank Transfer';
      case 'wallet': return 'Wallet';
      default: return method;
    }
  };

  const canDownloadReceipt = () => {
    return payment.status === 'completed' || payment.status === 'refunded';
  };

  const canRefund = () => {
    return currentUserRole === 'admin' && payment.status === 'completed';
  };

  const canRetry = () => {
    return payment.status === 'failed' && 
           (currentUserRole === 'admin' || 
            (currentUserRole === 'student' && payment.order.student.id === currentUserId));
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: `${getStatusColor(payment.status)}.main` }}>
              {getStatusIcon(payment.status)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment #{payment.id}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getStatusIcon(payment.status)}
              label={payment.status.replace('_', ' ')}
              color={getStatusColor(payment.status) as any}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Payment Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Payment Method</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getPaymentMethodIcon(payment.paymentMethod)}
              <Typography variant="body1">
                {getPaymentMethodLabel(payment.paymentMethod)}
              </Typography>
            </Box>
          </Box>
          
          {payment.transactionId && (
            <Box>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                {payment.transactionId}
              </Typography>
            </Box>
          )}
          
          <Box>
            <Typography variant="body2" color="text.secondary">Created</Typography>
            <Typography variant="body1">
              {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Box>
          
          {payment.paidAt && (
            <Box>
              <Typography variant="body2" color="text.secondary">Paid</Typography>
              <Typography variant="body1">
                {format(new Date(payment.paidAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Order Information */}
        {showOrder && payment.order && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Order</Typography>
            <Typography variant="body1">
              #{payment.order.id} - {payment.order.title}
            </Typography>
          </Box>
        )}

        {/* Student Information */}
        {showStudent && payment.order?.student && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Student</Typography>
            <Typography variant="body1">
              {payment.order.student.firstName} {payment.order.student.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {payment.order.student.email}
            </Typography>
          </Box>
        )}

        {/* Failure Reason */}
        {payment.status === 'failed' && payment.failureReason && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="error.main" gutterBottom>Failure Reason</Typography>
            <Typography variant="body2" color="error.main">
              {payment.failureReason}
            </Typography>
          </Box>
        )}

        {/* Refund Information */}
        {payment.status === 'refunded' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Refunded</Typography>
            <Typography variant="body1">
              {payment.refundedAt && format(new Date(payment.refundedAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
            {payment.refundId && (
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                Refund ID: {payment.refundId}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Footer */}
        <Typography variant="caption" color="text.secondary">
          Last updated {formatDistanceToNow(new Date(payment.updatedAt), { addSuffix: true })}
        </Typography>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canDownloadReceipt() && (
          <MenuItem onClick={handleDownloadReceipt}>
            <Receipt sx={{ mr: 1 }} />
            Download Receipt
          </MenuItem>
        )}
        
        {canRetry() && (
          <MenuItem onClick={handleRetry}>
            <Refresh sx={{ mr: 1 }} />
            Retry Payment
          </MenuItem>
        )}
        
        {canRefund() && (
          <MenuItem onClick={handleRefund} sx={{ color: 'warning.main' }}>
            <Undo sx={{ mr: 1 }} />
            Refund Payment
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}