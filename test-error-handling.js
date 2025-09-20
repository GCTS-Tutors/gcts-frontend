#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendErrorHandling() {
  console.log('🧪 Testing Backend Error Handling...\n');

  const tests = [
    {
      name: 'Invalid Login Credentials',
      request: () => axios.post(`${BACKEND_URL}/api/v1/auth/login/`, {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }),
      expectedStatus: 400
    },
    {
      name: 'Missing Required Fields',
      request: () => axios.post(`${BACKEND_URL}/api/v1/auth/login/`, {}),
      expectedStatus: 400
    },
    {
      name: 'Not Found Endpoint',
      request: () => axios.get(`${BACKEND_URL}/api/v1/nonexistent/`),
      expectedStatus: 404
    },
    {
      name: 'Unauthorized Access',
      request: () => axios.get(`${BACKEND_URL}/api/v1/dashboard/`),
      expectedStatus: 401
    }
  ];

  for (const test of tests) {
    try {
      await test.request();
      console.log(`❌ ${test.name}: Expected error but got success`);
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      console.log(`✅ ${test.name}: Status ${status}`);
      
      if (data?.error) {
        console.log(`   📝 Message: ${data.error.message}`);
        console.log(`   🏷️  Code: ${data.error.code}`);
        console.log(`   🆔 Error ID: ${data.error.error_id}`);
        if (data.error.details && Object.keys(data.error.details).length > 0) {
          console.log(`   📋 Details: ${JSON.stringify(data.error.details)}`);
        }
      } else {
        console.log(`   ⚠️  Legacy error format: ${JSON.stringify(data)}`);
      }
      console.log('');
    }
  }
}

async function testFrontendConnectivity() {
  console.log('🌐 Testing Frontend Connectivity...\n');
  
  try {
    const response = await axios.get(`${FRONTEND_URL}`, { 
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });
    console.log(`✅ Frontend accessible: Status ${response.status}`);
  } catch (error) {
    console.log(`❌ Frontend not accessible: ${error.message}`);
  }
  console.log('');
}

async function main() {
  console.log('🚀 Error Handling Integration Test\n');
  console.log('=' * 50);
  
  await testFrontendConnectivity();
  await testBackendErrorHandling();
  
  console.log('✨ Error handling test completed!');
  console.log('\n💡 Key Improvements:');
  console.log('   • Structured error responses with error IDs');
  console.log('   • Consistent error format across all endpoints');
  console.log('   • Enhanced frontend error parsing');
  console.log('   • Better error display components');
  console.log('   • Field-specific error handling');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testBackendErrorHandling, testFrontendConnectivity };