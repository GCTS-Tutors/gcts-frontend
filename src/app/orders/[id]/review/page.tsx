'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Breadcrumbs,
  Alert,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Star,
  RateReview,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetOrderQuery } from '@/store/api/orderApi';
import { 
  useGetOrderReviewQuery, 
  useCreateReviewMutation, 
  useUpdateReviewMutation,
  useDeleteReviewMutation 
} from '@/store/api/reviewApi';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';

interface OrderReviewPageProps {
  params: {
    id: string;
  };
}

function OrderReviewPage({ params }: OrderReviewPageProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState('');

  const { data: order, isLoading: orderLoading } = useGetOrderQuery(parseInt(params.id));
  const { data: existingReview, isLoading: reviewLoading, refetch } = useGetOrderReviewQuery(parseInt(params.id));
  const [createReview, { isLoading: creating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  const canReview = () => {
    if (!order || !user) return false;
    // Only students can review their completed orders
    if (user.role === 'student' && order.student?.id === user.id && order.status === 'completed') {
      return true;
    }
    return false;
  };

  const canEditReview = () => {
    if (!existingReview || !user) return false;
    return user.role === 'admin' || existingReview.student.id === user.id;
  };

  const handleSubmitReview = async (data: {
    rating: number;
    comment: string;
    isPublic: boolean;
  }) => {
    setError('');
    
    try {
      if (existingReview) {
        await updateReview({
          id: existingReview.id,
          data,
        }).unwrap();
      } else {
        await createReview({
          ...data,
          orderId: parseInt(params.id),
        }).unwrap();
      }
      
      setShowReviewForm(false);
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async () => {
    if (!existingReview) return;
    
    setError('');
    
    try {
      await deleteReview(existingReview.id);
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const handleEditReview = () => {
    setShowReviewForm(true);
  };

  if (orderLoading || reviewLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or you don't have permission to view it.
        </Alert>
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
        <Typography color="text.primary">Review</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton component={Link} href={`/orders/${params.id}`}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Order Review
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {order.title}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Order Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Title</Typography>
              <Typography variant="body1">{order.title}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Writer</Typography>
              <Typography variant="body1">
                {order.writer ? 
                  `${order.writer.firstName} ${order.writer.lastName}` : 
                  'Not assigned'
                }
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {order.status.replace('_', ' ')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Price</Typography>
              <Typography variant="body1">${order.price}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Review Section */}
      {existingReview ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Your Review</Typography>
            {canEditReview() && (
              <Button
                variant="outlined"
                startIcon={<RateReview />}
                onClick={handleEditReview}
              >
                Edit Review
              </Button>
            )}
          </Box>
          
          <ReviewCard
            review={existingReview}
            currentUserRole={user?.role}
            currentUserId={user?.id}
            showWriter={true}
            showStudent={false}
            showOrder={false}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {canReview() ? (
            <Box>
              <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Share Your Experience
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Help other students by reviewing your experience with this writer
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<RateReview />}
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </Button>
            </Box>
          ) : (
            <Box>
              <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Review Not Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.status === 'completed' 
                  ? "You can only review orders that you placed as a student."
                  : "You can only review completed orders."
                }
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={handleSubmitReview}
        loading={creating || updating}
        error={error}
        existingReview={existingReview}
        orderTitle={order.title}
        writerName={order.writer ? `${order.writer.firstName} ${order.writer.lastName}` : undefined}
      />
    </Container>
  );
}

export default function OrderReviewPageWithAuth({ params }: OrderReviewPageProps) {
  return (
    <PrivateRoute>
      <OrderReviewPage params={params} />
    </PrivateRoute>
  );
}