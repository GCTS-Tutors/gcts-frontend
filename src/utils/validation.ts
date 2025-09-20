import * as yup from 'yup';

// Base validation schemas
export const emailSchema = yup
  .string()
  .email('Invalid email format')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/\d/, 'Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  .required('Password is required');

export const phoneSchema = yup
  .string()
  .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits');

export const nameSchema = yup
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .required('Name is required');

// Authentication forms validation
export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['student', 'writer'], 'Please select a valid role')
    .required('Role is required'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Order forms validation
export const orderPlacementSchema = yup.object({
  title: yup
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .required('Description is required'),
  academicLevel: yup
    .string()
    .oneOf(['high_school', 'undergraduate', 'masters', 'phd'], 'Please select a valid academic level')
    .required('Academic level is required'),
  paperType: yup
    .string()
    .oneOf(['essay', 'research_paper', 'thesis', 'dissertation', 'case_study', 'lab_report'], 'Please select a valid paper type')
    .required('Paper type is required'),
  subject: yup
    .string()
    .min(2, 'Subject must be at least 2 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .required('Subject is required'),
  pages: yup
    .number()
    .min(1, 'Number of pages must be at least 1')
    .max(1000, 'Number of pages must not exceed 1000')
    .required('Number of pages is required'),
  deadline: yup
    .date()
    .min(new Date(Date.now() + 24 * 60 * 60 * 1000), 'Deadline must be at least 24 hours from now')
    .required('Deadline is required'),
  budget: yup
    .number()
    .min(10, 'Budget must be at least $10')
    .max(10000, 'Budget must not exceed $10,000')
    .required('Budget is required'),
  requirements: yup
    .string()
    .max(2000, 'Requirements must not exceed 2000 characters'),
  citations: yup
    .number()
    .min(0, 'Number of citations cannot be negative')
    .max(500, 'Number of citations must not exceed 500'),
  citationStyle: yup
    .string()
    .oneOf(['apa', 'mla', 'chicago', 'harvard', 'other'], 'Please select a valid citation style'),
});

// User profile validation
export const profileUpdateSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: yup
    .string()
    .max(1000, 'Bio must not exceed 1000 characters'),
  timezone: yup.string(),
  language: yup.string(),
  notifications: yup.object({
    email: yup.boolean(),
    sms: yup.boolean(),
    push: yup.boolean(),
  }),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Payment validation
export const paymentSchema = yup.object({
  amount: yup
    .number()
    .min(1, 'Amount must be at least $1')
    .max(10000, 'Amount must not exceed $10,000')
    .required('Amount is required'),
  paymentMethod: yup
    .string()
    .oneOf(['credit_card', 'paypal', 'bank_transfer'], 'Please select a valid payment method')
    .required('Payment method is required'),
  cardNumber: yup
    .string()
    .when('paymentMethod', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Invalid card number format')
        .required('Card number is required'),
      otherwise: (schema) => schema.optional(),
    }),
  expiryDate: yup
    .string()
    .when('paymentMethod', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY)')
        .required('Expiry date is required'),
      otherwise: (schema) => schema.optional(),
    }),
  cvv: yup
    .string()
    .when('paymentMethod', {
      is: 'credit_card',
      then: (schema) => schema
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('CVV is required'),
      otherwise: (schema) => schema.optional(),
    }),
  billingAddress: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup
      .string()
      .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
      .required('ZIP code is required'),
    country: yup.string().required('Country is required'),
  }),
});

// Review validation
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must not exceed 5 stars')
    .required('Rating is required'),
  title: yup
    .string()
    .min(10, 'Review title must be at least 10 characters')
    .max(100, 'Review title must not exceed 100 characters')
    .required('Review title is required'),
  comment: yup
    .string()
    .min(20, 'Review comment must be at least 20 characters')
    .max(2000, 'Review comment must not exceed 2000 characters')
    .required('Review comment is required'),
  wouldRecommend: yup.boolean(),
});

// Message validation
export const messageSchema = yup.object({
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .required('Message is required'),
  priority: yup
    .string()
    .oneOf(['low', 'normal', 'high', 'urgent'], 'Please select a valid priority'),
  isPrivate: yup.boolean(),
});

// Admin forms validation
export const userManagementSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: yup
    .string()
    .oneOf(['student', 'writer', 'admin'], 'Please select a valid role')
    .required('Role is required'),
  isActive: yup.boolean(),
  isVerified: yup.boolean(),
});

export const orderStatusUpdateSchema = yup.object({
  status: yup
    .string()
    .oneOf(['pending', 'in_progress', 'completed', 'cancelled', 'revision'], 'Please select a valid status')
    .required('Status is required'),
  notes: yup
    .string()
    .max(1000, 'Notes must not exceed 1000 characters'),
  notifyCustomer: yup.boolean(),
});

// File upload validation
export const fileUploadSchema = yup.object({
  files: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(),
        size: yup.number().max(50 * 1024 * 1024, 'File size must not exceed 50MB'),
        type: yup.string().required(),
      })
    )
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed'),
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters'),
  isPublic: yup.boolean(),
});

// Search validation
export const searchSchema = yup.object({
  query: yup
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must not exceed 100 characters')
    .required('Search query is required'),
  filters: yup.object({
    dateFrom: yup.date(),
    dateTo: yup.date().min(yup.ref('dateFrom'), 'End date must be after start date'),
    category: yup.string(),
    status: yup.array().of(yup.string()),
  }),
});

// Notification preferences validation
export const notificationPreferencesSchema = yup.object({
  emailNotifications: yup.boolean(),
  pushNotifications: yup.boolean(),
  smsNotifications: yup.boolean(),
  orderUpdates: yup.boolean(),
  paymentNotifications: yup.boolean(),
  marketingEmails: yup.boolean(),
  weeklyDigest: yup.boolean(),
  instantNotifications: yup.boolean(),
});

// Utility functions for validation
export const validateField = async (schema: yup.AnySchema, value: any): Promise<string | null> => {
  try {
    await schema.validate(value);
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

export const validateForm = async (schema: yup.ObjectSchema<any>, values: any): Promise<Record<string, string>> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return { general: 'Validation failed' };
  }
};

export const getFieldError = (errors: Record<string, string>, fieldName: string): string | undefined => {
  return errors[fieldName];
};

export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};