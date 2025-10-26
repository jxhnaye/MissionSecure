/* ========================================
   CYBERSECURITY SCORING ENGINE
   
   Pure functions for assessment scoring and recommendation generation.
   Extracted from App.jsx for better code organization.
======================================== */

/**
 * Calculate comprehensive cybersecurity score with category weighting and maturity bonuses
 * @param {Object} answers - User's quiz answers object
 * @param {Array} questions - Array of question objects (BASE_QUESTIONS or shuffled variant)
 * @returns {Object} - { percent, notes, categoryScores, maturityBonus }
 */
export function localScoreAndNotes(answers, questions) {
  // Enhanced scoring with category weights and maturity bonuses
  const categoryWeights = {
    foundation: 1.2, // Authentication, backup, training
    advanced: 1.0,   // Device, physical, compliance  
    culture: 0.8     // Feeling, awareness
  };
  
  const categoryScores = {
    foundation: [],
    advanced: [],
    culture: []
  };
  
  // Categorize questions for weighted scoring
  questions.forEach((item) => {
    const picked = answers[item.id];
    if (!picked) return;
    
    if (['q1', 'q3', 'q8'].includes(item.id)) {
      categoryScores.foundation.push(picked.weight);
    } else if (['q6', 'q7', 'q9'].includes(item.id)) {
      categoryScores.advanced.push(picked.weight);
    } else {
      categoryScores.culture.push(picked.weight);
    }
  });
  
  // Calculate weighted category averages
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(categoryScores).forEach(([category, scores]) => {
    if (scores.length > 0) {
      const categoryAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const weight = categoryWeights[category];
      totalScore += categoryAvg * weight * scores.length;
      totalWeight += weight * scores.length;
    }
  });
  
  let percent = Math.round((totalScore / totalWeight) * 100);
  
  // Maturity bonus: Extra points for comprehensive security approach
  const perfectAnswers = questions.filter(item => answers[item.id]?.weight === 1).length;
  const maturityBonus = perfectAnswers >= 8 ? 5 : perfectAnswers >= 6 ? 3 : 0;
  percent = Math.min(100, percent + maturityBonus);
  
  // Generate dynamic, specific notes
  const notes = generateDynamicSuggestions(answers, questions, categoryScores);
  
  return { percent, notes, categoryScores, maturityBonus };
}

/**
 * Generate dynamic, risk-based recommendations based on user responses
 * @param {Object} answers - User's quiz answers object
 * @param {Array} questions - Array of question objects
 * @param {Object} categoryScores - Category breakdown from scoring function
 * @returns {Array} - Array of prioritized recommendation strings
 */
export function generateDynamicSuggestions(answers, questions, categoryScores) {
  const suggestions = [];
  const criticalGaps = [];
  const improvements = [];
  
  // Enhanced risk assessment for each gap
  const riskMatrix = {
    'q1': { impact: 'HIGH', likelihood: 'HIGH', urgency: 1, cost: '$100-500' },
    'q2': { impact: 'MEDIUM', likelihood: 'HIGH', urgency: 2, cost: '$500-2000' },
    'q3': { impact: 'HIGH', likelihood: 'MEDIUM', urgency: 1, cost: '$200-1000' },
    'q4': { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 3, cost: '$1000-5000' },
    'q5': { impact: 'HIGH', likelihood: 'LOW', urgency: 2, cost: '$2000-10000' },
    'q6': { impact: 'MEDIUM', likelihood: 'HIGH', urgency: 2, cost: '$500-3000' },
    'q7': { impact: 'MEDIUM', likelihood: 'LOW', urgency: 3, cost: '$1000-5000' },
    'q8': { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 2, cost: '$2000-8000' },
    'q9': { impact: 'LOW', likelihood: 'LOW', urgency: 4, cost: '$5000-15000' }
  };
  
  // Analyze each answer for specific recommendations with risk context
  questions.forEach((item) => {
    const picked = answers[item.id];
    if (!picked) return;
    
    const risk = riskMatrix[item.id] || { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 3, cost: 'Variable' };
    
    if (picked.weight === 0) {
      const riskLevel = risk.impact === 'HIGH' && risk.likelihood === 'HIGH' ? 'CRITICAL' : 
                       risk.impact === 'HIGH' || risk.likelihood === 'HIGH' ? 'HIGH' : 'MEDIUM';
      criticalGaps.push({
        area: item.id,
        suggestion: `${item.noteBad} [${riskLevel} RISK • ${risk.cost} • 30-day target]`,
        priority: risk.urgency,
        riskLevel
      });
    } else if (picked.weight === 0.5) {
      improvements.push({
        area: item.id,
        suggestion: `${item.noteIffy} [MEDIUM RISK • ${risk.cost} • 60-day target]`,
        priority: risk.urgency + 2,
        riskLevel: 'MEDIUM'
      });
    }
  });
  
  // Sort by priority (urgency score)
  criticalGaps.sort((a, b) => a.priority - b.priority);
  improvements.sort((a, b) => a.priority - b.priority);
  
  // Add strategic recommendations based on patterns
  const foundationAvg = categoryScores.foundation.length > 0 ? 
    categoryScores.foundation.reduce((sum, score) => sum + score, 0) / categoryScores.foundation.length : 0;
  const advancedAvg = categoryScores.advanced.length > 0 ? 
    categoryScores.advanced.reduce((sum, score) => sum + score, 0) / categoryScores.advanced.length : 0;
  
  if (foundationAvg < 0.7) {
    suggestions.push("🎯 STRATEGIC PRIORITY: Focus on cybersecurity fundamentals first - authentication, backups, and training form your security foundation. [Est. 60-90 days, $2000-8000 total investment]");
  }
  
  if (advancedAvg > foundationAvg + 0.3) {
    suggestions.push("⚖️ BALANCE RECOMMENDATION: Your advanced security exceeds your fundamentals. Strengthen your foundation for better overall protection. [30-day rebalancing focus]");
  }
  
  // Add industry-specific insights with implementation guidance
  const hasCompliance = answers['q9']?.weight || 0;
  if (hasCompliance < 1) {
    suggestions.push("🏛️ COMPLIANCE ROADMAP: Consider NIST Cybersecurity Framework adoption. Start with 'Identify' and 'Protect' functions. [90-day implementation, consider compliance consultant $5000-15000]");
  }
  
  // Quick wins section
  const mfaStatus = answers['q1']?.weight || 0;
  if (mfaStatus < 1) {
    suggestions.push("🔐 IMMEDIATE ACTION (Week 1): Deploy Microsoft Authenticator company-wide. Free solution, 2-hour setup per user. [ROI: Prevents 99.9% of automated attacks]");
  }
  
  const backupStatus = answers['q3']?.weight || 0;
  if (backupStatus < 1) {
    suggestions.push("💾 30-DAY GOAL: Implement 3-2-1 backup strategy. Recommended: Veeam + AWS S3 Glacier ($50-200/month). [Business continuity insurance against ransomware]");
  }
  
  // Combine all suggestions in priority order with visual indicators
  const allSuggestions = [
    ...criticalGaps.map(g => `🚨 ${g.suggestion}`),
    ...improvements.map(i => `📈 ${i.suggestion}`),
    ...suggestions
  ];
  
  return allSuggestions.slice(0, 10); // Expanded to top 10 most important
}