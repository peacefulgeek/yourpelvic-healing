export interface AssessmentQuestion {
  id: string;
  text: string;
  subtext?: string;
  type: 'single' | 'multi' | 'scale';
  options: {
    value: string;
    label: string;
    score?: number;
    tags?: string[];
  }[];
}

export interface AssessmentResult {
  id: string;
  title: string;
  description: string;
  recommendations: string[];
  relatedArticles: string[];
  urgency: 'low' | 'moderate' | 'high';
  cta: {
    text: string;
    href: string;
  };
}

export interface Assessment {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  estimatedTime: string;
  questions: AssessmentQuestion[];
  results: AssessmentResult[];
  scoringLogic: 'sum' | 'category' | 'tag-match';
}

// ─── Assessment 1: Pelvic Floor Symptom Screener ─────────────────────────────

export const SYMPTOM_SCREENER: Assessment = {
  id: 'symptom-screener',
  slug: 'pelvic-floor-symptom-screener',
  title: 'Pelvic Floor Symptom Screener',
  subtitle: 'Find out what your symptoms might be telling you',
  description:
    "This is not a diagnosis. It's a starting point. Answer these questions honestly and get a personalized summary of what your symptoms might indicate — and what to do next.",
  heroImage: '/images/card-assessment.jpg',
  estimatedTime: '3–5 minutes',
  questions: [
    {
      id: 'q1',
      text: 'Do you leak urine when you cough, sneeze, laugh, jump, or lift something heavy?',
      type: 'single',
      options: [
        { value: 'never', label: 'Never', score: 0, tags: [] },
        { value: 'rarely', label: 'Rarely (once a month or less)', score: 1, tags: ['stress-incontinence'] },
        { value: 'sometimes', label: 'Sometimes (a few times a month)', score: 2, tags: ['stress-incontinence'] },
        { value: 'often', label: 'Often (weekly or more)', score: 3, tags: ['stress-incontinence', 'urgent'] },
      ],
    },
    {
      id: 'q2',
      text: 'Do you experience a sudden, strong urge to urinate that is difficult to control?',
      type: 'single',
      options: [
        { value: 'never', label: 'Never', score: 0, tags: [] },
        { value: 'rarely', label: 'Rarely', score: 1, tags: ['urge-incontinence'] },
        { value: 'sometimes', label: 'Sometimes', score: 2, tags: ['urge-incontinence', 'hypertonic'] },
        { value: 'often', label: 'Often or constantly', score: 3, tags: ['urge-incontinence', 'hypertonic', 'urgent'] },
      ],
    },
    {
      id: 'q3',
      text: 'Do you experience pelvic pain, pressure, or heaviness?',
      subtext: 'This includes pain in the lower abdomen, pelvis, vulva, vagina, rectum, or tailbone.',
      type: 'single',
      options: [
        { value: 'never', label: 'No pelvic pain or pressure', score: 0, tags: [] },
        { value: 'mild', label: 'Mild discomfort occasionally', score: 1, tags: ['pelvic-pain'] },
        { value: 'moderate', label: 'Moderate pain that affects daily life', score: 2, tags: ['pelvic-pain', 'hypertonic'] },
        { value: 'severe', label: 'Significant pain that limits activities', score: 3, tags: ['pelvic-pain', 'hypertonic', 'urgent'] },
      ],
    },
    {
      id: 'q4',
      text: 'Do you experience pain during or after sexual intercourse?',
      type: 'single',
      options: [
        { value: 'never', label: 'No pain with sex', score: 0, tags: [] },
        { value: 'sometimes', label: 'Occasionally', score: 1, tags: ['painful-sex'] },
        { value: 'often', label: 'Often', score: 2, tags: ['painful-sex', 'hypertonic', 'vaginismus'] },
        { value: 'always', label: 'Always, or sex is not possible due to pain', score: 3, tags: ['painful-sex', 'hypertonic', 'vaginismus', 'urgent'] },
        { value: 'na', label: 'Not applicable / not sexually active', score: 0, tags: [] },
      ],
    },
    {
      id: 'q5',
      text: 'Do you experience difficulty with bowel movements?',
      subtext: 'This includes constipation, straining, incomplete emptying, or urgency.',
      type: 'single',
      options: [
        { value: 'never', label: 'No bowel difficulties', score: 0, tags: [] },
        { value: 'sometimes', label: 'Occasionally constipated or need to strain', score: 1, tags: ['bowel-dysfunction'] },
        { value: 'often', label: 'Frequently constipated or difficulty emptying', score: 2, tags: ['bowel-dysfunction', 'hypertonic'] },
        { value: 'always', label: 'Chronic constipation or bowel urgency/leaking', score: 3, tags: ['bowel-dysfunction', 'urgent'] },
      ],
    },
    {
      id: 'q6',
      text: 'Do you feel a bulge, pressure, or the sensation that something is falling out of your vagina?',
      type: 'single',
      options: [
        { value: 'never', label: 'No', score: 0, tags: [] },
        { value: 'sometimes', label: 'Sometimes, especially at end of day or after activity', score: 2, tags: ['prolapse', 'hypotonic'] },
        { value: 'often', label: 'Often or always', score: 3, tags: ['prolapse', 'hypotonic', 'urgent'] },
      ],
    },
    {
      id: 'q7',
      text: 'Have you recently given birth (within the last 12 months)?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0, tags: [] },
        { value: 'vaginal', label: 'Yes — vaginal delivery', score: 1, tags: ['postpartum', 'vaginal-birth'] },
        { value: 'cesarean', label: 'Yes — cesarean delivery', score: 1, tags: ['postpartum', 'cesarean'] },
      ],
    },
    {
      id: 'q8',
      text: 'Are you currently in perimenopause or postmenopause?',
      type: 'single',
      options: [
        { value: 'no', label: 'No / not sure', score: 0, tags: [] },
        { value: 'peri', label: 'Perimenopause (irregular periods, symptoms starting)', score: 1, tags: ['menopause'] },
        { value: 'post', label: 'Postmenopause (no period for 12+ months)', score: 2, tags: ['menopause', 'GSM'] },
      ],
    },
    {
      id: 'q9',
      text: 'How much is this affecting your quality of life?',
      type: 'single',
      options: [
        { value: 'minimal', label: "Minimal — it's a minor inconvenience", score: 0, tags: [] },
        { value: 'moderate', label: "Moderate — it affects some activities or choices", score: 1, tags: [] },
        { value: 'significant', label: 'Significant — it affects daily life, relationships, or confidence', score: 2, tags: ['urgent'] },
        { value: 'severe', label: "Severe — I've stopped activities I love because of this", score: 3, tags: ['urgent'] },
      ],
    },
    {
      id: 'q10',
      text: 'Have you ever seen a pelvic floor physical therapist?',
      type: 'single',
      options: [
        { value: 'yes', label: 'Yes, and it helped', score: 0, tags: ['has-seen-pt'] },
        { value: 'yes-no', label: "Yes, but I didn't find it helpful", score: 0, tags: ['has-seen-pt'] },
        { value: 'no', label: "No, I haven't", score: 0, tags: ['needs-pt'] },
        { value: 'unsure', label: "I'm not sure what that is", score: 0, tags: ['needs-pt', 'needs-education'] },
      ],
    },
  ],
  scoringLogic: 'tag-match',
  results: [
    {
      id: 'stress-incontinence',
      title: 'Stress Urinary Incontinence Indicators',
      description:
        "Your symptoms suggest stress urinary incontinence — leaking with physical activity. This is caused by insufficient pelvic floor support for the urethra during pressure spikes. The good news: it responds very well to pelvic floor physical therapy. Most people see significant improvement in 6–12 sessions.",
      recommendations: [
        'See a pelvic floor physical therapist for an assessment',
        'Learn correct Kegel technique (many people do them wrong)',
        'Avoid high-impact exercise until you have a treatment plan',
        'Read: Stress Urinary Incontinence: What\'s Happening and What Works',
      ],
      relatedArticles: ['stress-urinary-incontinence', 'why-kegels-arent-always-the-answer', 'what-pelvic-floor-physical-therapy-involves'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Stress Urinary Incontinence',
        href: '/articles/stress-urinary-incontinence',
      },
    },
    {
      id: 'hypertonic',
      title: 'Hypertonic (Too Tight) Pelvic Floor Indicators',
      description:
        "Your symptoms suggest a hypertonic pelvic floor — one that's too tight rather than too weak. This is the most commonly misunderstood type of pelvic floor dysfunction. Kegels will make this worse. You need relaxation techniques, breathing work, and likely manual therapy from a pelvic PT.",
      recommendations: [
        'Stop doing Kegels until you\'ve been assessed',
        'Start diaphragmatic breathing practice daily',
        'See a pelvic PT who specializes in hypertonic dysfunction',
        'Read: Pelvic Floor Too Tight vs. Too Weak',
      ],
      relatedArticles: ['pelvic-floor-too-tight-vs-too-weak', 'why-kegels-arent-always-the-answer', 'vaginismus-what-it-is-why-it-happens'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Tight vs. Weak',
        href: '/articles/pelvic-floor-too-tight-vs-too-weak',
      },
    },
    {
      id: 'prolapse',
      title: 'Pelvic Organ Prolapse Indicators',
      description:
        "Your symptoms suggest possible pelvic organ prolapse — when the pelvic organs descend into or beyond the vaginal canal. This needs professional assessment. Prolapse is graded 1–4; most cases are manageable with conservative treatment including pelvic PT and a pessary. Surgery is not always necessary.",
      recommendations: [
        'See a urogynecologist or pelvic PT for assessment',
        'Avoid high-impact exercise and heavy lifting until assessed',
        'Learn prolapse-safe exercise modifications',
        'Read: Pelvic Organ Prolapse: Types, Symptoms, and What to Do',
      ],
      relatedArticles: ['pelvic-organ-prolapse', 'what-pelvic-floor-physical-therapy-involves', 'pelvic-floor-exercises-beyond-kegels'],
      urgency: 'high',
      cta: {
        text: 'Read: Pelvic Organ Prolapse',
        href: '/articles/pelvic-organ-prolapse',
      },
    },
    {
      id: 'postpartum',
      title: 'Postpartum Pelvic Floor Recovery',
      description:
        "You recently gave birth — your pelvic floor needs attention. Whether you had a vaginal or cesarean delivery, your pelvic floor has been through significant stress. The standard 6-week clearance is not enough. A pelvic PT assessment at 6–8 weeks postpartum is the gold standard.",
      recommendations: [
        'Book a pelvic PT assessment at 6–8 weeks postpartum',
        'Start gentle diaphragmatic breathing immediately',
        'Avoid returning to high-impact exercise before clearance',
        'Read: Postpartum Pelvic Floor: What Happens and When to Get Help',
      ],
      relatedArticles: ['postpartum-pelvic-floor', 'why-every-postpartum-person-should-see-pelvic-pt', 'diastasis-recti-pelvic-floor'],
      urgency: 'high',
      cta: {
        text: 'Read: Postpartum Pelvic Floor',
        href: '/articles/postpartum-pelvic-floor',
      },
    },
    {
      id: 'menopause',
      title: 'Genitourinary Syndrome of Menopause (GSM)',
      description:
        "Your symptoms and stage of life suggest genitourinary syndrome of menopause (GSM) — the changes to vaginal, urinary, and sexual function caused by declining estrogen. Unlike hot flashes, GSM doesn't improve without treatment. Effective options exist including local estrogen and pelvic PT.",
      recommendations: [
        'Talk to your gynecologist or menopause specialist about local estrogen',
        'See a pelvic PT for the musculoskeletal component',
        'Use a quality vaginal moisturizer consistently',
        'Read: Pelvic Floor and Menopause',
      ],
      relatedArticles: ['pelvic-floor-and-menopause', 'painful-sex-diagnostic-framework', 'what-pelvic-floor-physical-therapy-involves'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Pelvic Floor and Menopause',
        href: '/articles/pelvic-floor-and-menopause',
      },
    },
    {
      id: 'low-risk',
      title: 'Low Symptom Burden — Preventive Focus',
      description:
        "Your symptoms are minimal. That's great. The best time to invest in pelvic floor health is before problems develop. Understanding your pelvic floor anatomy, maintaining coordination with breathing, and building strength progressively will protect you through pregnancy, menopause, and aging.",
      recommendations: [
        'Learn diaphragmatic breathing and pelvic floor coordination',
        'Build hip and core strength as a foundation',
        'Understand what to watch for as you age',
        'Read: What Is the Pelvic Floor?',
      ],
      relatedArticles: ['what-is-the-pelvic-floor', 'pelvic-floor-exercises-beyond-kegels', 'pelvic-floor-health-through-every-decade'],
      urgency: 'low',
      cta: {
        text: 'Start Here: Pelvic Floor Basics',
        href: '/articles/what-is-the-pelvic-floor',
      },
    },
  ],
};

// ─── Assessment 2: Hypertonic vs Hypotonic Quiz ───────────────────────────────

export const HYPERTONIC_QUIZ: Assessment = {
  id: 'hypertonic-vs-hypotonic',
  slug: 'is-my-pelvic-floor-too-tight-or-too-weak',
  title: 'Is My Pelvic Floor Too Tight or Too Weak?',
  subtitle: 'The question that changes everything about your treatment',
  description:
    "Tight and weak are opposite problems that need opposite solutions. Kegels fix weakness and make tightness worse. This quiz helps you understand which pattern your symptoms fit — so you stop doing the wrong thing.",
  heroImage: '/images/card-dysfunction.jpg',
  estimatedTime: '2–3 minutes',
  questions: [
    {
      id: 'h1',
      text: 'Do you experience pain with sexual intercourse or penetration?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often or always', score: 3 },
      ],
    },
    {
      id: 'h2',
      text: 'Do you experience urinary urgency — a sudden, strong urge to urinate?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
      ],
    },
    {
      id: 'h3',
      text: 'Do you experience leaking when you cough, sneeze, laugh, or jump?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: -2 },
        { value: 'often', label: 'Often', score: -3 },
      ],
    },
    {
      id: 'h4',
      text: 'Do you experience chronic pelvic pain, tailbone pain, or hip pain?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Occasionally', score: 2 },
        { value: 'often', label: 'Often or always', score: 3 },
      ],
    },
    {
      id: 'h5',
      text: 'Do you experience difficulty fully emptying your bladder?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
      ],
    },
    {
      id: 'h6',
      text: 'Do you feel a sense of heaviness or pressure in your pelvis?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: -1 },
        { value: 'often', label: 'Often', score: -2 },
      ],
    },
    {
      id: 'h7',
      text: 'Do you experience chronic constipation or difficulty with bowel movements?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 1 },
        { value: 'often', label: 'Often', score: 2 },
      ],
    },
    {
      id: 'h8',
      text: 'Do you experience pain with prolonged sitting?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'often', label: 'Often', score: 3 },
      ],
    },
    {
      id: 'h9',
      text: 'Have you had a vaginal delivery in the past?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'yes', label: 'Yes', score: -1 },
      ],
    },
    {
      id: 'h10',
      text: 'Do you hold tension in your hips, glutes, or lower back?',
      type: 'single',
      options: [
        { value: 'no', label: "No, I'm generally relaxed", score: 0 },
        { value: 'sometimes', label: 'Sometimes', score: 1 },
        { value: 'yes', label: "Yes, I'm chronically tense in these areas", score: 2 },
      ],
    },
  ],
  scoringLogic: 'sum',
  results: [
    {
      id: 'hypertonic-likely',
      title: 'Your Pattern Suggests a Hypertonic (Too Tight) Pelvic Floor',
      description:
        "Based on your answers, your symptoms align more with a hypertonic pelvic floor — one that's too tight rather than too weak. This is the most commonly misunderstood type of pelvic floor dysfunction. The most important thing to know: Kegels will make this worse, not better. Your pelvic floor needs to learn to relax, not contract more.",
      recommendations: [
        'Stop Kegels until you\'ve been assessed by a pelvic PT',
        'Start diaphragmatic breathing — 10 minutes daily',
        'Gentle hip flexor and piriformis stretching',
        'Seek a pelvic PT who specializes in hypertonic dysfunction and manual therapy',
      ],
      relatedArticles: ['pelvic-floor-too-tight-vs-too-weak', 'why-kegels-arent-always-the-answer', 'vaginismus-what-it-is-why-it-happens'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Tight vs. Weak — The Full Guide',
        href: '/articles/pelvic-floor-too-tight-vs-too-weak',
      },
    },
    {
      id: 'hypotonic-likely',
      title: 'Your Pattern Suggests a Hypotonic (Too Weak) Pelvic Floor',
      description:
        "Based on your answers, your symptoms align more with a hypotonic pelvic floor — one that lacks sufficient strength and endurance. This is the scenario where Kegels are appropriate. But technique matters enormously. Most people who do Kegels are doing them wrong. A pelvic PT can teach you correct technique and build a progressive program.",
      recommendations: [
        'Learn correct Kegel technique from a pelvic PT',
        'Build a progressive pelvic floor strengthening program',
        'Add hip and glute strengthening as a foundation',
        'Avoid high-impact exercise until you have adequate strength',
      ],
      relatedArticles: ['pelvic-floor-too-tight-vs-too-weak', 'stress-urinary-incontinence', 'pelvic-floor-exercises-beyond-kegels'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Stress Incontinence Guide',
        href: '/articles/stress-urinary-incontinence',
      },
    },
    {
      id: 'mixed',
      title: 'Your Pattern Suggests Mixed Dysfunction',
      description:
        "Your symptoms don't clearly point to one pattern. This is actually common — many people have elements of both tightness and weakness, or their symptoms are complex enough that self-assessment isn't sufficient. This is exactly why professional assessment matters. A pelvic PT can determine what's actually happening and create a targeted treatment plan.",
      recommendations: [
        'Professional assessment is especially important for mixed patterns',
        'Start with diaphragmatic breathing — it helps both patterns',
        'Avoid self-treating until you have a clearer picture',
        'Read: What Pelvic PT Actually Involves',
      ],
      relatedArticles: ['what-pelvic-floor-physical-therapy-involves', 'pelvic-floor-too-tight-vs-too-weak', 'what-is-the-pelvic-floor'],
      urgency: 'moderate',
      cta: {
        text: 'Read: What Pelvic PT Involves',
        href: '/articles/what-pelvic-floor-physical-therapy-involves',
      },
    },
  ],
};

// ─── Assessment 3: Postpartum Recovery Readiness ─────────────────────────────

export const POSTPARTUM_QUIZ: Assessment = {
  id: 'postpartum-readiness',
  slug: 'postpartum-pelvic-floor-recovery-readiness',
  title: 'Postpartum Recovery Readiness Check',
  subtitle: 'Are you ready to return to exercise? Here\'s what your body is telling you.',
  description:
    "The 6-week clearance is not a green light for everything. This assessment helps you understand where you are in your postpartum recovery and what's safe to do — and what to wait on.",
  heroImage: '/images/hero-postpartum.jpg',
  estimatedTime: '3–4 minutes',
  questions: [
    {
      id: 'p1',
      text: 'How many weeks postpartum are you?',
      type: 'single',
      options: [
        { value: '0-6', label: '0–6 weeks', score: 0, tags: ['early-postpartum'] },
        { value: '6-12', label: '6–12 weeks', score: 1, tags: ['mid-postpartum'] },
        { value: '3-6m', label: '3–6 months', score: 2, tags: ['later-postpartum'] },
        { value: '6m+', label: '6+ months', score: 3, tags: ['late-postpartum'] },
      ],
    },
    {
      id: 'p2',
      text: 'What type of delivery did you have?',
      type: 'single',
      options: [
        { value: 'vaginal-no-tear', label: 'Vaginal — no significant tearing', score: 2, tags: ['vaginal'] },
        { value: 'vaginal-tear', label: 'Vaginal — with 2nd, 3rd, or 4th degree tear', score: 0, tags: ['vaginal', 'tear'] },
        { value: 'cesarean', label: 'Cesarean', score: 1, tags: ['cesarean'] },
        { value: 'instrumental', label: 'Vaginal with forceps or vacuum', score: 0, tags: ['vaginal', 'instrumental'] },
      ],
    },
    {
      id: 'p3',
      text: 'Are you currently experiencing any leaking (urine or gas)?',
      type: 'single',
      options: [
        { value: 'no', label: 'No leaking at all', score: 3, tags: [] },
        { value: 'light', label: 'Light leaking with sneezing or coughing', score: 1, tags: ['leaking'] },
        { value: 'moderate', label: 'Moderate leaking with activity', score: 0, tags: ['leaking', 'hold-back'] },
        { value: 'significant', label: 'Significant leaking or urgency', score: 0, tags: ['leaking', 'hold-back', 'see-pt'] },
      ],
    },
    {
      id: 'p4',
      text: 'Do you experience any pelvic heaviness or pressure during or after activity?',
      type: 'single',
      options: [
        { value: 'no', label: 'No', score: 3, tags: [] },
        { value: 'mild', label: 'Mild, occasional', score: 1, tags: ['prolapse-risk'] },
        { value: 'moderate', label: 'Moderate — I notice it most days', score: 0, tags: ['prolapse-risk', 'hold-back'] },
        { value: 'significant', label: 'Significant — I feel a bulge or significant pressure', score: 0, tags: ['prolapse-risk', 'hold-back', 'see-pt'] },
      ],
    },
    {
      id: 'p5',
      text: 'Can you perform a pelvic floor contraction (Kegel) without pain?',
      type: 'single',
      options: [
        { value: 'yes', label: "Yes, no pain", score: 2, tags: [] },
        { value: 'mild-pain', label: 'Mild discomfort', score: 1, tags: ['pain'] },
        { value: 'pain', label: 'Pain with contraction', score: 0, tags: ['pain', 'see-pt'] },
        { value: 'unsure', label: "I'm not sure how to do one", score: 0, tags: ['needs-education'] },
      ],
    },
    {
      id: 'p6',
      text: 'Have you had a diastasis recti (abdominal separation) assessment?',
      type: 'single',
      options: [
        { value: 'yes-resolved', label: 'Yes — assessed and healing well', score: 2, tags: [] },
        { value: 'yes-present', label: 'Yes — I have diastasis recti', score: 0, tags: ['diastasis', 'hold-back'] },
        { value: 'no', label: "No, I haven't been assessed", score: 0, tags: ['needs-assessment'] },
      ],
    },
    {
      id: 'p7',
      text: 'Have you seen a pelvic floor physical therapist since giving birth?',
      type: 'single',
      options: [
        { value: 'yes', label: 'Yes — and I have a return-to-exercise plan', score: 3, tags: ['has-pt'] },
        { value: 'yes-no-plan', label: "Yes — but I don't have a specific plan", score: 1, tags: ['has-pt'] },
        { value: 'no', label: "No, I haven't", score: 0, tags: ['needs-pt'] },
      ],
    },
    {
      id: 'p8',
      text: 'What type of exercise are you hoping to return to?',
      type: 'single',
      options: [
        { value: 'walking', label: 'Walking', score: 3, tags: ['low-impact'] },
        { value: 'yoga-pilates', label: 'Yoga or Pilates', score: 2, tags: ['low-impact'] },
        { value: 'running', label: 'Running', score: 0, tags: ['high-impact', 'needs-clearance'] },
        { value: 'hiit', label: 'HIIT, CrossFit, or high-impact classes', score: 0, tags: ['high-impact', 'needs-clearance'] },
        { value: 'weightlifting', label: 'Weightlifting or strength training', score: 1, tags: ['moderate-impact'] },
      ],
    },
  ],
  scoringLogic: 'sum',
  results: [
    {
      id: 'ready-low-impact',
      title: 'You\'re Ready to Begin Low-Impact Movement',
      description:
        "Based on your responses, you appear ready to begin or continue low-impact exercise. Walking, gentle yoga, and breathing-based movement are appropriate. Focus on reconnecting with your pelvic floor and core before adding load or impact.",
      recommendations: [
        'Start with 20–30 minute walks, building gradually',
        'Practice diaphragmatic breathing and pelvic floor reconnection daily',
        'Add gentle yoga or Pilates when walking feels comfortable',
        'See a pelvic PT before returning to running or high-impact exercise',
      ],
      relatedArticles: ['postpartum-pelvic-floor', 'diaphragmatic-breathing-and-pelvic-floor', 'diastasis-recti-pelvic-floor'],
      urgency: 'low',
      cta: {
        text: 'Read: Postpartum Pelvic Floor Guide',
        href: '/articles/postpartum-pelvic-floor',
      },
    },
    {
      id: 'not-ready-see-pt',
      title: 'Not Ready Yet — Please See a Pelvic PT First',
      description:
        "Your responses suggest you're not yet ready to return to exercise — particularly higher-impact activities. This isn't bad news. It means your body needs a bit more time and targeted support before loading. Seeing a pelvic PT now will get you back to full activity faster and more safely than pushing through.",
      recommendations: [
        'Book a pelvic PT assessment as soon as possible',
        'Limit activity to walking and gentle breathing work for now',
        "Don't return to running, HIIT, or heavy lifting until cleared",
        'Read: Why Every Postpartum Person Should See a Pelvic PT',
      ],
      relatedArticles: ['why-every-postpartum-person-should-see-pelvic-pt', 'postpartum-pelvic-floor', 'what-pelvic-floor-physical-therapy-involves'],
      urgency: 'high',
      cta: {
        text: 'Read: Why See a Pelvic PT Postpartum',
        href: '/articles/why-every-postpartum-person-should-see-pelvic-pt',
      },
    },
    {
      id: 'early-postpartum',
      title: 'Early Postpartum — Focus on Recovery, Not Exercise',
      description:
        "You're in the early postpartum period. This is not the time for exercise — it's the time for recovery. The most important things you can do right now are rest, breathe, and let your body begin healing. Gentle diaphragmatic breathing is the only 'exercise' that's appropriate in the first 6 weeks.",
      recommendations: [
        'Rest as much as possible — recovery is the work right now',
        'Practice diaphragmatic breathing to reconnect with your pelvic floor',
        'Book a pelvic PT assessment for 6–8 weeks postpartum',
        "Avoid anything that increases pelvic pressure or causes pain",
      ],
      relatedArticles: ['postpartum-pelvic-floor', 'diaphragmatic-breathing-and-pelvic-floor', 'why-every-postpartum-person-should-see-pelvic-pt'],
      urgency: 'moderate',
      cta: {
        text: 'Read: Postpartum Pelvic Floor',
        href: '/articles/postpartum-pelvic-floor',
      },
    },
  ],
};

export const ALL_ASSESSMENTS: Assessment[] = [
  SYMPTOM_SCREENER,
  HYPERTONIC_QUIZ,
  POSTPARTUM_QUIZ,
];
