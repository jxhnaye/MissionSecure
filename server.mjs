// server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // allow Vite dev site
app.use(express.json({ limit: '1mb' }));

// Optional friendly pages
app.get('/', (req, res) => res.type('text/plain').send('Mission Secure API is running. POST /api/grade'));
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

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

// LAN access (optional): change to '0.0.0.0'
app.listen(3001, () => console.log('API listening on http://localhost:3001'));
