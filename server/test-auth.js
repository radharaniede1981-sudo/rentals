const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testAuth = async () => {
  try {
    console.log('Testing authentication API...\n');

    // Test login with demo credentials
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'password123'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', loginData.token);
      console.log('User:', loginData.user);
      
      // Test getting current user with token
      const meResponse = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        },
      });

      const meData = await meResponse.json();
      
      if (meResponse.ok) {
        console.log('\n✅ Get current user successful!');
        console.log('User data:', meData.user);
      } else {
        console.log('\n❌ Get current user failed:', meData.error);
      }
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAuth();
