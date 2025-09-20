'use client';

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { APIClient } from '@/lib/api';

export default function TestErrorsPage() {
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testError = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      await testFn();
      setErrors(prev => ({ ...prev, [testName]: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [testName]: error }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testCases = [
    {
      name: 'invalidLogin',
      label: 'Invalid Login Credentials',
      test: () => APIClient.post('/auth/login/', {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      })
    },
    {
      name: 'validationError',
      label: 'Validation Error (Missing Fields)',
      test: () => APIClient.post('/auth/login/', {})
    },
    {
      name: 'notFound',
      label: 'Not Found Error',
      test: () => APIClient.get('/nonexistent-endpoint/')
    },
    {
      name: 'unauthorized',
      label: 'Unauthorized Access',
      test: () => APIClient.get('/dashboard/')
    },
    {
      name: 'networkError',
      label: 'Network Error (Invalid URL)',
      test: () => APIClient.get('http://invalid-domain-that-does-not-exist.com/api/')
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Error Handling Test Page
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This page tests various error scenarios to ensure proper error handling and display.
          </Typography>

          <Stack spacing={4}>
            {testCases.map((testCase) => (
              <Box key={testCase.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6">{testCase.label}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => testError(testCase.name, testCase.test)}
                    disabled={loading[testCase.name]}
                  >
                    {loading[testCase.name] ? 'Testing...' : 'Test Error'}
                  </Button>
                </Box>

                {errors[testCase.name] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Standard Error Display:
                    </Typography>
                    <ErrorDisplay
                      error={errors[testCase.name]}
                      variant="standard"
                      showDetails={true}
                    />
                  </Box>
                )}

                {errors[testCase.name] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Compact Error Display:
                    </Typography>
                    <ErrorDisplay
                      error={errors[testCase.name]}
                      variant="compact"
                    />
                  </Box>
                )}

                {errors[testCase.name] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Detailed Error Display:
                    </Typography>
                    <ErrorDisplay
                      error={errors[testCase.name]}
                      variant="detailed"
                      showRefresh={true}
                      onRefresh={() => testError(testCase.name, testCase.test)}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Raw Error Objects (for debugging):
            </Typography>
            <Box component="pre" sx={{ 
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: 400,
            }}>
              {JSON.stringify(errors, null, 2)}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}