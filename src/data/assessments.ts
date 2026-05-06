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

