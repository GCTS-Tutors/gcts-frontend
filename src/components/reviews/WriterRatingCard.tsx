'use client';

import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Star,
  Person,
  Reviews,
} from '@mui/icons-material';

interface WriterRatingCardProps {
  writer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  ratingStats: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: { [key: number]: number };
  };
  showAvatar?: boolean;
  compact?: boolean;
}

export function WriterRatingCard({ 
  writer, 
  ratingStats, 
  showAvatar = true,
  compact = false 
}: WriterRatingCardProps) {
  const { averageRating, totalReviews, ratingBreakdown } = ratingStats;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success.main';
    if (rating >= 3.5) return 'warning.main';
    return 'error.main';
  };

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showAvatar && (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.main' }}>
            <Person sx={{ fontSize: 18 }} />
          </Avatar>
        )}
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {writer.firstName} {writer.lastName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={averageRating} readOnly size="small" precision={0.1} />
            <Typography variant="caption" color="text.secondary">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {showAvatar && (
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'info.main' }}>
              <Person />
            </Avatar>
          )}
          <Box>
            <Typography variant="h6">
              {writer.firstName} {writer.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {writer.email}
            </Typography>
          </Box>
        </Box>

        {/* Overall Rating */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ color: getRatingColor(averageRating), mb: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Rating 
            value={averageRating} 
            readOnly 
            precision={0.1}
            size="large"
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
            <Reviews fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {totalReviews} reviews
            </Typography>
          </Box>
        </Box>

        {/* Rating Breakdown */}
        {totalReviews > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Rating Breakdown
            </Typography>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating] || 0;
              const percentage = getPercentage(count);
              
              return (
                <Box 
                  key={rating} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 1 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {rating}
                    </Typography>
                    <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{ 
                      flexGrow: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getRatingColor(rating),
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Rating Quality Indicator */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {averageRating >= 4.5 && (
            <Chip 
              label="Excellent Writer" 
              color="success" 
              icon={<Star />}
              variant="outlined"
            />
          )}
          {averageRating >= 3.5 && averageRating < 4.5 && (
            <Chip 
              label="Good Writer" 
              color="warning" 
              icon={<Star />}
              variant="outlined"
            />
          )}
          {averageRating < 3.5 && totalReviews > 0 && (
            <Chip 
              label="Needs Improvement" 
              color="error" 
              icon={<Star />}
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}