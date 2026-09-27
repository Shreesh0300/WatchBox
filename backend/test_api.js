const http = require('http');

const data = JSON.stringify({ email: 'test_chat_' + Date.now() + '@example.com', password: 'pass' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log("Register:", body);
    
    // Login
    const req2 = http.request({ ...options, path: '/api/auth/login' }, (res2) => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => {
        const token = JSON.parse(body2).token;
        console.log("Got token:", !!token);
        
        // Chat
        const chatData = JSON.stringify({ message: 'Hello' });
        const req3 = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/chat',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(chatData),
            'Authorization': 'Bearer ' + token
          }
        }, (res3) => {
          let body3 = '';
          res3.on('data', d => body3 += d);
          res3.on('end', () => {
            console.log("Chat status:", res3.statusCode);
            console.log("Chat body:", body3);
          });
        });
        
        req3.on('error', e => console.error("Chat req error:", e));
        req3.write(chatData);
        req3.end();
      });
    });
    
    req2.write(data);
    req2.end();
  });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
