const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// App setup
const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/logs-db'; // Change if needed

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define a log schema & model
const logSchema = new mongoose.Schema({
  level: String,
  messages: [mongoose.Schema.Types.Mixed],
  timestamp: String,
  url: String
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

// POST /api/logs endpoint
app.post('/api-server/logs', async (req, res) => {
  const { logs } = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Logs must be an array' });

  try {
    await Log.insertMany(logs);
    res.status(201).json({ message: 'Logs saved successfully' });
  } catch (error) {
    console.error('Error saving logs:', error);
    res.status(500).json({ error: 'Failed to save logs' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
