// Test script to verify authentication flow
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAuthFlow() {
  console.log('🧪 Testing authentication flow...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const registerData = {
      email: 'mobile-test@example.com',
      password: 'password12345',  // 12+ chars as required
      password_confirmation: 'password12345',
      first_name: 'Mobile',
      last_name: 'Test',
      user_name: 'mobiletest'
    };

    try {
      await axios.post(`${API_BASE_URL}/sign_up`, registerData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('✅ User registration successful');
    } catch (error) {
      if (error.response?.status === 422) {
        console.log('ℹ️  User already exists, continuing with login test...');
      } else {
        throw error;
      }
    }

    // Test 3: Sign in to get session token
    console.log('\n3. Testing user sign in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/sign_in`, {
      email: registerData.email,
      password: registerData.password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const token = loginResponse.headers['x-session-token'];
    if (!token) {
      throw new Error('No session token received');
    }
    console.log('✅ Sign in successful, token received');

    // Test 4: Get current user data
    console.log('\n4. Testing /me endpoint...');
    const userResponse = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const user = userResponse.data;
    console.log('✅ User data retrieved:', {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      userName: user.user_name
    });

    // Test 5: Sign out
    console.log('\n5. Testing sign out...');
    await axios.delete(`${API_BASE_URL}/sign_out`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Sign out successful');

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAuthFlow();