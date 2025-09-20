'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Breadcrumbs,
  IconButton,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetOrderQuery, useUpdateOrderMutation } from '@/store/api/orderApi';
import { useGetSubjectsQuery } from '@/store/api/subjectApi';

interface EditOrderPageProps {
  params: {
    id: string;
  };
}

function EditOrderPage({ params }: EditOrderPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    orderType: '',
    academicLevel: '',
    subjectId: '',
    pages: 1,
    price: 0,
    deadline: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: order, isLoading: orderLoading } = useGetOrderQuery(parseInt(params.id));
  const { data: subjects } = useGetSubjectsQuery();
  const [updateOrder] = useUpdateOrderMutation();

  useEffect(() => {
    if (order) {
      setFormData({
        title: order.title || '',
        description: order.description || '',
        instructions: order.instructions || '',
        orderType: order.orderType || '',
        academicLevel: order.academicLevel || '',
        subjectId: order.subject?.id?.toString() || '',
        pages: order.pages || 1,
        price: order.price || 0,
        deadline: new Date(order.deadline),
      });
    }
  }, [order]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateOrder({
        id: parseInt(params.id),
        data: {
          title: formData.title,
          description: formData.description,
          instructions: formData.instructions,
          orderType: formData.orderType as any,
          academicLevel: formData.academicLevel as any,
          subject: parseInt(formData.subjectId) as any,
          pages: formData.pages,
          price: formData.price,
          deadline: formData.deadline.toISOString(),
        },
      }).unwrap();

      router.push(`/orders/${params.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (!order || !user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'student' && order.student?.id === user.id && order.status === 'pending') return true;
    return false;
  };

  if (orderLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading order...</Typography>
      </Container>
    );
  }

  if (!order || !canEdit()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or you don't have permission to edit it.
        </Alert>
      </Container>
    );
  }

  const orderTypes = [
    'essay',
    'research_paper',
    'dissertation',
    'thesis',
    'assignment',
    'case_study',
    'lab_report',
    'book_review',
    'article_review',
    'presentation',
  ];

  const academicLevels = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Masters',
    'PhD',
    'Professional',
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          Orders
        </Link>
        <Link href={`/orders/${params.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          Order #{params.id}
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton component={Link} href={`/orders/${params.id}`}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Edit Order
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Order #{params.id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Order Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    helperText="Provide a clear, descriptive title for your order"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    helperText="Describe the requirements and what you need"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Special Instructions"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    helperText="Any additional instructions or requirements (optional)"
                  />
                </Grid>

                {/* Order Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Order Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      value={formData.orderType}
                      label="Order Type"
                      onChange={(e) => handleInputChange('orderType', e.target.value)}
                    >
                      {orderTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Academic Level</InputLabel>
                    <Select
                      value={formData.academicLevel}
                      label="Academic Level"
                      onChange={(e) => handleInputChange('academicLevel', e.target.value)}
                    >
                      {academicLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={formData.subjectId}
                      label="Subject"
                      onChange={(e) => handleInputChange('subjectId', e.target.value)}
                    >
                      {subjects?.map((subject: any) => (
                        <MenuItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Pages"
                    value={formData.pages}
                    onChange={(e) => handleInputChange('pages', parseInt(e.target.value))}
                    required
                    inputProps={{ min: 1, max: 50 }}
                    helperText="Minimum 1 page, maximum 50 pages"
                  />
                </Grid>

                {/* Pricing and Deadline */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Pricing & Deadline
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price ($)"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Order price in USD"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Deadline"
                    value={formData.deadline}
                    onChange={(date) => handleInputChange('deadline', date)}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        required: true,
                        helperText: "When do you need this completed?"
                      } 
                    }}
                    minDateTime={new Date()}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      component={Link}
                      href={`/orders/${params.id}`}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function EditOrderPageWithAuth({ params }: EditOrderPageProps) {
  return (
    <PrivateRoute>
      <EditOrderPage params={params} />
    </PrivateRoute>
  );
}