require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Media = require('./models/Media');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Media Routes
app.get('/api/media', authenticateToken, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id });
    res.json(media.map(m => ({
      id: m._id.toString(),
      title: m.title,
      value: m.value,
      status: m.status,
      type: m.type,
      rating: m.rating
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/media', authenticateToken, async (req, res) => {
  try {
    const newMedia = new Media({ ...req.body, user: req.user.id });
    const saved = await newMedia.save();
    res.json({
      id: saved._id.toString(),
      title: saved.title,
      value: saved.value,
      status: saved.status,
      type: saved.type,
      rating: saved.rating
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/media/:id', authenticateToken, async (req, res) => {
  try {
    const media = await Media.findOne({ _id: req.params.id, user: req.user.id });
    if (!media) return res.status(404).json({ error: 'Not found' });
    
    const updated = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      id: updated._id.toString(),
      title: updated.title,
      value: updated.value,
      status: updated.status,
      type: updated.type,
      rating: updated.rating
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/media/:id', authenticateToken, async (req, res) => {
  try {
    const media = await Media.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!media) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Chat Routes
const { GoogleGenAI } = require('@google/genai');

app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Fetch user's watchlist to provide context to the AI
    const media = await Media.find({ user: req.user.id });
    const watchlistContext = media.map(m => `${m.title} (${m.type}, status: ${m.status}, rating: ${m.rating || 'N/A'})`).join('\n');
    
    const prompt = `
You are a helpful assistant for a movie and TV show tracking app called WatchBox.
The user is asking: "${message}"

Here is the user's current watchlist context:
${watchlistContext}

Provide a helpful, friendly, and concise response. If they ask for recommendations, suggest something based on their highly rated completed items, or suggest similar media.
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
