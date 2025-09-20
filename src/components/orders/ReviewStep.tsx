'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Alert,
  Button,
} from '@mui/material';
import {
  Assignment,
  Schedule,
  Subject,
  Description,
  AttachFile,
  Payment,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { OrderFormData } from '@/app/order/place/page';

interface ReviewStepProps {
  data: OrderFormData;
  errors: Record<string, string>;
  onChange: (data: Partial<OrderFormData>) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function ReviewStep({ data, errors }: ReviewStepProps) {
  const serviceFee = Math.round(data.budget * 0.05);
  const totalAmount = data.budget + serviceFee;
  const deadline = data.deadline ? new Date(data.deadline) : null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'very_urgent': return 'error';
      case 'urgent': return 'warning';
      default: return 'success';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'very_urgent': return 'Very Urgent (1-2 days)';
      case 'urgent': return 'Urgent (3-6 days)';
      default: return 'Standard (7+ days)';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Review Your Order
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all details before placing your order
      </Typography>

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Please fix the following errors before proceeding:
          </Typography>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Order Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                Order Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Title"
                    secondary={data.title || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Subject"
                    secondary={data.subject || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Type"
                    secondary={data.type || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Academic Level"
                    secondary={data.academicLevel || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Pages"
                    secondary={`${data.pages} pages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Deadline"
                    secondary={deadline ? format(deadline, 'PPP p') : 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Urgency"
                    secondary={
                      <Chip
                        label={getUrgencyLabel(data.urgency)}
                        color={getUrgencyColor(data.urgency) as any}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Requirements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />
                Requirements
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Description"
                    secondary={
                      <Typography variant="body2" sx={{ 
                        maxHeight: 100, 
                        overflow: 'auto',
                        fontSize: '0.875rem',
                        lineHeight: 1.4
                      }}>
                        {data.description || 'Not provided'}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Citation Style"
                    secondary={data.citation || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Sources Required"
                    secondary={data.sources > 0 ? `${data.sources} sources` : 'No specific requirement'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Instructions
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                  {data.instructions || 'No detailed instructions provided'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Uploaded Files */}
        {data.files.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFile sx={{ mr: 1 }} />
                  Uploaded Files ({data.files.length})
                </Typography>
                <List dense>
                  {data.files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${formatFileSize(file.size)} • ${file.type || 'Unknown type'}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="caption" color="text.secondary">
                  Total: {formatFileSize(data.files.reduce((acc, file) => acc + file.size, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Budget & Payment Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} />
                Budget & Payment Information
              </Typography>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Important:</strong> No payment will be processed now. This is your estimated cost based on your budget.
                  You'll receive payment instructions after our team reviews your order.
                </Typography>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Estimated Cost Breakdown:
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
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Preferred Payment Method:</strong> {data.paymentMethod ? 
                  data.paymentMethod.charAt(0).toUpperCase() + data.paymentMethod.slice(1) : 
                  'Not selected'
                }
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You'll receive specific payment instructions for this method after order review.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Final Notice */}
        <Grid item xs={12}>
          <Alert severity="info" icon={<Info />}>
            <Typography variant="body2">
              <strong>What happens next?</strong><br />
              After placing your order, here's the process:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li><strong>Order Review:</strong> Our team reviews your requirements and provides a final cost quote</li>
              <li><strong>Payment Instructions:</strong> You'll receive email instructions for your selected payment method</li>
              <li><strong>Writer Assignment:</strong> Once payment is confirmed, we'll assign a qualified writer</li>
              <li><strong>Order Tracking:</strong> Monitor progress, communicate with your writer, and receive updates</li>
              <li><strong>Delivery:</strong> Download your completed work and request revisions if needed</li>
            </ul>
          </Alert>
        </Grid>

        {/* Terms Agreement */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              By placing this order, you agree to our{' '}
              <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                Terms of Service
              </Button>
              {' '}and{' '}
              <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                Privacy Policy
              </Button>
              . You confirm that the information provided is accurate and that you have the right to submit this work.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}