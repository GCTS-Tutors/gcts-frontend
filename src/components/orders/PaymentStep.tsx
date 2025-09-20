'use client';

import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Grid,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Payment,
  Security,
} from '@mui/icons-material';
import type { OrderFormData } from '@/app/order/place/page';

interface PaymentStepProps {
  data: OrderFormData;
  errors: Record<string, string>;
  onChange: (data: Partial<OrderFormData>) => void;
}

const paymentMethods = [
  {
    value: 'card',
    label: 'Credit/Debit Card',
    description: 'Visa, MasterCard, American Express',
    icon: <CreditCard />,
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: <Payment />,
  },
  {
    value: 'bank',
    label: 'Bank Transfer',
    description: 'Direct bank transfer (processing may take 1-3 days)',
    icon: <AccountBalance />,
  },
];

export function PaymentStep({ data, errors, onChange }: PaymentStepProps) {
  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onChange({ budget: value });
  };

  const serviceFee = Math.round(data.budget * 0.05); // 5% service fee
  const totalAmount = data.budget + serviceFee;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Budget & Payment Method Preference
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your budget and choose your preferred payment method. No payment will be processed now - 
        you'll receive payment instructions after we review your order and confirm the final cost.
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Important:</strong> You are only selecting your preferred payment method. 
          Payment will be processed only after your order has been reviewed by our team and you've approved the final cost.
          You'll receive detailed payment instructions via email based on your selected method.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Budget */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Your Budget"
            type="number"
            value={data.budget || ''}
            onChange={handleBudgetChange}
            error={!!errors.budget}
            helperText={errors.budget || 'Set your maximum budget - this is used for initial cost estimation'}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{
              min: 1,
              step: 1,
            }}
          />
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Estimated Cost Preview
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              This is an estimate based on your budget. Final cost will be confirmed after review.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Your Budget:</Typography>
              <Typography>${data.budget}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Service Fee (5%):</Typography>
              <Typography>${serviceFee}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography variant="h6">Estimated Total:</Typography>
              <Typography variant="h6" color="primary">${totalAmount}</Typography>
            </Box>
            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
              * Final cost may vary based on order complexity and requirements
            </Typography>
          </Paper>
        </Grid>

        {/* Payment Methods */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Preferred Payment Method
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select your preferred payment method. You'll receive specific payment instructions for your chosen method after order review.
          </Typography>
          
          <FormControl fullWidth error={!!errors.paymentMethod}>
            <RadioGroup
              value={data.paymentMethod}
              onChange={(e) => onChange({ paymentMethod: e.target.value })}
            >
              {paymentMethods.map((method) => (
                <Card
                  key={method.value}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: data.paymentMethod === method.value ? 2 : 1,
                    borderColor: data.paymentMethod === method.value ? 'primary.main' : 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => onChange({ paymentMethod: method.value })}
                >
                  <CardContent sx={{ py: 2 }}>
                    <FormControlLabel
                      value={method.value}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ mr: 2, color: 'primary.main' }}>
                            {method.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {method.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
            {errors.paymentMethod && (
              <Typography color="error" variant="caption">
                {errors.paymentMethod}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Security Notice */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            icon={<Security />}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2">
              <strong>Secure Payment Processing</strong><br />
              All payments are processed securely using industry-standard encryption. 
              Your payment information is never stored on our servers and is handled by certified payment processors.
            </Typography>
          </Alert>
        </Grid>

        {/* Payment Process */}
        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'info.50', 
            border: 1, 
            borderColor: 'info.200',
            borderRadius: 1,
            p: 2,
            mt: 2 
          }}>
            <Typography variant="h6" gutterBottom>
              Payment Process
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>Order Submission:</strong> Submit your order with your budget and preferred payment method</li>
                <li><strong>Review & Quote:</strong> Our team reviews your requirements and provides a final cost estimate</li>
                <li><strong>Payment Instructions:</strong> You'll receive detailed payment instructions via email for your selected method</li>
                <li><strong>Payment Processing:</strong> Complete payment using the provided instructions</li>
                <li><strong>Work Begins:</strong> Your order is assigned to a qualified writer once payment is confirmed</li>
                <li><strong>Secure Escrow:</strong> Funds are held securely until work is completed and approved</li>
              </ul>
            </Typography>
          </Box>
        </Grid>

        {/* Guarantee Information */}
        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'success.50', 
            border: 1, 
            borderColor: 'success.200',
            borderRadius: 1,
            p: 2,
            mt: 2 
          }}>
            <Typography variant="h6" gutterBottom>
              Our Guarantee
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Free revisions within 7 days of completion</li>
                <li>Full refund if we cannot match you with a qualified writer</li>
                <li>100% refund if order is canceled within 1 hour of payment</li>
                <li>Partial refunds available for justified cancellations</li>
                <li>Money-back guarantee for unsatisfactory work</li>
              </ul>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}