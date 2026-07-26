'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
} from '@/store/api/reviewApi';

/**
 * Admin moderation queue for student reviews. Reviews start `pending` and only
 * appear on the public reviews page once approved here.
 */
export function ReviewModerationTab() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionError, setActionError] = useState('');

  const { data, isLoading, error, refetch } = useGetReviewsQuery(
    statusFilter === 'all'
      ? {}
      : { status: statusFilter as 'pending' | 'approved' | 'rejected' }
  );
  const [approveReview, { isLoading: approving }] = useApproveReviewMutation();
  const [rejectReview, { isLoading: rejecting }] = useRejectReviewMutation();

  // Unwrap the StandardAPIResponse envelope and optional pagination
  const raw: any = data;
  const payload = raw?.success && raw?.data !== undefined ? raw.data : raw;
  const reviews: any[] = Array.isArray(payload)
    ? payload
    : payload?.results ?? [];

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    setActionError('');
    try {
      if (decision === 'approve') {
        await approveReview(id).unwrap();
      } else {
        await rejectReview(id).unwrap();
      }
      refetch();
    } catch (e: any) {
      setActionError(e?.data?.error || e?.data?.message || `Failed to ${decision} review.`);
    }
  };

  const statusColor = (status: string) =>
    status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Review Moderation</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError('')}>
          {actionError}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load reviews.</Alert>
      ) : reviews.length === 0 ? (
        <Alert severity="info">
          No {statusFilter === 'all' ? '' : `${statusFilter} `}reviews.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={review.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Rating value={review.rating ?? 0} readOnly size="small" />
                      <Chip
                        size="small"
                        label={review.status}
                        color={statusColor(review.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.student
                        ? `${review.student.firstName ?? ''} ${review.student.lastName ?? ''}`.trim() ||
                          review.student.username
                        : 'Unknown student'}
                      {review.createdAt &&
                        ` • ${formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}`}
                      {review.order && (
                        <>
                          {' • '}
                          <Link href={`/orders/${review.order}`}>view order</Link>
                        </>
                      )}
                    </Typography>
                  </Box>
                  {review.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        disabled={approving || rejecting}
                        onClick={() => handleDecision(String(review.id), 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        disabled={approving || rejecting}
                        onClick={() => handleDecision(String(review.id), 'reject')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body1">{review.comment || review.review}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
