import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip
} from '@mui/material';
import { Review } from '@/lib/api';

interface ReviewCardProps {
  review: Review;
  showWebkitClamp?: boolean;
}

export function ReviewCard({ review, showWebkitClamp = false }: ReviewCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        p: 3,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.35)',
          boxShadow: '0 12px 40px rgba(255,193,7,0.3)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={review.rating} readOnly size="small" precision={0.1} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 'bold' }}>
            {review.rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Order Type */}
        <Chip
          label={review.order_type}
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            mb: 2,
            fontWeight: 'medium',
            fontSize: '0.75rem'
          }}
        />

        {/* Review Text */}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            minHeight: '120px',
            fontStyle: 'italic',
            ...(showWebkitClamp && {
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            })
          }}
        >
          "{review.review}"
        </Typography>

        {/* Subject and Date */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
          pt: 2
        }}>
          <Chip
            label={review.subject}
            variant="outlined"
            size="small"
            color="primary"
          />
          <Typography variant="caption" color="text.secondary">
            {review.month_year}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}