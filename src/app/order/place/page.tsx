'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { OrderDetailsStep } from '@/components/orders/OrderDetailsStep';
import { RequirementsStep } from '@/components/orders/RequirementsStep';
import { FilesStep } from '@/components/orders/FilesStep';
import { PaymentStep } from '@/components/orders/PaymentStep';
import { ReviewStep } from '@/components/orders/ReviewStep';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import type { CreateOrderRequest } from '@/types/api';

const steps = [
  'Order Details',
  'Requirements',
  'Files',
  'Payment',
  'Review',
];

export interface OrderFormData {
  // Order Details
  title: string;
  subject: string; // Will be converted to subject ID
  type: string; // Will be converted to OrderType enum
  academicLevel: string; // Will be converted to AcademicLevel enum
  pages: number;
  deadline: string;
  urgency: 'standard' | 'urgent' | 'very_urgent';
  
  // Requirements
  description: string;
  instructions: string;
  citation: string; // Will be converted to CitationStyle enum
  sources: number;
  
  // Files
  files: File[];
  
  // Payment
  budget: number;
  paymentMethod: string;
}

const initialFormData: OrderFormData = {
  title: '',
  subject: '',
  type: '',
  academicLevel: '',
  pages: 1,
  deadline: '',
  urgency: 'standard',
  description: '',
  instructions: '',
  citation: '',
  sources: 0,
  files: [],
  budget: 0,
  paymentMethod: '',
};

function PlaceOrderPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();
  const { user } = useAuth();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const updateFormData = (stepData: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(stepData);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Order Details
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.type) newErrors.type = 'Order type is required';
        if (!formData.academicLevel) newErrors.academicLevel = 'Academic level is required';
        if (formData.pages < 1) newErrors.pages = 'Pages must be at least 1';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        break;
      
      case 1: // Requirements
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.instructions) newErrors.instructions = 'Instructions are required';
        if (!formData.citation) newErrors.citation = 'Citation style is required';
        break;
      
      case 2: // Files (optional)
        // Files are optional, no validation needed
        break;
      
      case 3: // Payment
        if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
        break;
      
      case 4: // Review (final validation)
        // Validate all required fields
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.type) newErrors.type = 'Order type is required';
        if (!formData.academicLevel) newErrors.academicLevel = 'Academic level is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.instructions) newErrors.instructions = 'Instructions are required';
        if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    try {
      // Helper function to map UI values to API enum values
      const mapOrderType = (type: string): any => {
        const mapping: Record<string, string> = {
          'Essay': 'essay',
          'Research Paper': 'research paper',
          'Term Paper': 'research paper',
          'Thesis': 'thesis',
          'Dissertation': 'dissertation',
          'Assignment': 'assignment',
          'Case Study': 'other',
          'Lab Report': 'other',
          'Book Report': 'other',
          'Homework': 'assignment',
          'Project': 'other',
          'Presentation': 'other',
          'Other': 'other',
        };
        return mapping[type] || 'other';
      };

      const mapAcademicLevel = (level: string): any => {
        const mapping: Record<string, string> = {
          'High School': 'college',
          'Undergraduate': 'bachelors',
          'Graduate': 'masters',
          'PhD': 'doctorate',
          'Masters': 'masters',
          'Professional': 'masters',
        };
        return mapping[level] || 'bachelors';
      };

      const mapCitationStyle = (style: string): any => {
        const mapping: Record<string, string> = {
          'APA': 'apa7',
          'MLA': 'mla',
          'Chicago': 'chicago',
          'Harvard': 'harvard',
          'IEEE': 'ieee',
          'Vancouver': 'other',
          'AMA': 'other',
          'ASA': 'other',
          'APSA': 'other',
          'Turabian': 'chicago',
          'Other': 'other',
          'Not Required': 'other',
        };
        return mapping[style] || 'other';
      };

      // Map subject name to ID (simplified mapping - in real app, this would come from an API)
      const subjectMapping: Record<string, number> = {
        'Mathematics': 1,
        'English': 2,
        'History': 3,
        'Science': 4,
        'Computer Science': 5,
        'Business': 6,
        'Economics': 7,
        'Psychology': 8,
        'Sociology': 9,
        'Philosophy': 10,
        'Literature': 11,
        'Biology': 12,
        'Chemistry': 13,
        'Physics': 14,
        'Engineering': 15,
        'Medicine': 16,
        'Law': 17,
        'Education': 18,
        'Art': 19,
        'Music': 20,
        'Other': 21,
      };

      // Convert form data to API format (using backend field names)
      const orderRequest: CreateOrderRequest = {
        title: formData.title,
        subject: formData.subject.toLowerCase(), // Use the backend choice value directly
        type: mapOrderType(formData.type),
        level: mapAcademicLevel(formData.academicLevel),
        min_pages: formData.pages,
        max_pages: formData.pages,
        deadline: formData.deadline,
        instructions: formData.description + '\n\n' + formData.instructions, // Combine description and instructions
        style: mapCitationStyle(formData.citation),
        sources: formData.sources || 0,
        urgency: formData.urgency === 'very_urgent' ? 'high' : formData.urgency === 'urgent' ? 'medium' : 'low',
        language: 'english US',
        // Note: files will be handled separately as the backend expects multipart upload
      };

      const result = await createOrder(orderRequest).unwrap();
      
      // TODO: Handle file uploads separately if files exist
      if (formData.files.length > 0) {
        // Will implement file upload in next step
      }

      // Redirect to order details page
      router.push(`/orders/${result.id}`);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <OrderDetailsStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      case 1:
        return (
          <RequirementsStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <FilesStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <PaymentStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Place New Order
      </Typography>
      
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Follow the steps below to place your academic order
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to create order. Please try again.
          </Alert>
        )}

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Creating Order...' : 'Place Order'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default function PlaceOrderPageWithAuth() {
  return (
    <PrivateRoute roles={['student']}>
      <PlaceOrderPage />
    </PrivateRoute>
  );
}