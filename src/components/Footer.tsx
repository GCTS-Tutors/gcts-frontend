'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Email,
  Phone,
} from '@mui/icons-material';
import Link from 'next/link';
import { SiteData, Contacts } from '@/lib/siteData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: SiteData.site_colours.accent_colour,
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {/* Contact Information */}
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  {Contacts.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  +{Contacts.telephone1.code} {Contacts.telephone1.number}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Us Form Link */}
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body2" gutterBottom>
              Have questions? We're here to help!
            </Typography>
            <MuiLink
              component={Link}
              href="/contact"
              sx={{
                color: 'white',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              Contact Us
            </MuiLink>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink
                component={Link}
                href="/"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Home
              </MuiLink>
              <MuiLink
                component={Link}
                href="/papers"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Papers
              </MuiLink>
              <MuiLink
                component={Link}
                href="/about"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                About Us
              </MuiLink>
            </Box>
            
            {/* Social Media Links */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <MuiLink href="#" color="inherit">
                <Facebook />
              </MuiLink>
              <MuiLink href="#" color="inherit">
                <Twitter />
              </MuiLink>
              <MuiLink href="#" color="inherit">
                <Instagram />
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Copyright */}
        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Copyright © {SiteData.site_name} {currentYear}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}