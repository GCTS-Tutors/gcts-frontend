'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Alert,
  Pagination,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  FilterList,
  Clear,
  Star,
  Reviews as ReviewsIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetReviewsQuery } from '@/store/api/reviewApi';
import { ReviewCard } from '@/components/reviews/ReviewCard';

function ReviewsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    rating: '',
    writerId: '',
    isPublic: '',
    page: 1,
    pageSize: 12,
  });

  const queryFilters = {
    ...filters,
    rating: filters.rating ? parseInt(filters.rating) : undefined,
    writerId: filters.writerId ? parseInt(filters.writerId) : undefined,
    isPublic: filters.isPublic ? filters.isPublic === 'true' : undefined,
  };
  
  const { data: reviewsData, isLoading, error, refetch } = useGetReviewsQuery(queryFilters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      rating: '',
      writerId: '',
      isPublic: '',
      page: 1,
      pageSize: 12,
    });
  };

  const reviews = reviewsData?.results || [];
  const totalCount = reviewsData?.count || 0;
  const pageCount = Math.ceil(totalCount / filters.pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Read what students say about our writers
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterList />
          <Typography variant="h6">Filters</Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rating</InputLabel>
              <Select
                value={filters.rating}
                label="Rating"
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
                <MenuItem value="2">2+ Stars</MenuItem>
                <MenuItem value="1">1+ Star</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Writer ID"
              type="number"
              value={filters.writerId}
              onChange={(e) => handleFilterChange('writerId', e.target.value)}
              placeholder="Enter writer ID"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Visibility</InputLabel>
              <Select
                value={filters.isPublic}
                label="Visibility"
                onChange={(e) => handleFilterChange('isPublic', e.target.value)}
              >
                <MenuItem value="">All Reviews</MenuItem>
                <MenuItem value="true">Public Only</MenuItem>
                <MenuItem value="false">Private Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
        
        <Typography variant="body2" color="text.secondary">
          Showing {reviews.length} of {totalCount} reviews
        </Typography>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load reviews. Please try again.
        </Alert>
      )}

      {/* Reviews Grid */}
      {!isLoading && !error && (
        <>
          {reviews.length > 0 ? (
            <Grid container spacing={3}>
              {reviews.map((review: any) => (
                <Grid item xs={12} md={6} key={review.id}>
                  <ReviewCard
                    review={review}
                    currentUserRole={user?.role}
                    currentUserId={user?.id}
                    showWriter={true}
                    showStudent={user?.role === 'admin'}
                    showOrder={true}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <ReviewsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Reviews Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No reviews match your current filters. Try adjusting your search criteria.
              </Typography>
            </Paper>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={filters.page}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default function ReviewsPageWithAuth() {
  return (
    <PrivateRoute>
      <ReviewsPage />
    </PrivateRoute>
  );
}