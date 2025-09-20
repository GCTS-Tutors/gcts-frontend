'use client';

import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { APIError } from '@/lib/api';

interface ErrorDisplayProps {
  error: APIError | Error | string | null;
  title?: string;
  showDetails?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  variant?: 'standard' | 'compact' | 'detailed';
  severity?: 'error' | 'warning' | 'info';
}

export function ErrorDisplay({
  error,
  title,
  showDetails = false,
  showRefresh = false,
  onRefresh,
  variant = 'standard',
  severity = 'error',
}: ErrorDisplayProps) {
  if (!error) return null;

  // Normalize error to APIError format
  const normalizedError: APIError = React.useMemo(() => {
    if (typeof error === 'string') {
      return { message: error };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return error;
  }, [error]);

  const getSeverityIcon = () => {
    switch (severity) {
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  const copyErrorDetails = async () => {
    const errorText = JSON.stringify(
      {
        message: normalizedError.message,
        code: normalizedError.code,
        status: normalizedError.status,
        error_id: normalizedError.error_id,
        timestamp: normalizedError.timestamp,
        field: normalizedError.field,
        details: normalizedError.details,
      },
      null,
      2
    );
    
    try {
      await navigator.clipboard.writeText(errorText);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  const getErrorCodeSeverity = (code?: string): 'error' | 'warning' | 'info' => {
    if (!code) return severity;
    
    if (code.includes('VALIDATION') || code.includes('RATE_LIMIT')) {
      return 'warning';
    }
    if (code.includes('NOT_FOUND') || code.includes('PERMISSION')) {
      return 'info';
    }
    return 'error';
  };

  if (variant === 'compact') {
    return (
      <Alert severity={severity} sx={{ mb: 1 }}>
        {normalizedError.message}
        {normalizedError.code && (
          <Chip 
            label={normalizedError.code} 
            size="small" 
            variant="outlined" 
            sx={{ ml: 1 }} 
          />
        )}
      </Alert>
    );
  }

  return (
    <Alert
      severity={severity}
      icon={getSeverityIcon()}
      sx={{ mb: 2 }}
      action={
        <Stack direction="row" spacing={1}>
          {showDetails && normalizedError.error_id && (
            <Button
              size="small"
              onClick={copyErrorDetails}
              startIcon={<ContentCopyIcon />}
            >
              Copy Details
            </Button>
          )}
          {showRefresh && (
            <Button
              size="small"
              onClick={onRefresh}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )}
        </Stack>
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {normalizedError.message}
        </Typography>

        {normalizedError.field && (
          <Typography variant="caption" color="text.secondary">
            Field: <strong>{normalizedError.field}</strong>
          </Typography>
        )}

        {(normalizedError.code || normalizedError.status) && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {normalizedError.code && (
              <Chip
                label={normalizedError.code}
                size="small"
                color={getErrorCodeSeverity(normalizedError.code)}
                variant="outlined"
              />
            )}
            {normalizedError.status && (
              <Chip
                label={`HTTP ${normalizedError.status}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Detailed error information */}
        {(showDetails || variant === 'detailed') && 
         (normalizedError.error_id || normalizedError.timestamp || normalizedError.details) && (
          <Accordion sx={{ mt: 2 }} elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { margin: 0 } }}
            >
              <Typography variant="caption" color="text.secondary">
                Technical Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Box component="pre" sx={{ 
                fontSize: '0.75rem',
                backgroundColor: 'grey.50',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200,
              }}>
                {JSON.stringify(
                  {
                    error_id: normalizedError.error_id,
                    timestamp: normalizedError.timestamp,
                    code: normalizedError.code,
                    status: normalizedError.status,
                    field: normalizedError.field,
                    details: normalizedError.details,
                  },
                  null,
                  2
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Alert>
  );
}

// Hook for handling common error patterns
export function useErrorHandler() {
  const formatError = React.useCallback((error: any): APIError => {
    if (typeof error === 'string') {
      return { message: error };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    if (error && typeof error === 'object') {
      return error as APIError;
    }
    return { message: 'An unexpected error occurred' };
  }, []);

  const getErrorSeverity = React.useCallback((error: APIError): 'error' | 'warning' | 'info' => {
    const status = error.status;
    const code = error.code;

    // Client errors are usually warnings
    if (status && status >= 400 && status < 500) {
      if (status === 401 || status === 403) return 'warning';
      if (status === 404) return 'info';
      if (status === 429) return 'warning';
      return 'warning';
    }

    // Server errors are errors
    if (status && status >= 500) {
      return 'error';
    }

    // Code-based severity
    if (code) {
      if (code.includes('VALIDATION') || code.includes('RATE_LIMIT')) {
        return 'warning';
      }
      if (code.includes('NOT_FOUND') || code.includes('PERMISSION')) {
        return 'info';
      }
    }

    return 'error';
  }, []);

  return {
    formatError,
    getErrorSeverity,
  };
}

export default ErrorDisplay;