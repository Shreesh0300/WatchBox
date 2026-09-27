const data = JSON.stringify({ email: "rohitrbastikar24aiml@rnsit.ac.in", password: "test" });
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: data
}).then(res => res.json()).then(console.log).catch(console.error);
