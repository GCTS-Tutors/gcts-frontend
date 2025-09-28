'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Breadcrumbs,
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  AccountBalance,
  Payment as PaymentIcon,
  Lock,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetOrderQuery } from '@/store/api/orderApi';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '@/store/api/paymentApi';

interface OrderPaymentPageProps {
  params: {
    id: string;
  };
}

function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: order, isLoading: orderLoading } = useGetOrderQuery(params.id);
  const [createPaymentIntent, { isLoading: creatingIntent }] = useCreatePaymentIntentMutation();
  const [confirmPayment, { isLoading: confirmingPayment }] = useConfirmPaymentMutation();

  const canPay = () => {
    if (!order || !user) return false;
    // Only students can pay for their own orders
    if (user.role === 'student' && order.student?.id === user.id) {
      // Allow payment for pending orders
      return order.status === 'pending';
    }
    return false;
  };

  const handlePayment = async () => {
    setError('');
    setProcessing(true);

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        orderId: params.id,
        paymentMethod: paymentMethod as any,
        amount: order?.price || 0,
        currency: 'USD',
      }).unwrap();

      // For demo purposes, we'll simulate different payment flows
      if (paymentMethod === 'card') {
        // Simulate Stripe card payment
        await simulateCardPayment(paymentIntent.id);
      } else if (paymentMethod === 'paypal') {
        // Simulate PayPal payment
        await simulatePayPalPayment(paymentIntent.id);
      } else if (paymentMethod === 'bank_transfer') {
        // Simulate bank transfer
        await simulateBankTransfer(paymentIntent.id);
      }

      setSuccess(true);
      
      // Redirect to order details after successful payment
      setTimeout(() => {
        router.push(`/orders/${params.id}`);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const simulateCardPayment = async (paymentIntentId: string) => {
    // Simulate Stripe card payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 90% success rate for demo
    if (Math.random() < 0.9) {
      await confirmPayment({
        paymentIntentId,
        paymentMethodId: 'pm_card_visa', // Mock payment method ID
      }).unwrap();
    } else {
      throw { message: 'Card payment declined. Please try a different card.' };
    }
  };

  const simulatePayPalPayment = async (paymentIntentId: string) => {
    // Simulate PayPal payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await confirmPayment({
      paymentIntentId,
      paymentMethodId: 'pm_paypal', // Mock payment method ID
    }).unwrap();
  };

  const simulateBankTransfer = async (paymentIntentId: string) => {
    // Bank transfers are typically pending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would typically create a pending payment
    await confirmPayment({
      paymentIntentId,
      paymentMethodId: 'pm_bank_transfer', // Mock payment method ID
    }).unwrap();
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard />;
      case 'paypal': return <PaymentIcon />;
      case 'bank_transfer': return <AccountBalance />;
      default: return <PaymentIcon />;
    }
  };

  const getPaymentMethodDescription = (method: string) => {
    switch (method) {
      case 'card': return 'Pay securely with your credit or debit card';
      case 'paypal': return 'Pay with your PayPal account';
      case 'bank_transfer': return 'Transfer directly from your bank account';
      default: return '';
    }
  };

  if (orderLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  if (!order || !canPay()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or payment is not available for this order.
        </Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your payment has been processed successfully. You will be redirected to your order details.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href={`/orders/${params.id}`}
          >
            View Order
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          Orders
        </Link>
        <Link href={`/orders/${params.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          Order #{order.id}
        </Link>
        <Typography color="text.primary">Payment</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton component={Link} href={`/orders/${params.id}`}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Complete Payment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Order #{order.id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Order Summary */}
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">{order.title}</Typography>
              <Typography variant="body1">${order.price}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {order.pages} pages • {order.academicLevel} • {order.subject?.name}
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h6" color="primary.main">
                ${order.price} USD
              </Typography>
            </Box>
          </Box>

          {/* Payment Methods */}
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {/* Credit Card */}
              <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'card' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider' }}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <CreditCard />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Credit/Debit Card</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPaymentMethodDescription('card')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Paper>

              {/* PayPal */}
              <Paper sx={{ p: 2, mb: 2, border: paymentMethod === 'paypal' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider' }}>
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <PaymentIcon />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">PayPal</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPaymentMethodDescription('paypal')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Paper>

              {/* Bank Transfer */}
              <Paper sx={{ p: 2, border: paymentMethod === 'bank_transfer' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'bank_transfer' ? 'primary.main' : 'divider' }}>
                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <AccountBalance />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">Bank Transfer</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPaymentMethodDescription('bank_transfer')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>

          {/* Security Notice */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Lock color="success" />
            <Typography variant="body2" color="text.secondary">
              Your payment information is secure and encrypted. We never store your payment details.
            </Typography>
          </Box>

          {/* Payment Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={processing || creatingIntent || confirmingPayment}
            startIcon={processing ? <CircularProgress size={20} /> : getPaymentMethodIcon(paymentMethod)}
            sx={{ py: 1.5 }}
          >
            {processing ? 'Processing Payment...' : `Pay $${order.price} USD`}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function OrderPaymentPageWithAuth({ params }: OrderPaymentPageProps) {
  return (
    <PrivateRoute>
      <OrderPaymentPage params={params} />
    </PrivateRoute>
  );
}