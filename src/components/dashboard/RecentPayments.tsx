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
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import {
  Payment,
  CheckCircle,
  Schedule,
  Error,
  CreditCard,
  AccountBalance,
} from '@mui/icons-material';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { useGetPaymentsQuery } from '@/store/api/paymentApi';

interface RecentPaymentsProps {
  limit?: number;
}

export function RecentPayments({ limit = 5 }: RecentPaymentsProps) {
  const { 
    data: paymentsResponse, 
    isLoading, 
    error 
  } = useGetPaymentsQuery({
    page: 1,
    pageSize: limit,
    ordering: '-createdAt'
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        return <CheckCircle color="success" />;
      case 'pending':
      case 'processing':
        return <Schedule color="warning" />;
      case 'failed':
      case 'cancelled':
        return <Error color="error" />;
      default:
        return <Payment />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'succeeded': return 'success';
      case 'pending':
      case 'processing': return 'warning';
      case 'failed':
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
      case 'credit_card':
        return <CreditCard />;
      case 'bank':
      case 'bank_transfer':
        return <AccountBalance />;
      default:
        return <Payment />;
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
              primary={<Skeleton variant="text" width="60%" />}
              secondary={<Skeleton variant="text" width="40%" />}
            />
          </ListItem>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load payment history.
      </Alert>
    );
  }

  if (!paymentsResponse?.results || paymentsResponse.results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Payment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No payment history yet
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {paymentsResponse.results.map((payment: any, index: number) => (
        <ListItem key={payment.id} sx={{ px: 0, py: 1.5 }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
              {getStatusIcon(payment.status)}
            </Avatar>
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">
                  Order #{payment.order.id}
                </Typography>
                <Typography variant="subtitle2" color="primary.main">
                  ${payment.amount}
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
                    {getPaymentMethodIcon(payment.method)}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {payment.method.replace('_', ' ')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
                <Chip
                  label={payment.status}
                  color={getStatusColor(payment.status) as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            }
          />
        </ListItem>
      ))}
      
      {paymentsResponse.results.length >= limit && (
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Button
            component={Link}
            href="/payments"
            variant="outlined"
            size="small"
          >
            View All Payments
          </Button>
        </Box>
      )}
    </List>
  );
}