// Environment configuration with fallbacks
interface Config {
  // API Configuration
  API_BASE_URL: string;
  API_VERSION: string;
  
  // Environment
  ENVIRONMENT: string;
  DEBUG: boolean;
  
  // Authentication
  JWT_EXPIRY_MINUTES: number;
  REFRESH_TOKEN_EXPIRY_HOURS: number;
  
  // Feature Flags
  ENABLE_PWA: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  
  // Monitoring and Analytics
  SENTRY_DSN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  MIXPANEL_TOKEN?: string;
  
  // File Upload
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  
  // UI Configuration
  DEFAULT_THEME: string;
  BRAND_NAME: string;
  BRAND_TAGLINE: string;
  
  // Pagination
  DEFAULT_PAGE_SIZE: number;
  MAX_PAGE_SIZE: number;
  
  // Performance
  ENABLE_SERVICE_WORKER: boolean;
  CACHE_TIMEOUT: number;
  
  // Social Links
  SOCIAL_LINKS: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  
  // Contact Information
  CONTACT: {
    email: string;
    phone?: string;
    supportUrl?: string;
  };
  
  // Utility functions
  isDevelopment: () => boolean;
  isProduction: () => boolean;
  isStaging: () => boolean;
  getApiUrl: (endpoint?: string) => string;
  isAllowedFileType: (filename: string) => boolean;
  isValidFileSize: (size: number) => boolean;
}

const config: Config = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'api/v1',
  
  // Environment
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
  
  // Authentication
  JWT_EXPIRY_MINUTES: parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRY_MINUTES || '15'),
  REFRESH_TOKEN_EXPIRY_HOURS: parseInt(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY_HOURS || '8'),
  
  // Feature Flags
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  
  // Monitoring and Analytics
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif',
    '.csv', '.xlsx', '.xls'
  ],
  
  // UI Configuration
  DEFAULT_THEME: process.env.NEXT_PUBLIC_DEFAULT_THEME || 'light',
  BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME || 'GCTS',
  BRAND_TAGLINE: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Grand Canyon Tutoring Services',
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20'),
  MAX_PAGE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '100'),
  
  // Performance
  ENABLE_SERVICE_WORKER: process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true',
  CACHE_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || '300000'), // 5 minutes
  
  // Social Links
  SOCIAL_LINKS: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },
  
  // Contact Information
  CONTACT: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@gcts.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    supportUrl: process.env.NEXT_PUBLIC_SUPPORT_URL,
  },
  
  // Utility functions
  isDevelopment: () => config.ENVIRONMENT === 'development',
  isProduction: () => config.ENVIRONMENT === 'production',
  isStaging: () => config.ENVIRONMENT === 'staging',
  
  // API URLs
  getApiUrl: (endpoint = '') => {
    const baseUrl = `${config.API_BASE_URL}/${config.API_VERSION}`;
    const fullUrl = endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
    console.log('🔗 getApiUrl called:', { endpoint, baseUrl, fullUrl });
    return fullUrl;
  },
  
  // File validation
  isAllowedFileType: (filename: string) => {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return config.ALLOWED_FILE_TYPES.includes(extension);
  },
  
  isValidFileSize: (size: number) => {
    return size <= config.MAX_FILE_SIZE;
  },
};

export default config;