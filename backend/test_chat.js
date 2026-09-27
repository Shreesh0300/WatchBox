const fetch = require('node-fetch'); // We might not have node-fetch, but Node 18+ has global fetch

async function testChat() {
  try {
    // 1. Register a test user
    const email = 'test_chat_' + Date.now() + '@example.com';
    await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });

    // 2. Login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    console.log("Got token:", !!token);

    // 3. Test Chat endpoint
    const chatRes = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'Recommend a movie' })
    });

    console.log("Chat response status:", chatRes.status);
    
    const text = await chatRes.text();
    console.log("Chat response raw body:", text);

  } catch (err) {
    console.error("Test failed:", err);
  }
}

testChat();
