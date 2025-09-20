'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Star,
  StarBorder,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    rating: number;
    comment: string;
    isPublic: boolean;
  }) => void;
  loading?: boolean;
  error?: string;
  existingReview?: any;
  orderTitle?: string;
  writerName?: string;
}

export function ReviewForm({
  open,
  onClose,
  onSubmit,
  loading = false,
  error,
  existingReview,
  orderTitle,
  writerName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsPublic(existingReview.isPublic);
    } else {
      setRating(5);
      setComment('');
      setIsPublic(true);
    }
  }, [existingReview, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment: comment.trim(),
      isPublic,
    });
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const getRatingColor = (value: number) => {
    if (value >= 4) return 'success.main';
    if (value >= 3) return 'warning.main';
    return 'error.main';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {existingReview ? 'Edit Review' : 'Write a Review'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Order/Writer Info */}
          {(orderTitle || writerName) && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              {orderTitle && (
                <Typography variant="body2" gutterBottom>
                  <strong>Order:</strong> {orderTitle}
                </Typography>
              )}
              {writerName && (
                <Typography variant="body2">
                  <strong>Writer:</strong> {writerName}
                </Typography>
              )}
            </Box>
          )}

          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 1)}
                size="large"
                icon={<Star fontSize="inherit" />}
                emptyIcon={<StarBorder fontSize="inherit" />}
                sx={{ color: getRatingColor(rating) }}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: getRatingColor(rating),
                  fontWeight: 'medium',
                  minWidth: 80,
                }}
              >
                {getRatingText(rating)}
              </Typography>
            </Box>
          </Box>

          {/* Comment */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your experience with this writer. How was the quality of work, communication, and timeliness?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              inputProps={{ maxLength: 1000 }}
              helperText={`${comment.length}/1000 characters`}
            />
          </Box>

          {/* Privacy Setting */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">
                    Make this review public
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Public reviews help other students choose writers
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !comment.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading 
              ? (existingReview ? 'Updating...' : 'Submitting...') 
              : (existingReview ? 'Update Review' : 'Submit Review')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}