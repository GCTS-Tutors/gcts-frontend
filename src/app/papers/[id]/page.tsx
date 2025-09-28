'use client';

import {
  Typography,
  Container,
  Box,
  Chip,
  Button,
  Breadcrumbs,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Home,
  Description,
  ArrowBack,
  CalendarToday,
  Person,
  Schedule,
  School,
  Download,
  Share
} from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { papersApi, DetailedPaper } from '@/services/papersApi';
import PaperDetailsSkeleton from '@/components/PaperDetailsSkeleton';

export default function PaperDetailsPage() {
  const params = useParams();
  const [paper, setPaper] = useState<DetailedPaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      if (params.id) {
        try {
          const paperData = await papersApi.getPaperBySlug(params.id as string);
          setPaper(paperData);
        } catch (error) {
          console.error('Failed to fetch paper:', error);
          setPaper(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPaper();
  }, [params.id]);

  if (loading) {
    return <PaperDetailsSkeleton />;
  }

  if (!paper) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
          <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Paper Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The requested paper could not be found. It may have been moved or removed.
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            href="/papers"
            startIcon={<ArrowBack />}
          >
            Back to Papers
          </Button>
        </Paper>
      </Container>
    );
  }

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
        <Link href="/papers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 0.5, fontSize: 20 }} />
            Sample Papers
          </Box>
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          {paper.title}
        </Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        component={Link}
        href="/papers"
        startIcon={<ArrowBack />}
        sx={{ mb: 4 }}
        variant="outlined"
      >
        Back to Papers
      </Button>

      {/* Paper Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {paper.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            {paper.date && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(paper.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {paper.pages} pages
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {paper.level}
              </Typography>
            </Box>
          </Box>

          {/* Chips for subject and type */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={paper.subject}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'medium'
              }}
            />
            <Chip
              label={paper.type}
              variant="outlined"
              color="primary"
            />
          </Box>

          {/* Keywords */}
          {paper.keywords && paper.keywords.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Keywords:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {paper.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
            >
              Share Paper
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="/order/place"
              sx={{
                borderColor: '#FFD700',
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderColor: '#FFC700',
                }
              }}
            >
              Order Similar Paper
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Paper Content */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Paper Content
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{
          '& h1': {
            fontSize: '2rem',
            fontWeight: 'bold',
            mt: 4,
            mb: 2,
            color: 'primary.main'
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            mt: 3,
            mb: 2,
            color: 'text.primary'
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            mt: 2,
            mb: 1,
            color: 'text.primary'
          },
          '& h4': {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            mt: 2,
            mb: 1,
            color: 'text.primary'
          },
          '& p': {
            lineHeight: 1.8,
            mb: 2,
            color: 'text.primary'
          },
          '& ul, & ol': {
            pl: 3,
            mb: 2
          },
          '& li': {
            mb: 1,
            lineHeight: 1.6
          },
          '& strong': {
            fontWeight: 'bold',
            color: 'primary.main'
          },
          '& code': {
            backgroundColor: 'grey.100',
            padding: '2px 6px',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            ml: 0,
            fontStyle: 'italic',
            color: 'text.secondary'
          }
        }}>
          <ReactMarkdown>{paper.content}</ReactMarkdown>
        </Box>
      </Paper>

      {/* Call to Action */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Need a Similar Paper?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Get the same quality and expertise for your specific academic requirements
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
            Order Your Paper Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/papers"
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
            Browse More Papers
          </Button>
        </Box>
      </Box>
    </Container>
  );
}