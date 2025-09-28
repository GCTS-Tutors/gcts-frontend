'use client';

import {
  Typography,
  Container,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Breadcrumbs,
  Paper,
  Rating
} from '@mui/material';
import {
  FilterList,
  Star,
  Home,
  RateReview
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { APIClient, Review, ReviewsResponse } from '@/lib/api';
import { ReviewCard } from '@/components/ReviewCard';

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<ReviewsResponse>({
    reviews: [],
    total_count: 0,
    source: 'fallback'
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const reviewsPerPage = 12;

  // Extract unique subjects from reviews
  const [subjects, setSubjects] = useState<string[]>(['all']);

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsData = await APIClient.getReviews();
        setReviews(reviewsData);

        // Extract unique subjects
        const uniqueSubjects = ['all', ...Array.from(new Set(
          reviewsData.reviews.map(review => review.subject.toLowerCase())
        ))];
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.warn('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on subject and rating
  const filteredReviews = reviews.reviews.filter(review => {
    const subjectMatch = subjectFilter === 'all' ||
      review.subject.toLowerCase() === subjectFilter;

    const ratingMatch = ratingFilter === 'all' ||
      (ratingFilter === '5' && review.rating === 5) ||
      (ratingFilter === '4' && review.rating >= 4) ||
      (ratingFilter === '3' && review.rating >= 3);

    return subjectMatch && ratingMatch;
  });

  // Paginate filtered reviews
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (page - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </Box>
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <RateReview sx={{ mr: 0.5, fontSize: 20 }} />
          Student Reviews
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          What Our Students Say
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
          Real feedback from students who have achieved academic success with our professional services
        </Typography>

        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Paper
              elevation={1}
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2
              }}
            >
              <RateReview color="primary" />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {filteredReviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews
              </Typography>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2
              }}
            >
              <Star color="primary" />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {getAverageRating()}
              </Typography>
              <Rating
                value={parseFloat(getAverageRating())}
                readOnly
                precision={0.1}
                size="small"
              />
            </Paper>
          </Box>
        )}
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
        >
          <FilterList sx={{ mr: 1 }} />
          Filter Reviews
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectFilter}
                label="Subject"
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setPage(1);
                }}
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                label="Rating"
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
              >
                {ratingOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSubjectFilter('all');
                setRatingFilter('all');
                setPage(1);
              }}
              sx={{
                height: 56, // Match FormControl height
                borderRadius: 1
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {paginatedReviews.length} of {filteredReviews.length} reviews
        </Typography>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Reviews Grid */}
      {!loading && (
        <>
          {paginatedReviews.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {paginatedReviews.map((review) => (
                  <Grid item xs={12} md={6} lg={4} key={review.id}>
                    <ReviewCard review={review} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper elevation={1} sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
              <RateReview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No reviews found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No reviews match your selected filters. Try adjusting your criteria.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSubjectFilter('all');
                  setRatingFilter('all');
                  setPage(1);
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Call to Action */}
      <Box
        sx={{
          mt: 8,
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to Join Our Successful Students?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Experience the same quality and success that these students have achieved
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/order/place"
            sx={{
              backgroundColor: '#FFD700',
              color: '#333',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#FFC700',
              }
            }}
          >
            Place Your Order Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/contact"
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
              }
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
}