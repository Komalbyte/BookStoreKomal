import fetch from 'node-fetch';

async function testServer() {
  try {
    const response = await fetch('http://localhost:5555');
    const data = await response.text();
    
    console.log('✅ Server is running successfully!');
    console.log('Response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.log('❌ Server test failed:', error.message);
  }
}

testServer();
