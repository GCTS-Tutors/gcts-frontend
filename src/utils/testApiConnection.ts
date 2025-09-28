/**
 * Utility to test API connection and endpoint resolution
 */

import config from '@/lib/config';

export async function testApiConnection() {
  console.log('🔍 Testing API Configuration');
  console.log('API_BASE_URL:', config.API_BASE_URL);
  console.log('API_VERSION:', config.API_VERSION);

  const baseUrl = config.getApiUrl();
  console.log('Generated Base URL:', baseUrl);

  const authEndpoint = config.getApiUrl('auth/login/');
  console.log('Auth Login Endpoint:', authEndpoint);

  const dashboardEndpoint = config.getApiUrl('dashboard/');
  console.log('Dashboard Endpoint:', dashboardEndpoint);

  // Test if we can reach the backend
  try {
    const healthEndpoint = config.getApiUrl('health/');
    console.log('Testing health endpoint:', healthEndpoint);

    const response = await fetch(healthEndpoint);
    console.log('Health check response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is reachable:', data);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error);
    return false;
  }
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    testApiConnection();
  }, 1000);
}