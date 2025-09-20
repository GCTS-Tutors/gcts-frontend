'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ErrorSnackbar, AppError, parseError } from '@/components/error/ErrorDisplay';

interface ErrorContextType {
  errors: AppError[];
  showError: (error: unknown) => void;
  clearError: (index: number) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  const showError = useCallback((error: unknown) => {
    const parsedError = parseError(error);
    setErrors(prev => [...prev, parsedError]);
    setCurrentError(parsedError);
  }, []);

  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setCurrentError(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setCurrentError(null);
  }, []);

  const value: ErrorContextType = {
    errors,
    showError,
    clearError,
    clearAllErrors,
    hasErrors: errors.length > 0,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorSnackbar
        open={!!currentError}
        error={currentError || ''}
        onClose={handleSnackbarClose}
      />
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}