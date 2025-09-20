/**
 * Updated Order Form component using the new dynamic dropdown system.
 * 
 * This shows how to integrate the DynamicDropdown component into a real form.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DynamicDropdown from './DynamicDropdown';

interface OrderFormData {
  title: string;
  subject: string;
  subject_custom?: string;
  order_type: string;
  order_type_custom?: string;
  academic_level: string;
  citation_style: string;
  citation_style_custom?: string;
  language: string;
  urgency_level: string;
  min_pages: number;
  max_pages: number;
  sources: number;
  instructions: string;
  deadline: string;
}

const OrderForm: React.FC = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OrderFormData>({
    defaultValues: {
      title: '',
      subject: '',
      subject_custom: '',
      order_type: '',
      order_type_custom: '',
      academic_level: '',
      citation_style: '',
      citation_style_custom: '',
      language: '',
      urgency_level: '',
      min_pages: 1,
      max_pages: 1,
      sources: 0,
      instructions: '',
      deadline: '',
    }
  });

  // Handle form submission
  const onSubmit = async (data: OrderFormData) => {
    try {
      setSubmitLoading(true);
      setSubmitError(null);

      // Prepare the data for submission
      const orderData = {
        ...data,
        // Include custom values only if "Other" options are selected
        ...(data.subject_custom && { subject_custom: data.subject_custom }),
        ...(data.order_type_custom && { order_type_custom: data.order_type_custom }),
        ...(data.citation_style_custom && { citation_style_custom: data.citation_style_custom }),
      };

      const response = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      console.log('Order created successfully:', result);
      
      // Handle success (redirect, show message, etc.)
      alert('Order created successfully!');
      
    } catch (err) {
      console.error('Error creating order:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create New Order
      </Typography>
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Order Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Subject */}
          <Grid item xs={12} md={6}>
            <Controller
              name="subject"
              control={control}
              rules={{ required: 'Subject is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Subject"
                  fieldType="subjects"
                  value={field.value}
                  customValue={watch('subject_custom')}
                  onChange={(value, customValue) => {
                    setValue('subject', value);
                    setValue('subject_custom', customValue || '');
                  }}
                  error={errors.subject?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Order Type */}
          <Grid item xs={12} md={6}>
            <Controller
              name="order_type"
              control={control}
              rules={{ required: 'Order type is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Order Type"
                  fieldType="order-types"
                  value={field.value}
                  customValue={watch('order_type_custom')}
                  onChange={(value, customValue) => {
                    setValue('order_type', value);
                    setValue('order_type_custom', customValue || '');
                  }}
                  error={errors.order_type?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Academic Level */}
          <Grid item xs={12} md={6}>
            <Controller
              name="academic_level"
              control={control}
              rules={{ required: 'Academic level is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Academic Level"
                  fieldType="academic-levels"
                  value={field.value}
                  onChange={(value) => setValue('academic_level', value)}
                  error={errors.academic_level?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Citation Style */}
          <Grid item xs={12} md={6}>
            <Controller
              name="citation_style"
              control={control}
              rules={{ required: 'Citation style is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Citation Style"
                  fieldType="citation-styles"
                  value={field.value}
                  customValue={watch('citation_style_custom')}
                  onChange={(value, customValue) => {
                    setValue('citation_style', value);
                    setValue('citation_style_custom', customValue || '');
                  }}
                  error={errors.citation_style?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Language */}
          <Grid item xs={12} md={6}>
            <Controller
              name="language"
              control={control}
              rules={{ required: 'Language is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Language"
                  fieldType="languages"
                  value={field.value}
                  onChange={(value) => setValue('language', value)}
                  error={errors.language?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Urgency Level */}
          <Grid item xs={12} md={6}>
            <Controller
              name="urgency_level"
              control={control}
              rules={{ required: 'Urgency level is required' }}
              render={({ field }) => (
                <DynamicDropdown
                  label="Urgency Level"
                  fieldType="urgency-levels"
                  value={field.value}
                  onChange={(value) => setValue('urgency_level', value)}
                  error={errors.urgency_level?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Pages */}
          <Grid item xs={6} md={3}>
            <Controller
              name="min_pages"
              control={control}
              rules={{ 
                required: 'Min pages is required',
                min: { value: 1, message: 'Must be at least 1' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Min Pages"
                  error={!!errors.min_pages}
                  helperText={errors.min_pages?.message}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Controller
              name="max_pages"
              control={control}
              rules={{ 
                required: 'Max pages is required',
                min: { value: 1, message: 'Must be at least 1' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Max Pages"
                  error={!!errors.max_pages}
                  helperText={errors.max_pages?.message}
                  required
                />
              )}
            />
          </Grid>

          {/* Sources */}
          <Grid item xs={12} md={6}>
            <Controller
              name="sources"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Number of Sources"
                  helperText="Number of required sources/references"
                />
              )}
            />
          </Grid>

          {/* Deadline */}
          <Grid item xs={12} md={6}>
            <Controller
              name="deadline"
              control={control}
              rules={{ required: 'Deadline is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="datetime-local"
                  label="Deadline"
                  error={!!errors.deadline}
                  helperText={errors.deadline?.message}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Instructions */}
          <Grid item xs={12}>
            <Controller
              name="instructions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Instructions"
                  placeholder="Provide detailed instructions for your order. If you selected 'Other' for any option above, please provide additional details here."
                  helperText="Include any specific requirements, formatting guidelines, or additional details"
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitLoading}
              sx={{ mt: 2 }}
            >
              {submitLoading ? 'Creating Order...' : 'Create Order'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default OrderForm;