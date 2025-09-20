'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import * as yup from 'yup';
import { validateForm, hasErrors } from '@/utils/validation';

interface FormField {
  name: string;
  value: any;
  error?: string;
  touched?: boolean;
}

interface ValidatedFormProps {
  initialValues: Record<string, any>;
  validationSchema: yup.ObjectSchema<any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  children: (props: {
    values: Record<string, any>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    handleChange: (name: string, value: any) => void;
    handleBlur: (name: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setFieldValue: (name: string, value: any) => void;
    setFieldError: (name: string, error: string) => void;
    resetForm: () => void;
  }) => React.ReactNode;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
  submitText?: string;
  showSubmitButton?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ValidatedForm({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnSubmit = false,
  submitText = 'Submit',
  showSubmitButton = true,
  disabled = false,
  className,
}: ValidatedFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<any>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const validateField = useCallback(async (name: string, value: any) => {
    try {
      await validationSchema.validateAt(name, { ...values, [name]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, values]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
    setSubmitSuccess(null);

    if (validateOnChange && touched[name]) {
      validateField(name, value);
    }
  }, [validateOnChange, touched, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    if (validateOnBlur) {
      validateField(name, values[name]);
    }
  }, [validateOnBlur, values, validateField]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [initialValues]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Validate all fields
      const formErrors = await validateForm(validationSchema, values);
      
      if (hasErrors(formErrors)) {
        setErrors(formErrors);
        // Mark all fields as touched to show errors
        const touchedFields: Record<string, boolean> = {};
        Object.keys(formErrors).forEach(key => {
          touchedFields[key] = true;
        });
        setTouched(prev => ({ ...prev, ...touchedFields }));
        return;
      }

      // Submit form
      await onSubmit(values);
      
      if (resetOnSubmit) {
        resetForm();
      }
      
      setSubmitSuccess('Form submitted successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Check if it's an APIError with field-specific errors
      if (error && typeof error === 'object') {
        const apiError = error as any;
        
        // If there's a field error, show it on the specific field
        if (apiError.field && apiError.message) {
          setErrors(prev => ({ ...prev, [apiError.field]: apiError.message }));
          setTouched(prev => ({ ...prev, [apiError.field]: true }));
        } else {
          // Show general error
          setSubmitError(apiError);
        }
        
        // Handle additional field errors from details
        if (apiError.details && typeof apiError.details === 'object') {
          const fieldErrors: Record<string, string> = {};
          Object.entries(apiError.details).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              fieldErrors[key] = value[0];
            } else if (typeof value === 'string') {
              fieldErrors[key] = value;
            }
          });
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
            const touchedFields: Record<string, boolean> = {};
            Object.keys(fieldErrors).forEach(key => {
              touchedFields[key] = true;
            });
            setTouched(prev => ({ ...prev, ...touchedFields }));
          }
        }
      } else if (error instanceof Error) {
        setSubmitError({ message: error.message });
      } else if (typeof error === 'string') {
        setSubmitError({ message: error });
      } else {
        setSubmitError({ message: 'An unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, onSubmit, resetOnSubmit, resetForm]);

  const formProps = {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={className}>
      {submitError && (
        <ErrorDisplay
          error={submitError}
          severity="error"
          variant="standard"
          showDetails={process.env.NODE_ENV === 'development'}
        />
      )}
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {submitSuccess}
        </Alert>
      )}

      {children(formProps)}

      {showSubmitButton && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || isSubmitting || (hasErrors(errors) && Object.keys(touched).length > 0)}
            size="large"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </Button>
        </Box>
      )}
    </Box>
  );
}

// Form field wrapper component
interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactElement;
  helperText?: string;
}

export function FormField({
  name,
  label,
  required,
  error,
  touched,
  children,
  helperText,
}: FormFieldProps) {
  const showError = touched && error;

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Typography>
      )}
      
      {React.cloneElement(children, {
        error: showError,
        helperText: showError ? error : helperText,
        ...children.props,
      })}
    </Box>
  );
}

// Hook for form state management
export function useFormState(initialValues: Record<string, any>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setTouchedField = useCallback((name: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validate = useCallback(async (schema: yup.ObjectSchema<any>) => {
    const formErrors = await validateForm(schema, values);
    setErrors(formErrors);
    return !hasErrors(formErrors);
  }, [values]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched: setTouchedField,
    reset,
    validate,
    hasErrors: hasErrors(errors),
  };
}