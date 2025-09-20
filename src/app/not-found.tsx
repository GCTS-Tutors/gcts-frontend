'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Home,
  Search,
  Assignment,
  Dashboard,
  Login,
  School,
  ArrowBack,
  Help,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const quickLinks = [
    {
      title: 'Home',
      description: 'Return to the homepage',
      icon: <Home />,
      href: '/',
      color: 'primary' as const,
    },
    {
      title: 'Browse Orders',
      description: 'View available writing assignments',
      icon: <Assignment />,
      href: '/orders',
      color: 'secondary' as const,
    },
    {
      title: 'Subjects',
      description: 'Explore academic subjects',
      icon: <School />,
      href: '/subjects',
      color: 'info' as const,
    },
  ];

  // Add authenticated user links
  if (isAuthenticated && user) {
    quickLinks.push({
      title: 'Dashboard',
      description: 'Go to your dashboard',
      icon: <Dashboard />,
      href: `/dashboard/${user.role}`,
      color: 'primary' as const,
    });
  } else {
    quickLinks.push({
      title: 'Sign In',
      description: 'Access your account',
      icon: <Login />,
      href: '/login',
      color: 'secondary' as const,
    });
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            maxWidth: 800,
            width: '100%',
          }}
        >
          {/* 404 Error Display */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '6rem', md: '8rem' },
                fontWeight: 'bold',
                color: 'primary.main',
                lineHeight: 1,
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              404
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Oops! The page you're looking for doesn't exist.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              It might have been moved, deleted, or you entered the wrong URL.
              Don't worry, we'll help you find what you're looking for!
            </Typography>

            {/* Status Chip */}
            <Chip
              label="Error 404"
              color="error"
              variant="outlined"
              size="small"
              sx={{ mb: 4 }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mb: 6, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{ minWidth: 150 }}
            >
              Go Back
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/"
              startIcon={<Home />}
              sx={{ minWidth: 150 }}
            >
              Home Page
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/search"
              startIcon={<Search />}
              sx={{ minWidth: 150 }}
            >
              Search
            </Button>
          </Box>

          {/* Quick Links Grid */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Quick Links
            </Typography>
            <Grid container spacing={3}>
              {quickLinks.map((link, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    component={Link}
                    href={link.href}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box
                        sx={{
                          color: `${link.color}.main`,
                          mb: 2,
                          '& .MuiSvgIcon-root': {
                            fontSize: '2rem',
                          },
                        }}
                      >
                        {link.icon}
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Help Section */}
          <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <Help sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
              Still need help? Contact our support team
            </Typography>
            <Button
              variant="text"
              size="small"
              component={Link}
              href="/contact"
              sx={{ textTransform: 'none' }}
            >
              Get Support
            </Button>
          </Box>
        </Paper>

        {/* Additional Context */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please report it to our technical team.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}