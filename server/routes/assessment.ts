import express from 'express';
import { query } from '../../src/lib/db.mjs';

export const assessmentRouter = express.Router();

// GET /api/assessment — list all assessments
assessmentRouter.get('/', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, slug, title, description FROM assessments ORDER BY id`
    );
    res.json({ assessments: rows });
  } catch (err) {
    console.error('[api/assessment] Error:', err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// GET /api/assessment/:slug — single assessment with questions
assessmentRouter.get('/:slug', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM assessments WHERE slug = $1`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Assessment not found' });
    res.json({ assessment: rows[0] });
  } catch (err) {
    console.error('[api/assessment/:slug] Error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// POST /api/assessment/:slug/submit — submit answers, get result
assessmentRouter.post('/:slug/submit', async (req, res) => {
  try {
    const { answers, session_id } = req.body;
    const { rows: [assessment] } = await query(
      `SELECT * FROM assessments WHERE slug = $1`,
      [req.params.slug]
    );
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    // Score the answers
    const questions = assessment.questions as Array<{
      id: string;
      options: Array<{ value: number; label: string }>;
    }>;
    
    let totalScore = 0;
    let maxScore = 0;
    
    for (const q of questions) {
      const answer = answers[q.id];
      if (answer !== undefined) {
        const option = q.options?.find((o) => o.label === answer || o.value === answer);
        if (option) totalScore += option.value;
      }
      if (q.options?.length) {
        maxScore += Math.max(...q.options.map((o) => o.value));
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    // Determine result label
    let result_label = '';
    if (percentage <= 25) result_label = 'Minimal Dysfunction';
    else if (percentage <= 50) result_label = 'Mild Dysfunction';
    else if (percentage <= 75) result_label = 'Moderate Dysfunction';
    else result_label = 'Significant Dysfunction';

    // Save result
    await query(
      `INSERT INTO assessment_results (assessment_id, session_id, answers, score, result_label)
       VALUES ($1, $2, $3, $4, $5)`,
      [assessment.id, session_id || null, JSON.stringify(answers), totalScore, result_label]
    );

    res.json({
      score: totalScore,
      maxScore,
      percentage,
      result_label,
      recommendations: getRecommendations(result_label),
    });
  } catch (err) {
    console.error('[api/assessment/submit] Error:', err);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

function getRecommendations(label: string): string[] {
  const recs: Record<string, string[]> = {
    'Minimal Dysfunction': [
      'Your pelvic floor appears to be functioning well.',
      'Continue with regular movement and diaphragmatic breathing.',
      'Consider a pelvic PT check-in if you plan to become pregnant.',
    ],
    'Mild Dysfunction': [
      'You may benefit from targeted pelvic floor exercises.',
      'Focus on diaphragmatic breathing and hip mobility.',
      'A single session with a pelvic PT can clarify your specific needs.',
    ],
    'Moderate Dysfunction': [
      'A pelvic floor physical therapist can help significantly.',
      'Avoid high-impact exercise until evaluated.',
      'Track your symptoms — frequency, triggers, and severity.',
      'Read our article on finding a qualified pelvic PT.',
    ],
    'Significant Dysfunction': [
      'Please consult a pelvic floor physical therapist.',
      'This level of dysfunction responds well to professional treatment.',
      'Do not self-treat with Kegels alone — they may worsen some conditions.',
      'Bring your assessment results to your first appointment.',
    ],
  };
  return recs[label] || [];
}
