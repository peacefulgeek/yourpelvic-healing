#!/usr/bin/env python3
"""Append 6 new assessments to assessments.ts and update ALL_ASSESSMENTS."""

import re

path = '/home/ubuntu/the-pelvic-floor/src/data/assessments.ts'
content = open(path).read()

new_code = '''
// ─── Assessment 4: Pelvic Pain Pattern Identifier ────────────────────────────
export const PELVIC_PAIN_QUIZ: Assessment = {
  id: 'pelvic-pain-pattern',
  slug: 'pelvic-pain-pattern-identifier',
  title: 'Pelvic Pain Pattern Identifier',
  subtitle: 'What type of pelvic pain are you experiencing?',
  description: "Pelvic pain has many causes. This assessment helps identify your pain pattern and points you toward the right type of care.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-pain.webp',
  estimatedTime: '5-6 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'Where is your pain primarily located?', type: 'single', options: [{ value: 'lower-ab', label: 'Lower abdomen / pubic area', score: 1 }, { value: 'deep', label: 'Deep inside the pelvis', score: 2 }, { value: 'vulva', label: 'Vaginal opening / vulva', score: 3 }, { value: 'tailbone', label: 'Tailbone / coccyx / rectum', score: 2 }] },
    { id: 'q2', text: 'When does your pain tend to be worst?', type: 'single', options: [{ value: 'period', label: 'During menstruation', score: 1 }, { value: 'sex', label: 'During or after sex', score: 2 }, { value: 'sitting', label: 'With prolonged sitting', score: 2 }, { value: 'bladder', label: 'With bladder filling or urination', score: 2 }] },
    { id: 'q3', text: 'How long have you had this pain?', type: 'single', options: [{ value: 'acute', label: 'Less than 3 months', score: 0 }, { value: 'subacute', label: '3-6 months', score: 1 }, { value: 'chronic', label: '6 months to 2 years', score: 2 }, { value: 'longterm', label: 'More than 2 years', score: 3 }] },
    { id: 'q4', text: 'Does your pain affect your ability to work, exercise, or socialize?', type: 'single', options: [{ value: 'none', label: 'No impact', score: 0 }, { value: 'mild', label: 'Mild impact', score: 1 }, { value: 'moderate', label: 'Moderate impact', score: 2 }, { value: 'severe', label: 'Severe impact', score: 3 }] },
    { id: 'q5', text: 'Have you been diagnosed with endometriosis, fibroids, or PCOS?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'suspected', label: 'Suspected but not confirmed', score: 1 }, { value: 'one', label: 'Yes, one of these', score: 2 }, { value: 'multiple', label: 'Yes, multiple diagnoses', score: 3 }] },
    { id: 'q6', text: 'Have you seen a healthcare provider for this pain?', type: 'single', options: [{ value: 'yes-plan', label: 'Yes, and I have a treatment plan', score: 0 }, { value: 'yes-no-dx', label: 'Yes, but no clear diagnosis yet', score: 1 }, { value: 'planning', label: 'No, but I plan to', score: 2 }, { value: 'no', label: 'No', score: 3 }] },
  ],
  results: [
    { id: 'musculoskeletal', title: 'Likely Musculoskeletal Pattern', description: "Your pain pattern suggests that your pelvic floor muscles, connective tissue, or surrounding structures may be contributing to your pain. Musculoskeletal pelvic pain responds very well to pelvic floor physical therapy.", recommendations: ['See a pelvic floor PT for a musculoskeletal assessment', 'Try gentle heat and hip stretches for temporary relief', 'Track your pain triggers in a diary'], relatedArticles: ['pelvic-pain-causes', 'hypertonic-pelvic-floor', 'pelvic-floor-physical-therapy-guide'], urgency: 'moderate', cta: { text: 'Read: Pelvic Pain Causes', href: '/articles/pelvic-pain-causes' } },
    { id: 'complex', title: 'Complex Pain Pattern — Multidisciplinary Care Needed', description: "Your pain pattern is complex and has likely been affecting your life for some time. A multidisciplinary approach works best: a pain specialist or urogynecologist, a pelvic floor PT, and possibly a pelvic pain psychologist.", recommendations: ['Seek a pelvic pain specialist or urogynecologist', 'Request a comprehensive evaluation', 'Ask about a multidisciplinary pain program'], relatedArticles: ['chronic-pelvic-pain-guide', 'pelvic-pain-causes', 'pelvic-floor-physical-therapy-guide'], urgency: 'high', cta: { text: 'Read: Chronic Pelvic Pain', href: '/articles/chronic-pelvic-pain-guide' } },
  ],
};

// ─── Assessment 5: Bladder Health Check ──────────────────────────────────────
export const BLADDER_HEALTH_QUIZ: Assessment = {
  id: 'bladder-health-check',
  slug: 'bladder-health-check',
  title: 'Bladder Health Check',
  subtitle: 'How healthy is your bladder?',
  description: "Bladder symptoms are common but not normal. This assessment helps you understand your bladder health and whether you need support.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-bladder.webp',
  estimatedTime: '4 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'How many times do you urinate during the day (waking hours)?', type: 'single', options: [{ value: 'normal', label: '4-7 times (normal)', score: 0 }, { value: 'mild', label: '8-10 times', score: 1 }, { value: 'moderate', label: '11-13 times', score: 2 }, { value: 'severe', label: '14 or more times', score: 3 }] },
    { id: 'q2', text: 'How many times do you wake at night to urinate?', type: 'single', options: [{ value: 'none', label: 'Never or once', score: 0 }, { value: 'twice', label: 'Twice', score: 1 }, { value: 'three', label: 'Three times', score: 2 }, { value: 'four', label: 'Four or more times', score: 3 }] },
    { id: 'q3', text: 'Do you experience urgency (sudden, strong need to urinate)?', type: 'single', options: [{ value: 'never', label: 'Never', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'constantly', label: 'Constantly', score: 3 }] },
    { id: 'q4', text: 'Do you leak urine before reaching the toilet?', type: 'single', options: [{ value: 'never', label: 'Never', score: 0 }, { value: 'rarely', label: 'Rarely', score: 1 }, { value: 'sometimes', label: 'Sometimes', score: 2 }, { value: 'often', label: 'Often', score: 3 }] },
    { id: 'q5', text: 'Do you go to the bathroom just in case even when you do not feel the urge?', type: 'single', options: [{ value: 'never', label: 'Never', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'always', label: 'Almost always', score: 3 }] },
    { id: 'q6', text: 'How much does your bladder affect your daily life?', type: 'single', options: [{ value: 'none', label: 'Not at all', score: 0 }, { value: 'mild', label: 'Mildly', score: 1 }, { value: 'moderate', label: 'Moderately', score: 2 }, { value: 'significant', label: 'Significantly', score: 3 }] },
  ],
  results: [
    { id: 'healthy', title: 'Healthy Bladder', description: "Your bladder is doing well. Keep up the good habits: staying hydrated with water, avoiding bladder irritants like caffeine and alcohol in large amounts, and not going to the bathroom just in case.", recommendations: ['Stay hydrated with 6-8 glasses of water daily', 'Avoid excessive caffeine and alcohol', 'Do not go to the bathroom just in case'], relatedArticles: ['bladder-health-basics', 'urinary-incontinence-types'], urgency: 'low', cta: { text: 'Read: Bladder Health Basics', href: '/articles/bladder-health-basics' } },
    { id: 'overactive', title: 'Signs of Overactive Bladder', description: "Your responses suggest an overactive bladder pattern. This is one of the most common and most treatable bladder conditions. Behavioral strategies, pelvic floor PT, and sometimes medication can make a dramatic difference.", recommendations: ['See a pelvic floor PT for bladder retraining', 'Stop going to the bathroom just in case', 'Reduce caffeine and alcohol intake', 'Track your fluid intake in a bladder diary'], relatedArticles: ['overactive-bladder-guide', 'urinary-incontinence-types'], urgency: 'moderate', cta: { text: 'Read: Overactive Bladder', href: '/articles/overactive-bladder-guide' } },
    { id: 'significant', title: 'Significant Bladder Symptoms', description: "Your bladder symptoms are real and they are affecting your quality of life. A urologist or urogynecologist can evaluate you for conditions like overactive bladder, interstitial cystitis, or pelvic floor dysfunction.", recommendations: ['See a urologist or urogynecologist for evaluation', 'Ask for a referral to a pelvic floor PT', 'Keep a bladder diary for 3 days before your appointment'], relatedArticles: ['urinary-incontinence-types', 'overactive-bladder-guide'], urgency: 'high', cta: { text: 'Read: Urinary Incontinence Types', href: '/articles/urinary-incontinence-types' } },
  ],
};

// ─── Assessment 6: Menopause & Pelvic Floor ───────────────────────────────────
export const MENOPAUSE_QUIZ: Assessment = {
  id: 'menopause-pelvic-floor',
  slug: 'menopause-pelvic-floor-assessment',
  title: 'Menopause & Pelvic Floor Assessment',
  subtitle: 'How is menopause affecting your pelvic floor?',
  description: "Estrogen loss changes everything below the belt. This assessment helps you understand how perimenopause and menopause are affecting your pelvic floor.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-menopause.webp',
  estimatedTime: '5 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'Where are you in your menopausal journey?', type: 'single', options: [{ value: 'pre', label: 'Premenopausal (regular periods)', score: 0 }, { value: 'peri', label: 'Perimenopausal (irregular periods, symptoms)', score: 1 }, { value: 'meno', label: 'Menopausal (no period for 12 months)', score: 2 }, { value: 'post', label: 'Postmenopausal (several years past menopause)', score: 3 }] },
    { id: 'q2', text: 'Do you experience vaginal dryness, burning, or irritation?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'mild', label: 'Mild, occasional', score: 1 }, { value: 'moderate', label: 'Moderate, affects daily comfort', score: 2 }, { value: 'severe', label: 'Severe, significantly affects my life', score: 3 }] },
    { id: 'q3', text: 'Has sex become painful or uncomfortable since perimenopause began?', type: 'single', options: [{ value: 'no', label: 'No change', score: 0 }, { value: 'mild', label: 'Mild discomfort', score: 1 }, { value: 'significant', label: 'Significant pain', score: 2 }, { value: 'avoid', label: 'I avoid sex because of pain', score: 3 }] },
    { id: 'q4', text: 'Have you noticed new or worsening bladder leakage since perimenopause?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'mild', label: 'Mild, occasional', score: 1 }, { value: 'moderate', label: 'Moderate', score: 2 }, { value: 'significant', label: 'Significant', score: 3 }] },
    { id: 'q5', text: 'How much are menopausal pelvic symptoms affecting your quality of life?', type: 'single', options: [{ value: 'none', label: 'Not at all', score: 0 }, { value: 'mild', label: 'Mildly', score: 1 }, { value: 'moderate', label: 'Moderately', score: 2 }, { value: 'significant', label: 'Significantly', score: 3 }] },
  ],
  results: [
    { id: 'early', title: 'Early or Minimal Changes', description: "You are either early in the transition or managing well. This is a good time to be proactive. Vaginal estrogen, pelvic floor PT, and lifestyle habits can prevent many of the more significant changes that come with estrogen loss.", recommendations: ['Ask your provider about vaginal estrogen', 'Start or maintain pelvic floor exercises', 'Use a quality vaginal moisturizer'], relatedArticles: ['menopause-and-pelvic-floor', 'vaginal-atrophy-guide'], urgency: 'low', cta: { text: 'Read: Menopause and Pelvic Floor', href: '/articles/menopause-and-pelvic-floor' } },
    { id: 'significant', title: 'Significant Menopausal Pelvic Changes', description: "Your symptoms are significant and deserve specialized attention. A menopause specialist or urogynecologist who understands the full picture of genitourinary syndrome of menopause (GSM) is who you need.", recommendations: ['See a menopause specialist or urogynecologist', 'Ask specifically about GSM (genitourinary syndrome of menopause)', 'Get a pelvic floor PT referral'], relatedArticles: ['menopause-and-pelvic-floor', 'vaginal-atrophy-guide', 'pelvic-floor-physical-therapy-guide'], urgency: 'high', cta: { text: 'Read: Vaginal Atrophy Guide', href: '/articles/vaginal-atrophy-guide' } },
  ],
};

// ─── Assessment 7: Diastasis Recti Self-Check ────────────────────────────────
export const DIASTASIS_QUIZ: Assessment = {
  id: 'diastasis-recti-check',
  slug: 'diastasis-recti-self-check',
  title: 'Diastasis Recti Self-Check',
  subtitle: 'Do you have abdominal separation?',
  description: "Diastasis recti affects up to 60 percent of pregnant and postpartum women. This assessment helps you understand if you might have it and what to do next.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-diastasis.webp',
  estimatedTime: '4 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'Have you been pregnant in the past 2 years?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'one', label: 'Yes, one pregnancy', score: 1 }, { value: 'multiple', label: 'Yes, multiple pregnancies', score: 2 }, { value: 'current', label: 'Currently pregnant', score: 1 }] },
    { id: 'q2', text: 'Do you notice a coning or doming in your abdomen when you do a sit-up or crunch?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'maybe', label: 'Possibly, I am not sure', score: 1 }, { value: 'yes', label: 'Yes, I notice it', score: 2 }, { value: 'obvious', label: 'Yes, it is very noticeable', score: 3 }] },
    { id: 'q3', text: 'Do you have a visible gap or ridge down the center of your abdomen?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'maybe', label: 'Possibly', score: 1 }, { value: 'small', label: 'Yes, a small gap', score: 2 }, { value: 'significant', label: 'Yes, a significant gap', score: 3 }] },
    { id: 'q4', text: 'Do you feel weak in your core, or like your core gives out with activity?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'always', label: 'Almost always', score: 3 }] },
    { id: 'q5', text: 'Have you been doing traditional crunches or sit-ups postpartum?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'regularly', label: 'Regularly', score: 2 }, { value: 'frequently', label: 'Frequently, it is part of my routine', score: 3 }] },
  ],
  results: [
    { id: 'unlikely', title: 'Diastasis Recti Unlikely', description: "Your responses do not suggest significant diastasis recti. You can continue most exercise with confidence, though learning proper core activation technique is always worthwhile.", recommendations: ['Learn proper core activation (not crunches)', 'Consider a postpartum PT assessment to confirm', 'Focus on functional core strength'], relatedArticles: ['diastasis-recti-guide', 'postpartum-pelvic-floor-recovery'], urgency: 'low', cta: { text: 'Read: Diastasis Recti Guide', href: '/articles/diastasis-recti-guide' } },
    { id: 'likely', title: 'Diastasis Recti Likely', description: "Your responses strongly suggest diastasis recti. Please see a pelvic floor PT or womens health physio for a proper assessment before continuing any core exercise. Stop crunches and sit-ups now.", recommendations: ['See a pelvic floor PT immediately', 'Stop all crunch-based exercises', 'Avoid heavy lifting and breath-holding', 'Learn to manage intra-abdominal pressure in daily life'], relatedArticles: ['diastasis-recti-guide', 'postpartum-pelvic-floor-recovery', 'pelvic-floor-physical-therapy-guide'], urgency: 'high', cta: { text: 'Read: Diastasis Recti Guide', href: '/articles/diastasis-recti-guide' } },
  ],
};

// ─── Assessment 8: Sexual Health & Pelvic Floor ───────────────────────────────
export const SEXUAL_HEALTH_QUIZ: Assessment = {
  id: 'sexual-health-pelvic-floor',
  slug: 'sexual-health-pelvic-floor-check',
  title: 'Sexual Health & Pelvic Floor Check',
  subtitle: 'Is your pelvic floor affecting your sex life?',
  description: "Painful sex, low libido, and difficulty with orgasm are often pelvic floor issues. This assessment helps you understand the connection.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-sexual-health.webp',
  estimatedTime: '5 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'Do you experience pain during penetration?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'mild', label: 'Mild discomfort', score: 1 }, { value: 'significant', label: 'Significant pain', score: 2 }, { value: 'severe', label: 'Severe pain that prevents intercourse', score: 3 }] },
    { id: 'q2', text: 'Do you experience pain deep inside during intercourse?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'always', label: 'Almost always', score: 3 }] },
    { id: 'q3', text: 'Do you experience burning, stinging, or rawness in the vulvar area?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'constantly', label: 'Almost constantly', score: 3 }] },
    { id: 'q4', text: 'Do you avoid sexual activity because of pain or discomfort?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'stopped', label: 'I have stopped having sex because of this', score: 3 }] },
    { id: 'q5', text: 'Have you discussed these concerns with a healthcare provider?', type: 'single', options: [{ value: 'yes-plan', label: 'Yes, and I have a treatment plan', score: 0 }, { value: 'dismissed', label: 'Yes, but was not taken seriously', score: 2 }, { value: 'embarrassed', label: 'No, I am embarrassed to bring it up', score: 2 }, { value: 'no', label: 'No', score: 1 }] },
  ],
  results: [
    { id: 'minimal', title: 'Minimal Sexual Health Concerns', description: "Your responses suggest minimal sexual health concerns related to your pelvic floor. Keep the conversation open with your healthcare provider, and know that any changes are worth addressing early.", recommendations: ['Maintain open communication with your healthcare provider', 'Stay informed about pelvic floor health', 'Address any changes early rather than waiting'], relatedArticles: ['pelvic-floor-and-sexual-health', 'vaginal-atrophy-guide'], urgency: 'low', cta: { text: 'Read: Pelvic Floor and Sexual Health', href: '/articles/pelvic-floor-and-sexual-health' } },
    { id: 'significant', title: 'Significant Sexual Health Impact', description: "Your sexual health is significantly affected, and you deserve real support. Painful sex, difficulty with arousal, and avoidance of intimacy are all treatable conditions. A pelvic floor PT, a sexual health specialist, and possibly a sex therapist can all be part of your care team.", recommendations: ['See a pelvic floor PT who specializes in sexual pain', 'Ask for a referral to a sexual health specialist', 'Consider a sex therapist who works with physical pain', 'Know that this is very common and very treatable'], relatedArticles: ['dyspareunia-guide', 'vaginismus-guide', 'pelvic-floor-physical-therapy-guide'], urgency: 'high', cta: { text: 'Read: Dyspareunia Guide', href: '/articles/dyspareunia-guide' } },
  ],
};

// ─── Assessment 9: Gut & Pelvic Floor Connection ──────────────────────────────
export const GUT_PELVIC_QUIZ: Assessment = {
  id: 'gut-pelvic-floor-connection',
  slug: 'gut-pelvic-floor-connection-check',
  title: 'Gut & Pelvic Floor Connection Check',
  subtitle: 'Is your gut affecting your pelvic floor?',
  description: "The gut and pelvic floor are deeply connected. Constipation, IBS, and straining all affect pelvic floor function. Find out if your gut is part of your pelvic floor story.",
  heroImage: 'https://pelvic-healing.b-cdn.net/images/assessment-gut.webp',
  estimatedTime: '4 minutes',
  scoringLogic: 'sum',
  questions: [
    { id: 'q1', text: 'How often do you have a bowel movement?', type: 'single', options: [{ value: 'daily', label: 'Once or twice daily (normal)', score: 0 }, { value: 'every2', label: 'Every 2-3 days', score: 1 }, { value: 'every4', label: 'Every 3-5 days', score: 2 }, { value: 'rare', label: 'Less than twice a week', score: 3 }] },
    { id: 'q2', text: 'Do you strain or hold your breath during bowel movements?', type: 'single', options: [{ value: 'never', label: 'Never', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'always', label: 'Almost always', score: 3 }] },
    { id: 'q3', text: 'Do you experience bloating, gas, or abdominal discomfort regularly?', type: 'single', options: [{ value: 'rarely', label: 'Rarely', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'daily', label: 'Almost daily', score: 3 }] },
    { id: 'q4', text: 'Do you feel like you cannot fully empty your bowels?', type: 'single', options: [{ value: 'no', label: 'No', score: 0 }, { value: 'occasionally', label: 'Occasionally', score: 1 }, { value: 'often', label: 'Often', score: 2 }, { value: 'always', label: 'Almost always', score: 3 }] },
    { id: 'q5', text: 'Do you use a footstool when using the toilet?', type: 'single', options: [{ value: 'yes', label: 'Yes, always', score: 0 }, { value: 'sometimes', label: 'Sometimes', score: 1 }, { value: 'heard', label: 'No, but I have heard about it', score: 2 }, { value: 'no', label: 'No', score: 2 }] },
  ],
  results: [
    { id: 'good-gut', title: 'Good Gut-Pelvic Floor Health', description: "Your gut health appears to be supporting your pelvic floor well. Keep up the good habits: adequate hydration, fiber, regular movement, and not straining.", recommendations: ['Continue good hydration and fiber intake', 'Use a footstool for bowel movements', 'Never strain or hold your breath', 'Regular movement supports gut motility'], relatedArticles: ['constipation-and-pelvic-floor', 'gut-pelvic-floor-connection'], urgency: 'low', cta: { text: 'Read: Constipation and Pelvic Floor', href: '/articles/constipation-and-pelvic-floor' } },
    { id: 'gut-affecting', title: 'Gut Issues May Be Affecting Your Pelvic Floor', description: "Your gut health is likely contributing to pelvic floor strain. Chronic straining, constipation, and incomplete emptying all put significant pressure on the pelvic floor over time.", recommendations: ['Increase water intake to 8+ glasses daily', 'Add fiber gradually (too fast causes bloating)', 'Use a footstool for every bowel movement', 'See a pelvic floor PT for bowel mechanics training'], relatedArticles: ['constipation-and-pelvic-floor', 'gut-pelvic-floor-connection', 'pelvic-floor-physical-therapy-guide'], urgency: 'moderate', cta: { text: 'Read: Gut-Pelvic Floor Connection', href: '/articles/gut-pelvic-floor-connection' } },
  ],
};

export const ALL_ASSESSMENTS: Assessment[] = [
  SYMPTOM_SCREENER,
  HYPERTONIC_QUIZ,
  POSTPARTUM_QUIZ,
  PELVIC_PAIN_QUIZ,
  BLADDER_HEALTH_QUIZ,
  MENOPAUSE_QUIZ,
  DIASTASIS_QUIZ,
  SEXUAL_HEALTH_QUIZ,
  GUT_PELVIC_QUIZ,
];
'''

old_end = '''export const ALL_ASSESSMENTS: Assessment[] = [
  SYMPTOM_SCREENER,
  HYPERTONIC_QUIZ,
  POSTPARTUM_QUIZ,
];'''

content = content.replace(old_end, new_code)
open(path, 'w').write(content)
count = content.count("export const ") - 1
print(f"Done. Const exports: {count}")
