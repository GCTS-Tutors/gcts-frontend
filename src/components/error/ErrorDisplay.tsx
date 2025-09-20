'use client';

import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  IconButton,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  ExpandMore,
  ExpandLess,
  NetworkCheck,
  Security,
  Block,
  BugReport,
} from '@mui/icons-material';

// Error types
export type ErrorType = 
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'server'
  | 'client'
  | 'timeout'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: string;
  timestamp?: string;
  retryable?: boolean;
  actionable?: boolean;
}

// Props interfaces
interface ErrorDisplayProps {
  error: AppError | Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  severity?: 'error' | 'warning' | 'info' | 'success';
}

interface ErrorPageProps {
  error: AppError;
  onRetry?: () => void;
  onGoHome?: () => void;
}

interface ErrorSnackbarProps {
  open: boolean;
  error: string | AppError;
  onClose: () => void;
  autoHideDuration?: number;
}

interface ErrorListProps {
  errors: AppError[];
  onClearError?: (index: number) => void;
  onClearAll?: () => void;
}

// Utility functions
export function parseError(error: unknown): AppError {
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
      timestamp: new Date().toISOString(),
    };
  }

  if (error instanceof Error) {
    return {
      type: 'client',
      message: error.message,
      details: error.stack,
      timestamp: new Date().toISOString(),
    };
  }

  if (error && typeof error === 'object' && 'type' in error) {
    return error as AppError;
  }

  // Handle API errors
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as any;
    return {
      type: getErrorTypeFromStatus(apiError.status),
      message: apiError.data?.message || apiError.message || 'An API error occurred',
      code: apiError.status,
      details: apiError.data?.details,
      timestamp: new Date().toISOString(),
      retryable: isRetryableStatus(apiError.status),
    };
  }

  return {
    type: 'unknown',
    message: 'An unknown error occurred',
    timestamp: new Date().toISOString(),
  };
}

function getErrorTypeFromStatus(status: number): ErrorType {
  switch (true) {
    case status >= 400 && status < 500:
      switch (status) {
        case 401: return 'authentication';
        case 403: return 'authorization';
        case 404: return 'not_found';
        case 408: return 'timeout';
        case 422: return 'validation';
        default: return 'client';
      }
    case status >= 500:
      return 'server';
    default:
      return 'network';
  }
}

function isRetryableStatus(status: number): boolean {
  // Server errors and some client errors are retryable
  return status >= 500 || status === 408 || status === 429;
}

function getErrorIcon(type: ErrorType) {
  switch (type) {
    case 'network': return <NetworkCheck />;
    case 'authentication': return <Security />;
    case 'authorization': return <Block />;
    case 'validation': return <WarningIcon />;
    case 'not_found': return <InfoIcon />;
    case 'server': return <ErrorIcon />;
    case 'timeout': return <InfoIcon />;
    default: return <BugReport />;
  }
}

function getErrorSeverity(type: ErrorType): 'error' | 'warning' | 'info' {
  switch (type) {
    case 'validation':
    case 'timeout':
      return 'warning';
    case 'not_found':
    case 'network':
      return 'info';
    default:
      return 'error';
  }
}

function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case 'network': return 'Network Error';
    case 'authentication': return 'Authentication Required';
    case 'authorization': return 'Access Denied';
    case 'validation': return 'Validation Error';
    case 'not_found': return 'Not Found';
    case 'server': return 'Server Error';
    case 'client': return 'Client Error';
    case 'timeout': return 'Request Timeout';
    default: return 'Error';
  }
}

// Main Error Display Component
export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showDetails = false,
  variant = 'standard',
  severity 
}: ErrorDisplayProps) {
  const [expanded, setExpanded] = React.useState(false);
  const parsedError = parseError(error);
  const errorSeverity = severity || getErrorSeverity(parsedError.type);

  return (
    <Alert 
      severity={errorSeverity}
      variant={variant}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          {parsedError.retryable && onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )}
          {onDismiss && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
      }
    >
      <AlertTitle>{getErrorTitle(parsedError.type)}</AlertTitle>
      <Typography variant="body2">{parsedError.message}</Typography>
      
      {parsedError.code && (
        <Chip 
          label={`Code: ${parsedError.code}`} 
          size="small" 
          variant="outlined" 
          sx={{ mt: 1 }} 
        />
      )}

      {(showDetails && parsedError.details) && (
        <>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ mt: 1 }}
          >
            {expanded ? 'Hide' : 'Show'} Details
          </Button>
          <Collapse in={expanded}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" component="pre" sx={{ 
                fontSize: '0.75rem',
                bgcolor: 'rgba(0,0,0,0.1)',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200,
              }}>
                {parsedError.details}
              </Typography>
            </Box>
          </Collapse>
        </>
      )}
    </Alert>
  );
}

// Full Page Error Component
export function ErrorPage({ error, onRetry, onGoHome }: ErrorPageProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      p: 3 
    }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          {getErrorIcon(error.type)}
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
            {getErrorTitle(error.type)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
          
          {error.code && (
            <Chip 
              label={`Error Code: ${error.code}`} 
              variant="outlined" 
              sx={{ mb: 3 }} 
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {error.retryable && onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
          
          {onGoHome && (
            <Button
              variant="outlined"
              onClick={onGoHome}
            >
              Go Home
            </Button>
          )}
        </Box>
        
        {error.timestamp && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Occurred at: {new Date(error.timestamp).toLocaleString()}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

// Snackbar Error Component
export function ErrorSnackbar({ 
  open, 
  error, 
  onClose, 
  autoHideDuration = 6000 
}: ErrorSnackbarProps) {
  const parsedError = parseError(error);

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={getErrorSeverity(parsedError.type)}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <AlertTitle>{getErrorTitle(parsedError.type)}</AlertTitle>
        {parsedError.message}
      </Alert>
    </Snackbar>
  );
}

// Error List Component
export function ErrorList({ errors, onClearError, onClearAll }: ErrorListProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Errors ({errors.length})
          </Typography>
          {onClearAll && (
            <Button size="small" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </Box>
        
        <List dense>
          {errors.map((error, index) => (
            <ListItem
              key={index}
              secondaryAction={
                onClearError && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onClearError(index)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                )
              }
            >
              <ListItemIcon>
                {getErrorIcon(error.type)}
              </ListItemIcon>
              <ListItemText
                primary={error.message}
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    <Chip 
                      label={getErrorTitle(error.type)}
                      size="small"
                      variant="outlined"
                    />
                    {error.timestamp && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// Hook for managing errors
export function useErrorHandler() {
  const [errors, setErrors] = React.useState<AppError[]>([]);

  const addError = React.useCallback((error: unknown) => {
    const parsedError = parseError(error);
    setErrors(prev => [...prev, parsedError]);
  }, []);

  const removeError = React.useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;
  const latestError = errors[errors.length - 1];

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
    latestError,
  };
}