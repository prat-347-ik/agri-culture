const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const testAPI = async () => {
  console.log('🧪 Testing Agri-Culture Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test config endpoint
    console.log('\n2. Testing config endpoint...');
    const configResponse = await axios.get(`${BASE_URL}/api/config`);
    console.log('✅ Config endpoint working');

    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/marketplace/categories`);
    console.log('✅ Categories endpoint working:', categoriesResponse.data.data.categories.length, 'categories found');

    // Test user registration
    console.log('\n4. Testing user registration...');
    const testUser = {
      email: 'test@example.com',
      password: 'test123',
      fullName: 'Test User',
      phone: '9999999999'
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
      console.log('✅ User registration working');
      
      // Test login
      console.log('\n5. Testing user login...');
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User login working');
      
      const token = loginResponse.data.data.token;
      
      // Test protected endpoint
      console.log('\n6. Testing protected endpoint...');
      const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Protected endpoint working');

    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('✅ User registration working (user already exists)');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All API tests passed! Backend is working correctly.');
    console.log('\n📊 Available endpoints:');
    console.log('- Health: GET /health');
    console.log('- Config: GET /api/config');
    console.log('- Auth: POST /api/auth/register, POST /api/auth/login');
    console.log('- Marketplace: GET /api/marketplace/products, GET /api/marketplace/categories');
    console.log('- Enrollment: POST /api/enroll');
    console.log('- Map: GET /api/map/farms');
    console.log('- Admin: GET /api/admin/dashboard (requires admin token)');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the backend server is running: npm run dev');
  }
};

if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };

