export interface Product {
  asin: string;
  name: string;
  category: string;
  tags: string[];
  description?: string;
}

export const PRODUCT_CATALOG: Product[] = [
  // ─── Books ───
  {
    asin: '1623171040',
    name: 'Strong: The Women\'s Guide to Total Strength and Fitness by Clare Bourne',
    category: 'books',
    tags: ['pelvic-floor', 'strength', 'postpartum', 'women-health'],
    description: 'Clare Bourne PT\'s essential guide to building real strength without compromising your pelvic floor.',
  },
  {
    asin: '0071600191',
    name: 'Heal Pelvic Pain by Amy Stein',
    category: 'books',
    tags: ['pelvic-pain', 'dysfunction', 'exercises', 'therapy'],
    description: 'A practical, exercise-based program for relieving pelvic pain from a leading pelvic PT.',
  },
  {
    asin: '0757307876',
    name: 'Ending Female Pain by Isa Herrera MSPT',
    category: 'books',
    tags: ['pelvic-pain', 'vulvodynia', 'vaginismus', 'therapy'],
    description: 'Isa Herrera\'s comprehensive guide to understanding and treating chronic female pelvic pain.',
  },
  {
    asin: '0553380893',
    name: 'The V Book by Elizabeth Stewart MD',
    category: 'books',
    tags: ['vulvar-health', 'pain', 'anatomy', 'women-health'],
    description: 'The definitive guide to vulvar and vaginal health — honest, clinical, and essential.',
  },
  {
    asin: '0316412120',
    name: 'Lady Parts by Jen Gunter MD',
    category: 'books',
    tags: ['women-health', 'anatomy', 'menopause', 'general'],
    description: 'Dr. Jen Gunter cuts through the noise on women\'s health with evidence and zero BS.',
  },
  {
    asin: '1623173477',
    name: 'The Female Pelvis by Blandine Calais-Germain',
    category: 'books',
    tags: ['anatomy', 'pelvic-floor', 'biomechanics'],
    description: 'The anatomy reference that pelvic PTs actually use. Detailed, illustrated, essential.',
  },

  // ─── Pelvic Floor Tools ───
  {
    asin: 'B07BFXLH7T',
    name: 'Intimate Rose Kegel Exercise Weights',
    category: 'pelvic-tools',
    tags: ['kegel', 'pelvic-floor', 'strengthening', 'incontinence'],
    description: 'Progressive kegel weights designed with pelvic PTs. Six weights for gradual strengthening.',
  },
  {
    asin: 'B07D6XNQMB',
    name: 'Intimate Rose Pelvic Wand for Pelvic Floor Massage',
    category: 'pelvic-tools',
    tags: ['pelvic-wand', 'myofascial', 'tight-pelvic-floor', 'pain'],
    description: 'For hypertonic (too tight) pelvic floors. Used by pelvic PTs for internal myofascial release.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Soul Source Silicone Vaginal Dilator Set',
    category: 'pelvic-tools',
    tags: ['dilator', 'vaginismus', 'vestibulodynia', 'therapy'],
    description: 'Medical-grade silicone dilators for vaginismus, vestibulodynia, and post-surgical recovery.',
  },
  {
    asin: 'B08NWZF8NM',
    name: 'Elvie Trainer Pelvic Floor Exerciser',
    category: 'pelvic-tools',
    tags: ['biofeedback', 'kegel', 'pelvic-floor', 'technology'],
    description: 'App-connected pelvic floor trainer with real-time biofeedback. Know if you\'re doing it right.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Perifit Kegel Exerciser with App',
    category: 'pelvic-tools',
    tags: ['biofeedback', 'kegel', 'pelvic-floor', 'technology'],
    description: 'Gamified pelvic floor training with biofeedback. Makes the work actually interesting.',
  },

  // ─── Postpartum Recovery ───
  {
    asin: 'B07BFXLH7T',
    name: 'Frida Mom Postpartum Recovery Kit',
    category: 'postpartum',
    tags: ['postpartum', 'perineal-care', 'recovery', 'birth'],
    description: 'Everything you need for perineal healing after birth. The kit hospitals should give you.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Frida Mom Sitz Bath Soak',
    category: 'postpartum',
    tags: ['postpartum', 'perineal-care', 'sitz-bath', 'healing'],
    description: 'Herbal sitz bath for postpartum perineal healing. Soothing and anti-inflammatory.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'BaoBei Postpartum Belly Wrap',
    category: 'postpartum',
    tags: ['postpartum', 'diastasis-recti', 'belly-wrap', 'support'],
    description: 'Abdominal support for postpartum recovery and diastasis recti. Adjustable, breathable.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Organic Witch Hazel Pads (Postpartum)',
    category: 'postpartum',
    tags: ['postpartum', 'perineal-care', 'healing', 'natural'],
    description: 'Cooling, soothing witch hazel pads for postpartum perineal care.',
  },

  // ─── Exercise Support ───
  {
    asin: 'B07BFXLH7T',
    name: 'Disc\'O\'Sit Wobble Cushion for Core Awareness',
    category: 'exercise',
    tags: ['core', 'posture', 'pelvic-floor', 'proprioception'],
    description: 'Wobble cushion that activates deep core and pelvic floor awareness. Used in pelvic PT.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'TheraBand Resistance Bands Set',
    category: 'exercise',
    tags: ['hip-strength', 'glutes', 'pelvic-floor', 'rehabilitation'],
    description: 'Hip and glute strengthening bands. Hip strength is pelvic floor support.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Bellicon Mini Trampoline (Low-Impact)',
    category: 'exercise',
    tags: ['low-impact', 'cardio', 'pelvic-floor', 'running-alternative'],
    description: 'Low-impact cardio that doesn\'t load the pelvic floor like running does.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Foam Roller for Hip and Pelvic Release',
    category: 'exercise',
    tags: ['foam-roller', 'hip-flexors', 'tension', 'mobility'],
    description: 'Hip flexor and piriformis release — muscles that directly affect pelvic floor tension.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Yoga Block Set for Pelvic Floor Exercises',
    category: 'exercise',
    tags: ['yoga', 'pelvic-floor', 'support', 'exercises'],
    description: 'Props for supported pelvic floor and hip opening exercises.',
  },

  // ─── Pain Relief ───
  {
    asin: 'B07BFXLH7T',
    name: 'iReliev TENS Unit for Pelvic Pain',
    category: 'pain-relief',
    tags: ['tens', 'pain-relief', 'pelvic-pain', 'nerve-pain'],
    description: 'TENS therapy for pelvic pain, pudendal neuralgia, and chronic pelvic floor tension.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'TechCare Plus TENS/EMS Unit',
    category: 'pain-relief',
    tags: ['tens', 'ems', 'pain-relief', 'muscle-stimulation'],
    description: 'Combination TENS/EMS for both pain relief and muscle re-education.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Sunbeam Heating Pad (XL)',
    category: 'pain-relief',
    tags: ['heat', 'pain-relief', 'pelvic-pain', 'cramps'],
    description: 'Moist heat for pelvic pain, endometriosis flares, and muscle tension.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Castor Oil Pack Kit for Pelvic Use',
    category: 'pain-relief',
    tags: ['castor-oil', 'pelvic-pain', 'endometriosis', 'natural'],
    description: 'Traditional castor oil packs for pelvic pain and endometriosis support.',
  },
  {
    asin: 'B07BFXLH7T',
    name: 'Intimate Rose Dilator Set (Complete)',
    category: 'pain-relief',
    tags: ['dilator', 'vaginismus', 'pain', 'therapy'],
    description: 'Complete dilator set for vaginismus, vestibulodynia, and painful intercourse.',
  },
];
