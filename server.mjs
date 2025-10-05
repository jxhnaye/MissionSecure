// server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // allow Vite dev site
app.use(express.json({ limit: '1mb' }));

// ====== MongoDB connection ======
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ====== Schema & Model ======
const responseSchema = new mongoose.Schema({
  sessionId: String,
  quizId: String,
  questionId: String,
  optionLabel: String,
  optionTag: String,
  weight: Number,
  createdAt: { type: Date, default: Date.now }
});

const Response = mongoose.model("Response", responseSchema);

// Optional friendly pages
app.get('/', (req, res) => res.type('text/plain').send('Mission Secure API is running. POST /api/grade'));
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ====== POST /responses ======
app.post("/responses", async (req, res) => {
  const { sessionId, quizId, questionId, optionLabel, optionTag, weight } = req.body || {};

  if (!sessionId || !quizId || !questionId || !optionLabel || !optionTag || typeof weight !== "number") {
    return res.status(400).json({ error: "Missing or invalid fields." });
  }

  try {
    await Response.create({ sessionId, quizId, questionId, optionLabel, optionTag, weight });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("❌ Failed to insert response:", err);
    res.status(500).json({ error: "Failed to save response." });
  }
});

// Accept client score (0..100) + notes, optionally refine with OpenAI
app.post('/api/grade', async (req, res) => {
  const { answers = {}, localScore = 0, localNotes = [] } = req.body || {};
  let score = Math.max(0, Math.min(100, Number(localScore) || 0));
  let notes = Array.isArray(localNotes) ? localNotes.slice(0, 8) : [];

  const apiKey = process.env.OPENAI_API_KEY; // put in .env
  if (!apiKey) {
    return res.json({ score, notes });
  }

  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are a concise security analyst. Return JSON only: {"score":0..100,"notes":["..."]}. ' +
          'Keep notes short (max 6), actionable, and non-repetitive. If localScore looks fair, keep it.'
      },
      {
        role: 'user',
        content:
          `Answers: ${JSON.stringify(answers)}\n` +
          `LocalScore: ${score}\n` +
          `LocalNotes: ${notes.join(' | ')}\n` +
          `If you adjust score, explain via notes (brief) and keep within 0..100.`
      }
    ];

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.2, messages })
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    try {
      const ai = JSON.parse(text);
      if (typeof ai.score === 'number') score = Math.max(0, Math.min(100, Math.round(ai.score)));
      if (Array.isArray(ai.notes)) notes = ai.notes.slice(0, 6);
    } catch {
      // invalid JSON from model; keep local
    }
  } catch (e) {
    console.error('AI grading failed:', e);
  }

  res.json({ score, notes });
});


// ====== GET /stats ======
app.get("/stats", async (req, res) => {
  const quizId = req.query.quizId;
  if (!quizId) return res.status(400).json({ error: "quizId is required" });

  try {
    const rows = await Response.aggregate([
      { $match: { quizId } },
      {
        $group: {
          _id: { questionId: "$questionId", optionLabel: "$optionLabel", optionTag: "$optionTag" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.questionId",
          options: {
            $push: {
              optionLabel: "$_id.optionLabel",
              optionTag: "$_id.optionTag",
              count: "$count"
            }
          },
          total: { $sum: "$count" }
        }
      },
      { $project: { _id: 0, questionId: "$_id", total: 1, options: 1 } }
    ]);

    const questions = {};
    for (const r of rows) {
      questions[r.questionId] = {
        total: r.total,
        options: r.options.map(o => ({
          ...o,
          pct: r.total ? +(100 * o.count / r.total).toFixed(2) : 0
        }))
      };
    }

    res.json({ quizId, questions });
  } catch (err) {
    console.error("❌ Failed to aggregate stats:", err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

  // Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route for Contact Us form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// LAN access (optional): change to '0.0.0.0'
app.listen(3001, () => console.log('API listening on http://localhost:3001'));
