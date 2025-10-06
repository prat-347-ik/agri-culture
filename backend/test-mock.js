const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const testMockAPI = async () => {
  console.log('🧪 Testing Agri-Culture Backend in MOCK MODE...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('   Database mode:', healthResponse.data.database);

    // Test config endpoint
    console.log('\n2. Testing config endpoint...');
    const configResponse = await axios.get(`${BASE_URL}/api/config`);
    console.log('✅ Config endpoint working');

    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/marketplace/categories`);
    console.log('✅ Categories endpoint working:', categoriesResponse.data.data.categories.length, 'categories found');

    // Test products endpoint
    console.log('\n4. Testing products endpoint...');
    const productsResponse = await axios.get(`${BASE_URL}/api/marketplace/products`);
    console.log('✅ Products endpoint working:', productsResponse.data.data.products.length, 'products found');

    // Test farms endpoint
    console.log('\n5. Testing farms endpoint...');
    const farmsResponse = await axios.get(`${BASE_URL}/api/map/farms`);
    console.log('✅ Farms endpoint working:', farmsResponse.data.data.farms.length, 'farms found');

    // Test user registration
    console.log('\n6. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: 'test@example.com',
      password: 'test123',
      fullName: 'Test User',
      phone: '9999999999'
    });
    console.log('✅ User registration working (mock mode)');
    
    // Test login
    console.log('\n7. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ User login working (mock mode)');

    // Test enrollment
    console.log('\n8. Testing enrollment endpoint...');
    const enrollmentResponse = await axios.post(`${BASE_URL}/api/enroll`, {
      type: 'bidding',
      data: {
        title: 'Test Service',
        description: 'Test description',
        category: 'farming_tools'
      }
    });
    console.log('✅ Enrollment endpoint working (mock mode)');

    // Test admin dashboard
    console.log('\n9. Testing admin dashboard...');
    const adminResponse = await axios.get(`${BASE_URL}/api/admin/dashboard`);
    console.log('✅ Admin dashboard working (mock mode)');

    console.log('\n🎉 All mock API tests passed! Backend is working correctly.');
    console.log('\n📊 Available mock endpoints:');
    console.log('- Health: GET /health');
    console.log('- Config: GET /api/config');
    console.log('- Categories: GET /api/marketplace/categories');
    console.log('- Products: GET /api/marketplace/products');
    console.log('- Farms: GET /api/map/farms');
    console.log('- Auth: POST /api/auth/register, POST /api/auth/login');
    console.log('- Enrollment: POST /api/enroll');
    console.log('- Admin: GET /api/admin/dashboard');
    console.log('\n💡 All data is mock data - no database required!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the backend server is running: npm run mock');
  }
};

if (require.main === module) {
  testMockAPI();
}

module.exports = { testMockAPI };
