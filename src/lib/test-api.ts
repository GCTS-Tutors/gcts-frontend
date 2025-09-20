// Simple API test utility
import { APIClient, TokenManager } from './api';
import config from './config';

export const testAPIConnection = async () => {
  console.log('🔧 Testing API Configuration...');
  console.log('API Base URL:', config.getApiUrl());
  console.log('Environment:', config.ENVIRONMENT);
  console.log('Token Manager:', {
    isAuthenticated: TokenManager.isAuthenticated(),
    hasAccessToken: !!TokenManager.getAccessToken(),
    hasRefreshToken: !!TokenManager.getRefreshToken(),
  });

  try {
    // Test basic connectivity (this endpoint should exist on the Django backend)
    const response = await APIClient.get('/health/');
    console.log('✅ API Connection successful:', response);
    return true;
  } catch (error) {
    console.log('❌ API Connection failed:', error);
    console.log('ℹ️ This is expected if the backend server is not running');
    return false;
  }
};

// Mock API responses for development
export const mockAPIResponses = {
  auth: {
    login: {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as const,
        isActive: true,
        dateJoined: new Date().toISOString(),
      }
    }
  },
  orders: [
    {
      id: 1,
      orderNumber: 'ORD-001',
      title: 'Machine Learning Research Paper',
      status: 'in_progress' as const,
      subject: { id: 1, name: 'Computer Science' },
      deadline: '2024-01-25',
      price: 250,
      pages: 10,
    }
  ]
};