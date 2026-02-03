/**
 * Script untuk test login API
 * Gunakan untuk debug masalah autentikasi
 */

const axios = require('axios');

// Konfigurasi
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'admin123';

async function testLogin() {
  console.log('Testing login...');
  console.log('API URL:', API_URL);
  console.log('Username:', USERNAME);
  console.log('Password:', PASSWORD ? '***' : 'NOT SET');
  console.log('---');

  try {
    // Test 1: Login
    console.log('1. Testing POST /auth/login');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: USERNAME,
      password: PASSWORD
    });

    console.log('✓ Login successful');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.user);
    console.log('---');

    // Test 2: Get Profile
    console.log('2. Testing GET /auth/profile');
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('✓ Profile retrieved');
    console.log('User:', profileResponse.data.user);
    console.log('---');

    console.log('✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

testLogin();
