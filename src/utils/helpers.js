/* ========================================
   UTILITY FUNCTIONS & HELPERS
   
   General-purpose utility functions for the cybersecurity assessment app.
   Extracted from App.jsx for better code organization.
======================================== */

import { v4 as uuidv4 } from "uuid";

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * @param {Array} arr - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Map percentage score to HSL hue value (0-120, red to green)
 * @param {number} p - Percentage (0-100)
 * @returns {number} - Hue value (0-120)
 */
export const pctToHue = (p) => Math.round((Math.max(0, Math.min(100, p)) / 100) * 120);

/**
 * Backend call for AI grading (uses server.mjs which reads OPENAI_API_KEY from .env)
 * @param {Object} answers - User's quiz answers
 * @param {number} percent - Local calculated score
 * @param {Array} localNotes - Local generated notes
 * @returns {Promise<Object>} - AI grading result
 */
export async function gradeWithAI(answers, percent, localNotes) {
  try {
    const res = await fetch("http://localhost:3001/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, localScore: percent, localNotes })
    });
    return await res.json();
  } catch {
    return { score: percent, notes: localNotes };
  }
}

/**
 * Generate or retrieve session ID for anonymous user tracking
 * @returns {string} - Unique session identifier
 */
export function getSessionId() {
  const key = "ms_session_id";
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem(key, sid);
  }
  return sid;
}

/**
 * Quiz version identifier
 */
export const QUIZ_ID = "mission-secure-v1";