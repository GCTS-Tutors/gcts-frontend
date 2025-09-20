'use client';

import { Typography, Container, Box, Button, Alert } from '@mui/material';
import { School, Assignment, Support, Api } from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { testAPIConnection } from '@/lib/test-api';
import config from '@/lib/config';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<'testing' | 'connected' | 'disconnected'>('testing');

  useEffect(() => {
    const checkAPI = async () => {
      const isConnected = await testAPIConnection();
      setApiStatus(isConnected ? 'connected' : 'disconnected');
    };
    checkAPI();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* API Status Alert */}
        {config.isDevelopment() && (
          <Alert 
            severity={apiStatus === 'connected' ? 'success' : apiStatus === 'disconnected' ? 'warning' : 'info'}
            icon={<Api />}
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            API Status: {apiStatus === 'testing' ? 'Testing connection...' : 
                       apiStatus === 'connected' ? `Connected to ${config.getApiUrl()}` :
                       `Disconnected from ${config.getApiUrl()} (Backend not running)`}
          </Alert>
        )}

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
          }}
        >
          Welcome to GCTS
        </Typography>
        
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Grand Canyon Tutoring Services - Your trusted partner for academic excellence
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.7,
          }}
        >
          Professional academic tutoring and assignment services to help you achieve your educational goals. 
          Get expert guidance, quality resources, and personalized support.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            gap: 3,
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<School />}
            component={Link}
            href="/papers"
            sx={{ minWidth: 200 }}
          >
            Browse Papers
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<Assignment />}
            component={Link}
            href="/login"
            sx={{ minWidth: 200 }}
          >
            Get Started
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mt: 8,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Expert Tutoring
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get guidance from experienced academic professionals
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quality Resources
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access high-quality academic papers and materials
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Support sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              24/7 Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get help whenever you need it with our support team
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}