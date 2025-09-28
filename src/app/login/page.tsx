'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ValidatedForm, FormField } from '@/components/forms/ValidatedForm';
import { loginSchema } from '@/utils/validation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: Record<string, any>) => {
    // Clear any previous errors
    clearError();

    try {
      await login({ email: values.email, password: values.password });
      // Redirect will happen automatically via useEffect
    } catch (err: any) {
      // Don't re-throw - let AuthContext handle the error display
      // ValidatedForm will still set isSubmitting to false in finally block
      console.error('Login failed:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back to GCTS
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <ValidatedForm
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            submitText="Sign In"
            disabled={isLoading}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <>
                <FormField
                  name="email"
                  label="Email Address"
                  required
                  error={errors.email}
                  touched={touched.email}
                >
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormField>

                <FormField
                  name="password"
                  label="Password"
                  required
                  error={errors.password}
                  touched={touched.password}
                >
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormField>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <MuiLink
                    component={Link}
                    href="/resetpassword"
                    variant="body2"
                    sx={{ mr: 2 }}
                  >
                    Forgot Password?
                  </MuiLink>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <MuiLink component={Link} href="/register">
                      Sign Up
                    </MuiLink>
                  </Typography>
                </Box>
              </>
            )}
          </ValidatedForm>
        </Paper>
      </Box>
    </Container>
  );
}