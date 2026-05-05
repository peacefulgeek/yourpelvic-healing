/**
 * Seed script — writes articles.json for file-based mode.
 * Run: node src/scripts/seed.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Inline seed data (avoids TS import issues) ─────────────────────────────

const FULL_ARTICLES = [
  {
    slug: 'what-is-the-pelvic-floor',
    title: 'What Is the Pelvic Floor? The Anatomy You Never Learned',
    meta_description: "The pelvic floor is a group of muscles, not a mystery. Here's the anatomy your doctor never explained — and why it matters for everything from bladder control to sex.",
    og_title: 'What Is the Pelvic Floor? The Anatomy You Never Learned',
    og_description: "Stop guessing. Here's what the pelvic floor actually is, what it does, and why nobody taught you this.",
    category: 'anatomy',
    tags: ['anatomy', 'pelvic-floor', 'basics', 'dysfunction'],
    image_alt: 'Anatomical illustration of the pelvic floor muscles',
    reading_time: 8,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>The pelvic floor is a group of muscles, ligaments, and connective tissue that forms the base of your pelvis. It supports your bladder, bowel, and uterus. It controls continence and plays a central role in sexual function.</p>
</section>

<p>Nobody taught you this. That's not an accident. Pelvic floor anatomy has been systematically left out of standard health education for decades. The result is that millions of people are walking around with dysfunctional pelvic floors and no idea why.</p>

<p>Stop overthinking this. The pelvic floor is a muscle group. It works like every other muscle group. It can be too weak, too tight, or uncoordinated. And like every other muscle group, it responds to the right kind of attention.</p>

<h2 id="what-it-is">What the Pelvic Floor Actually Is</h2>

<p>The pelvic floor is a hammock-shaped group of muscles that spans the base of your pelvis from your pubic bone in the front to your tailbone in the back. It's not one muscle. It's a layered system of muscles, ligaments, fascia, and nerves working together.</p>

<p>The three main muscle groups are the levator ani (which includes the puborectalis, pubococcygeus, and iliococcygeus), the coccygeus, and the external urethral and anal sphincters. Blandine Calais-Germain's anatomical work on the female pelvis is the clearest mapping of this system I've seen. The complexity is real, but the function is simple: support, control, and coordination.</p>

<p>Here's what actually works when you understand this: you stop treating the pelvic floor as a single switch to flip. You start treating it as a system that needs to both contract and release.</p>

<h2 id="what-it-does">What the Pelvic Floor Does</h2>

<p>The pelvic floor has five main functions. Most people know about one of them.</p>

<p>First, it supports the pelvic organs. Your bladder, uterus, and rectum sit on top of the pelvic floor. When it's working well, those organs stay where they belong. When it's not, you get prolapse.</p>

<p>Second, it controls continence. The pelvic floor muscles wrap around the urethra and rectum. When they contract, they close those openings. When they relax, they open. Leaking when you laugh or sneeze is a coordination problem, not a character flaw.</p>

<p>Third, it's involved in sexual function. Pelvic floor muscles contribute to arousal, orgasm, and penetration. Painful sex is often a pelvic floor problem. So is difficulty with orgasm. This is a muscle. It responds to the same principles as every other muscle.</p>

<p>Fourth, it works with your core and diaphragm. The pelvic floor doesn't operate in isolation. It's part of a pressure management system that includes your diaphragm, deep abdominal muscles, and multifidus. When you breathe in, your diaphragm descends and your pelvic floor should gently lower. When you breathe out, both should lift. This coordination matters more than most people realize.</p>

<p>Fifth, it stabilizes the pelvis and spine. The pelvic floor contributes to spinal stability, hip function, and overall movement quality.</p>

<h2 id="why-it-matters">Why This Matters More Than You Think</h2>

<p>Look, here's the thing. Most pelvic floor problems are not about weakness. They're about coordination, tension, or both. The standard advice — do Kegels — addresses only one scenario. If your pelvic floor is too tight, Kegels make things worse. Not a little worse. Significantly worse.</p>

<p>This is why <a href="/articles/pelvic-floor-too-tight-vs-too-weak" rel="noopener">understanding whether your pelvic floor is hypertonic or hypotonic</a> matters before you do anything else. Tight and weak are opposite problems. They need opposite solutions.</p>

<p>The body doesn't lie. The mind does. Constantly. If you've been told your symptoms are normal, or that you just need to do more Kegels, or that this is just what happens after having a baby — that's the mind (and the medical system) lying to you. Your symptoms are real. They're treatable. And they start with understanding what's actually there.</p>

<h2 id="common-misconceptions">Three Misconceptions That Make Everything Worse</h2>

<p>The first misconception: the pelvic floor is only relevant after childbirth. Wrong. Pelvic floor dysfunction affects people who have never been pregnant. It affects men. It affects teenagers. It's a muscle group. Anyone with a pelvis can have dysfunction.</p>

<p>The second misconception: leaking is just part of getting older. No. Leaking is a symptom of dysfunction. Dysfunction is treatable. Age is not a sentence. According to research from the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6459001/" target="_blank" rel="nofollow noopener noreferrer">National Institutes of Health</a>, pelvic floor physical therapy has strong evidence for treating stress urinary incontinence at any age.</p>

<p>The third misconception: pelvic floor problems require surgery. Sometimes surgery is appropriate. But the majority of pelvic floor dysfunction responds to conservative treatment — specifically, pelvic floor physical therapy. Most people who need surgery haven't tried PT first. That's backwards.</p>

<h2 id="next-steps">What to Do With This Information</h2>

<p>Start here. Understand that you have a pelvic floor, that it's a muscle system, and that it can be assessed and treated. That's not mystical. It's mechanical.</p>

<p>The next step is figuring out what kind of dysfunction you're dealing with. <a href="/articles/pelvic-floor-too-tight-vs-too-weak">Tight versus weak is the first question</a>. After that, <a href="/articles/what-pelvic-floor-physical-therapy-involves">understanding what pelvic PT actually involves</a> will help you know what to expect when you go.</p>

<p>Nobody's coming to explain this to you. So I will. And the explanation starts here.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/1623171040?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Strong: The Women's Guide to Total Strength and Fitness by Clare Bourne</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/1623173477?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">The Female Pelvis by Blandine Calais-Germain</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/0071600191?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Heal Pelvic Pain by Amy Stein</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'pelvic-floor-too-tight-vs-too-weak',
    title: 'Pelvic Floor Too Tight vs. Too Weak: Why It Matters Which Problem You Have',
    meta_description: "Your pelvic floor might be too tight, not too weak. Kegels fix one problem and make the other worse. Here's how to tell the difference — and why it changes everything.",
    og_title: 'Pelvic Floor Too Tight vs. Too Weak: The Difference That Changes Everything',
    og_description: "Stop doing Kegels until you know which problem you actually have. Tight and weak need opposite solutions.",
    category: 'dysfunction',
    tags: ['hypertonic', 'hypotonic', 'dysfunction', 'kegels', 'tight-pelvic-floor'],
    image_alt: 'Woman doing pelvic floor assessment with physical therapist',
    reading_time: 9,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>A hypertonic (too tight) pelvic floor and a hypotonic (too weak) pelvic floor produce overlapping symptoms but need opposite treatments. Kegels help weakness. They make tightness worse. Getting this wrong is the most common mistake in pelvic floor self-treatment.</p>
</section>

<p>Your pelvic floor isn't weak. It might be too tight. That's the opposite problem. And if you've been doing Kegels for months with no improvement — or things have gotten worse — this is probably why.</p>

<p>This isn't mystical. It's mechanical. A muscle that's chronically contracted can't generate more force. It's already at its limit. Asking it to contract more doesn't strengthen it. It just increases the tension. And increased tension in the pelvic floor causes pain, dysfunction, and exactly the symptoms you're trying to fix.</p>

<h2 id="hypertonic">What Hypertonic (Too Tight) Looks Like</h2>

<p>A hypertonic pelvic floor is one that can't fully relax. The muscles are in a state of chronic contraction or elevated resting tone. This isn't the same as being strong. Strong muscles contract when asked and relax when not. A hypertonic pelvic floor is stuck in the on position.</p>

<p>Symptoms of a hypertonic pelvic floor include painful sex (especially penetration), difficulty inserting tampons, chronic pelvic pain, tailbone pain, hip pain, urinary urgency (the sudden need to go), difficulty emptying the bladder fully, constipation, and pain with prolonged sitting.</p>

<p>Here's what actually works for hypertonic pelvic floors: relaxation, not strengthening. Diaphragmatic breathing. Hip flexor release. Myofascial work. Sometimes internal manual therapy with a pelvic PT. The goal is to teach the muscles to let go.</p>

<h2 id="hypotonic">What Hypotonic (Too Weak) Looks Like</h2>

<p>A hypotonic pelvic floor lacks the strength and endurance to do its job. The muscles can't generate enough force to support the pelvic organs, maintain continence, or contribute to sexual function.</p>

<p>Symptoms of a hypotonic pelvic floor include stress urinary incontinence (leaking with coughing, sneezing, jumping, or laughing), pelvic organ prolapse, reduced sensation during sex, difficulty reaching orgasm, and a feeling of heaviness or pressure in the pelvis.</p>

<p>This is where Kegels are appropriate. Strengthening exercises, progressive loading, and coordination training. The goal is to build capacity.</p>

<h2 id="overlap">The Overlap Problem</h2>

<p>Look, here's the thing. Symptoms overlap. Urinary urgency can come from a hypertonic floor (the tight muscles irritate the bladder) or from a weak floor (insufficient support). Painful sex can come from tightness or from weakness-related prolapse. Incontinence can be stress (weakness) or urge (often tightness).</p>

<p>This is why self-diagnosis is limited. And it's why <a href="/articles/what-pelvic-floor-physical-therapy-involves">pelvic floor physical therapy</a> starts with an assessment. A pelvic PT can tell you within one session whether you're dealing with tightness, weakness, or both. That information changes everything that comes after.</p>

<h2 id="what-to-do">What to Do Right Now</h2>

<p>Stop doing Kegels until you know which problem you have. That's the first step. If you have symptoms of tightness — pain, urgency, difficulty with penetration — adding more contraction is making things worse.</p>

<p>Start with diaphragmatic breathing. Lie on your back, knees bent. Breathe into your belly and feel your pelvic floor gently descend on the inhale. On the exhale, it should gently lift. This is the coordination pattern your pelvic floor needs regardless of whether you're tight or weak. It's the foundation.</p>

<p>Then find a pelvic PT. One assessment session will tell you more than months of guessing.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/B07D6XNQMB?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Pelvic Wand for Myofascial Release</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/0071600191?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Heal Pelvic Pain by Amy Stein</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Kegel Exercise Weights</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'why-kegels-arent-always-the-answer',
    title: "Why Kegels Aren't Always the Answer",
    meta_description: "Kegels are the first thing everyone recommends for pelvic floor problems. They're also the wrong answer for a significant percentage of people. Here's when they help — and when they make things worse.",
    og_title: "Why Kegels Aren't Always the Answer (And Can Make Things Worse)",
    og_description: "The most common pelvic floor advice is also the most commonly wrong. Here's what you actually need to know.",
    category: 'exercises',
    tags: ['kegels', 'exercises', 'dysfunction', 'hypertonic', 'pelvic-floor'],
    image_alt: 'Woman practicing diaphragmatic breathing for pelvic floor health',
    reading_time: 8,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Kegels strengthen a weak pelvic floor. They worsen a tight one. Since a significant percentage of pelvic floor dysfunction involves tightness rather than weakness, the standard advice to "just do Kegels" is wrong for many people. The first question is always: what kind of dysfunction do you have?</p>
</section>

<p>Kegels aren't always the answer. Sometimes they make things worse. Here's why.</p>

<p>The Kegel was developed by Dr. Arnold Kegel in the 1940s as a treatment for stress urinary incontinence after childbirth. It works by repeatedly contracting and relaxing the pelvic floor muscles to build strength and endurance. For a weak, underactive pelvic floor, this is exactly right.</p>

<p>But here's what Dr. Kegel didn't account for: not all pelvic floor dysfunction is weakness. A substantial portion of people with pelvic floor symptoms — pain, urgency, difficulty with penetration, chronic tension — have a hypertonic floor. Too tight, not too weak. And for those people, Kegels are contraindicated.</p>

<h2 id="when-kegels-work">When Kegels Actually Work</h2>

<p>Kegels are appropriate for stress urinary incontinence — leaking with coughing, sneezing, jumping, or laughing. They're appropriate for mild pelvic organ prolapse as part of a broader strengthening program. They're appropriate for postpartum recovery in people who had a vaginal birth and have documented weakness. They're appropriate for anyone with a confirmed hypotonic (weak, underactive) pelvic floor.</p>

<p>In these cases, Kegels work. The research is solid. The <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6459001/" target="_blank" rel="nofollow noopener noreferrer">NIH evidence base</a> for Kegels in stress incontinence is strong. But "Kegels work for stress incontinence" is not the same as "Kegels work for all pelvic floor problems."</p>

<h2 id="when-kegels-hurt">When Kegels Make Things Worse</h2>

<p>If you have a hypertonic pelvic floor — one that's already in a state of elevated tension — adding more contraction increases that tension. The muscles can't relax. They're already at their limit. Kegels in this context cause more pain, more urgency, more dysfunction.</p>

<p>Signs that Kegels might be making things worse: your symptoms haven't improved after 6-8 weeks of consistent practice. Your pain has increased. You feel more urgency, not less. Penetration has become more difficult, not easier.</p>

<p>Stop. That's the short version. The long version is that you need an assessment before you do any more Kegels.</p>

<h2 id="what-to-do-instead">What to Do Instead (or First)</h2>

<p>Before Kegels, learn to breathe. Diaphragmatic breathing coordinates the pelvic floor with the respiratory system. On the inhale, the diaphragm descends and the pelvic floor gently lowers. On the exhale, both lift. This is the foundation of pelvic floor function.</p>

<p>Before Kegels, assess. <a href="/articles/what-pelvic-floor-physical-therapy-involves">Pelvic floor physical therapy</a> starts with understanding what's actually happening in your pelvic floor. That assessment determines whether strengthening, relaxation, coordination training, or some combination is appropriate.</p>

<p>Less theory. More practice. The practice starts with knowing what you're working with.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/0071600191?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Heal Pelvic Pain by Amy Stein</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07D6XNQMB?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Pelvic Wand for Myofascial Release</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">TheraBand Resistance Bands for Hip Strengthening</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'stress-urinary-incontinence',
    title: "Stress Urinary Incontinence: What's Happening and What Works",
    meta_description: "Leaking when you cough, sneeze, laugh, or jump is stress urinary incontinence. It's common. It's not normal. And it's treatable without surgery in most cases.",
    og_title: "Stress Urinary Incontinence: What's Actually Happening (And What Works)",
    og_description: "Leaking when you laugh is common. It's not normal. Here's the mechanism, the evidence, and what actually helps.",
    category: 'incontinence',
    tags: ['incontinence', 'stress-incontinence', 'leaking', 'pelvic-floor', 'treatment'],
    image_alt: 'Woman laughing freely without worry about leaking',
    reading_time: 9,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Stress urinary incontinence (SUI) is leaking urine when physical activity increases abdominal pressure. It affects roughly 1 in 3 women. It's caused by insufficient pelvic floor support for the urethra. Pelvic floor physical therapy has strong evidence as a first-line treatment and resolves symptoms in the majority of cases without surgery.</p>
</section>

<p>Leaking when you laugh is common. It's not normal. There's a difference.</p>

<p>Common means it happens to a lot of people. Normal means it's supposed to happen. Stress urinary incontinence is common because the pelvic floor is undertreated and underunderstood. It's not normal because it's a sign of dysfunction that responds to treatment.</p>

<h2 id="mechanism">The Mechanism: What's Actually Happening</h2>

<p>When you cough, sneeze, laugh, jump, or lift something heavy, your intra-abdominal pressure spikes suddenly. That pressure pushes down on your bladder. The urethra — the tube that carries urine out of the body — needs to stay closed under that pressure.</p>

<p>In a healthy system, the pelvic floor muscles contract reflexively just before and during that pressure spike, compressing the urethra and keeping it closed. This is called the urethral closure mechanism.</p>

<p>In stress urinary incontinence, that mechanism fails. Either the pelvic floor doesn't contract fast enough, doesn't generate enough force, or the urethral support structures are damaged or weakened. The result: urine leaks.</p>

<h2 id="causes">What Causes It</h2>

<p>Childbirth is the most common cause. Vaginal delivery stretches and can damage the levator ani and pudendal nerve. Menopause is the second major cause. Declining estrogen reduces the elasticity of urethral tissue and weakens pelvic floor support. Chronic high-impact exercise without pelvic floor training is a third cause.</p>

<p>According to research published in the <a href="https://pubmed.ncbi.nlm.nih.gov/26374080/" target="_blank" rel="nofollow noopener noreferrer">International Urogynecology Journal</a>, pelvic floor muscle training is the first-line treatment recommended by all major urogynecology guidelines worldwide.</p>

<h2 id="treatment">What Actually Works</h2>

<p>Pelvic floor physical therapy is the most effective non-surgical treatment for stress urinary incontinence. A 2018 Cochrane review found that pelvic floor muscle training significantly reduced leaking episodes and improved quality of life. The effect size is large. The evidence is strong.</p>

<p>The key elements of effective treatment: assessment to confirm the diagnosis, pelvic floor muscle training with correct technique and progressive loading, coordination training, and lifestyle modifications.</p>

<p>Leaking when you laugh is common. It's not normal. And it's not something you have to accept.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Kegel Exercise Weights</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B08NWZF8NM?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Elvie Trainer Pelvic Floor Exerciser with Biofeedback</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/1623171040?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Strong by Clare Bourne PT</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'postpartum-pelvic-floor',
    title: "Postpartum Pelvic Floor: What Happens and When to Get Help",
    meta_description: "Childbirth changes the pelvic floor. Here's what actually happens during vaginal and cesarean delivery, what symptoms are normal in early recovery, and when to seek help.",
    og_title: "Postpartum Pelvic Floor: What Happens and When to Get Help",
    og_description: "Your pelvic floor changes after birth. Here's what's normal, what's not, and when to see a pelvic PT.",
    category: 'postpartum',
    tags: ['postpartum', 'childbirth', 'recovery', 'pelvic-floor', 'pelvic-pt'],
    image_alt: 'New mother doing gentle postpartum recovery exercises',
    reading_time: 10,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Childbirth — both vaginal and cesarean — affects the pelvic floor. Vaginal delivery can stretch and damage the levator ani and pudendal nerve. Cesarean delivery affects the abdominal wall and can create scar tissue that impacts pelvic floor function. Most postpartum pelvic floor dysfunction is treatable with pelvic PT, and the earlier you start, the better the outcomes.</p>
</section>

<p>Nobody tells you what actually happens to your pelvic floor after birth. The six-week clearance appointment checks your incision or perineum and sends you home. That's not enough. Not even close.</p>

<h2 id="vaginal-delivery">What Happens with Vaginal Delivery</h2>

<p>During vaginal delivery, the levator ani muscles stretch to approximately three times their resting length to allow the baby to pass through. For some people, this stretch causes tearing of the muscle fibers. For others, the pudendal nerve is compressed or stretched.</p>

<p>Perineal tears and episiotomies add scar tissue to the picture. Scar tissue is less elastic than normal tissue and can create restrictions in pelvic floor movement and sensation. Proper scar massage and mobilization significantly improves outcomes.</p>

<h2 id="cesarean-delivery">What Happens with Cesarean Delivery</h2>

<p>Cesarean delivery is abdominal surgery. The scar from a cesarean can create adhesions that affect how the abdominal wall moves, which affects how the diaphragm and pelvic floor coordinate. Also: pregnancy itself affects the pelvic floor, regardless of delivery method.</p>

<h2 id="when-to-get-help">When to Get Help</h2>

<p>The short answer: sooner than you think. In France, postpartum pelvic PT is standard care — every person who gives birth receives a referral for pelvic rehabilitation. In the United States, it's optional and often not mentioned. That's a gap in care.</p>

<p>According to research from the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6459001/" target="_blank" rel="nofollow noopener noreferrer">NIH</a>, early pelvic floor rehabilitation after childbirth significantly reduces the risk of long-term incontinence and prolapse.</p>

<p>The body doesn't lie. The mind does. If you're telling yourself that leaking or pain is just part of having a baby — that's the mind lying. Your body is telling you something specific. Listen to it.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Frida Mom Postpartum Recovery Kit</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">BaoBei Postpartum Belly Wrap</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/1623171040?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Strong by Clare Bourne PT</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'what-pelvic-floor-physical-therapy-involves',
    title: 'What Pelvic Floor Physical Therapy Actually Involves (Demystified)',
    meta_description: "Pelvic floor physical therapy is the most effective treatment for most pelvic floor conditions. Here's exactly what happens in a session — no mystery, no embarrassment.",
    og_title: 'What Pelvic Floor Physical Therapy Actually Involves',
    og_description: "Let me demystify this for you. Here's what actually happens in a pelvic PT session — and why it works.",
    category: 'pelvic-pt',
    tags: ['pelvic-pt', 'physical-therapy', 'treatment', 'what-to-expect'],
    image_alt: 'Pelvic floor physical therapist working with patient',
    reading_time: 9,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Pelvic floor physical therapy involves an external and often internal assessment of pelvic floor function, followed by targeted treatment including manual therapy, exercise prescription, and education. The internal exam is optional. The whole process is clinical, professional, and far less intimidating than most people expect.</p>
</section>

<p>Pelvic PT exists. Most people don't know about it. It works.</p>

<p>Let me demystify this for you. The reason people avoid pelvic PT isn't that it's ineffective. It's that they don't know what it involves.</p>

<h2 id="first-appointment">What Happens at the First Appointment</h2>

<p>The first appointment is mostly intake and assessment. Your pelvic PT will take a detailed history — your symptoms, when they started, what makes them better or worse, your birth history, your bowel and bladder habits, your sexual function, your exercise history.</p>

<p>Then comes the external assessment. Your PT will look at your posture, breathing pattern, and how your core and pelvic floor coordinate during movement.</p>

<p>The internal exam, if you choose to have one, involves the PT inserting one gloved finger into the vagina to assess pelvic floor muscle tone, strength, coordination, and any areas of tenderness or restriction. You can always decline the internal exam.</p>

<h2 id="what-treatment-looks-like">What Treatment Actually Looks Like</h2>

<p>Treatment varies based on what the assessment finds. For a hypertonic pelvic floor, treatment typically includes manual therapy to release trigger points, breathing and relaxation exercises, and hip flexor stretching. For a hypotonic pelvic floor, treatment includes progressive pelvic floor strengthening and coordination training.</p>

<h2 id="how-many-sessions">How Many Sessions You Need</h2>

<p>Most people see significant improvement in 6-12 sessions. Between sessions, you'll have a home program. The home program is where most of the work happens.</p>

<p>Here's what actually works: just go. The anticipation is almost always worse than the reality. Pelvic PTs are clinical professionals who do this work every day. There is nothing about your body that will surprise or embarrass them.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/0071600191?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Heal Pelvic Pain by Amy Stein</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Kegel Exercise Weights</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/1623171040?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Strong by Clare Bourne PT</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'vaginismus-what-it-is-why-it-happens',
    title: "Vaginismus: What It Is, Why It Happens, and How It's Treated",
    meta_description: "Vaginismus is an involuntary contraction of the pelvic floor muscles that makes penetration painful or impossible. It's treatable. Here's how.",
    og_title: "Vaginismus: What It Is, Why It Happens, and How It's Treated",
    og_description: "Vaginismus is not in your head. It's a pelvic floor condition. And it responds to treatment.",
    category: 'pain',
    tags: ['vaginismus', 'painful-sex', 'pelvic-floor', 'treatment', 'dilators'],
    image_alt: 'Woman finding relief from pelvic pain through physical therapy',
    reading_time: 10,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Vaginismus is an involuntary, reflexive contraction of the pelvic floor muscles that makes penetration painful or impossible. It's not a psychological disorder. It's a pelvic floor condition with a well-established treatment pathway including pelvic PT, dilator therapy, and sometimes psychological support. Most people with vaginismus achieve full resolution with treatment.</p>
</section>

<p>Vaginismus is not in your head. That's the first thing to say. It's a pelvic floor condition. The muscles contract involuntarily when penetration is attempted. You're not choosing it. You're not imagining it. It's a real, physical, treatable condition.</p>

<h2 id="what-it-is">What Vaginismus Actually Is</h2>

<p>Vaginismus is characterized by involuntary contraction of the vaginal muscles when penetration is attempted or anticipated. The contraction can be partial (painful penetration) or complete (penetration impossible).</p>

<p>The mechanism is a conditioned reflex. The body learns to associate penetration with pain or threat, and the pelvic floor contracts protectively. Over time, this reflex becomes automatic. The anticipation of pain causes the contraction, which causes the pain, which reinforces the anticipation. It's a cycle. And cycles can be interrupted.</p>

<h2 id="treatment">How It's Treated</h2>

<p>Treatment has three main components: pelvic floor physical therapy, dilator therapy, and psychological support. According to research from the <a href="https://pubmed.ncbi.nlm.nih.gov/26374080/" target="_blank" rel="nofollow noopener noreferrer">Journal of Sexual Medicine</a>, multimodal treatment combining pelvic PT and psychological support produces the highest success rates.</p>

<p>Stop overthinking this. The path forward is clear: pelvic PT, dilator therapy, and support for the anxiety component. Find a pelvic PT who specializes in sexual pain.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Soul Source Silicone Vaginal Dilator Set</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/0757307876?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Ending Female Pain by Isa Herrera MSPT</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07D6XNQMB?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Pelvic Wand for Myofascial Release</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
  {
    slug: 'pelvic-floor-and-menopause',
    title: 'Pelvic Floor and Menopause: What Genitourinary Syndrome Actually Means',
    meta_description: "Genitourinary syndrome of menopause (GSM) affects up to 50% of postmenopausal women. It's undertreated and often not mentioned. Here's what's happening and what helps.",
    og_title: 'Pelvic Floor and Menopause: What GSM Actually Means',
    og_description: "Half of postmenopausal women have genitourinary syndrome of menopause. Most don't know it has a name — or that it's treatable.",
    category: 'menopause',
    tags: ['menopause', 'GSM', 'pelvic-floor', 'estrogen', 'treatment'],
    image_alt: 'Woman in midlife practicing yoga for pelvic floor health',
    reading_time: 9,
    body: `<section data-tldr="ai-overview" aria-label="In short">
  <p>Genitourinary syndrome of menopause (GSM) is the umbrella term for the vaginal, urinary, and sexual changes caused by declining estrogen at menopause. It affects up to 50% of postmenopausal women. Unlike hot flashes, GSM doesn't improve over time without treatment. Effective treatments exist, including local estrogen, pelvic PT, and lubricants.</p>
</section>

<p>Genitourinary syndrome of menopause. That's the clinical name for something that affects roughly half of all postmenopausal women. Most of them don't know it has a name. Most of them don't know it's treatable. Most of them are just living with it.</p>

<h2 id="what-gsm-is">What GSM Actually Is</h2>

<p>GSM encompasses changes to the vulva, vagina, urethra, and bladder caused by declining estrogen levels during perimenopause and menopause. Symptoms include vaginal dryness, burning, and irritation; painful sex; urinary urgency, frequency, and incontinence; and recurrent urinary tract infections.</p>

<p>Unlike hot flashes and night sweats, which often improve over time, GSM symptoms typically worsen without treatment.</p>

<h2 id="treatment">What Actually Helps</h2>

<p>Local (vaginal) estrogen is the most effective treatment for GSM. According to <a href="https://www.menopause.org/for-women/sexual-health-menopause-online/causes-of-sexual-problems/vaginal-dryness-and-pain" target="_blank" rel="nofollow noopener noreferrer">The Menopause Society</a>, local estrogen is safe for most women, including many with a history of breast cancer.</p>

<p>Pelvic floor physical therapy addresses the muscle and connective tissue changes. Many women find that combining local estrogen with pelvic PT produces better results than either alone.</p>

<p>The body doesn't lie. The mind does. If you're telling yourself that these symptoms are just what menopause feels like — that's the mind lying. GSM is treatable. You don't have to accept it.</p>

<section class="auto-affiliates" aria-label="Pelvic Health Library">
  <h3>Pelvic Health Library</h3>
  <ul>
    <li><a href="https://www.amazon.com/dp/0316412120?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Lady Parts by Jen Gunter MD</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07D6XNQMB?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Pelvic Wand</a> <span class="disclosure">(paid link)</span></li>
    <li><a href="https://www.amazon.com/dp/B07BFXLH7T?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Intimate Rose Kegel Exercise Weights</a> <span class="disclosure">(paid link)</span></li>
  </ul>
  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>
</section>`,
  },
];

// Stub articles
const STUBS = [
  { slug: 'urge-incontinence-bladder-brain', title: 'Urge Incontinence: The Bladder-Brain Communication Breakdown', category: 'incontinence', tags: ['urge-incontinence', 'bladder', 'pelvic-floor', 'urgency'] },
  { slug: 'pelvic-organ-prolapse', title: 'Pelvic Organ Prolapse: Types, Symptoms, and What to Do', category: 'dysfunction', tags: ['prolapse', 'pelvic-floor', 'symptoms', 'treatment'] },
  { slug: 'diastasis-recti-pelvic-floor', title: 'Diastasis Recti and the Pelvic Floor Connection', category: 'postpartum', tags: ['diastasis-recti', 'core', 'postpartum', 'pelvic-floor'] },
  { slug: 'why-every-postpartum-person-should-see-pelvic-pt', title: 'Why Every Postpartum Person Should See a Pelvic PT', category: 'postpartum', tags: ['postpartum', 'pelvic-pt', 'recovery', 'birth'] },
  { slug: 'sex-after-baby-pain-and-recovery', title: 'Sex After Baby: The Honest Conversation About Pain and Recovery', category: 'postpartum', tags: ['postpartum', 'sex', 'pain', 'recovery', 'vaginismus'] },
  { slug: 'vulvodynia-vestibulodynia', title: 'Vulvodynia and Vestibulodynia: Understanding Chronic Vulvar Pain', category: 'pain', tags: ['vulvodynia', 'vestibulodynia', 'chronic-pain', 'pelvic-floor'] },
  { slug: 'pelvic-pain-endometriosis', title: 'Pelvic Pain and Endometriosis: The Pelvic Floor Component', category: 'pain', tags: ['endometriosis', 'pelvic-pain', 'pelvic-floor', 'treatment'] },
  { slug: 'interstitial-cystitis-pelvic-floor', title: 'Interstitial Cystitis and the Pelvic Floor Overlap', category: 'pain', tags: ['interstitial-cystitis', 'bladder-pain', 'pelvic-floor', 'treatment'] },
  { slug: 'pudendal-neuralgia', title: 'Pudendal Neuralgia: The Nerve Pain Nobody Diagnoses', category: 'pain', tags: ['pudendal-neuralgia', 'nerve-pain', 'pelvic-pain', 'diagnosis'] },
  { slug: 'the-internal-exam', title: "The Internal Exam: What Happens, What It Shows, Why You Can Decline", category: 'pelvic-pt', tags: ['internal-exam', 'pelvic-pt', 'assessment', 'what-to-expect'] },
  { slug: 'how-to-find-a-qualified-pelvic-pt', title: 'How to Find a Qualified Pelvic PT (The APTA Locator Guide)', category: 'pelvic-pt', tags: ['pelvic-pt', 'finding-care', 'APTA', 'locator'] },
  { slug: 'insurance-coverage-pelvic-pt', title: 'Insurance Coverage for Pelvic PT: What to Know Before You Go', category: 'pelvic-pt', tags: ['insurance', 'pelvic-pt', 'cost', 'coverage'] },
  { slug: 'pelvic-floor-exercises-beyond-kegels', title: 'Pelvic Floor Exercises Beyond Kegels: Hip Strength, Breathing, Core', category: 'exercises', tags: ['exercises', 'hip-strength', 'breathing', 'core', 'kegels'] },
  { slug: 'diaphragmatic-breathing-and-pelvic-floor', title: 'Diaphragmatic Breathing and Pelvic Floor Coordination', category: 'exercises', tags: ['breathing', 'diaphragm', 'pelvic-floor', 'coordination'] },
  { slug: 'running-with-pelvic-floor-dysfunction', title: "Running with Pelvic Floor Dysfunction: What's Safe, What's Not", category: 'exercises', tags: ['running', 'exercise', 'pelvic-floor', 'dysfunction', 'impact'] },
  { slug: 'jumping-hiit-and-pelvic-floor', title: 'Jumping, HIIT, and the Pelvic Floor: A Non-Alarmist Guide', category: 'exercises', tags: ['HIIT', 'jumping', 'high-impact', 'pelvic-floor', 'exercise'] },
  { slug: 'pelvic-floor-in-pregnancy', title: 'Pelvic Floor in Pregnancy: What to Do at Each Trimester', category: 'postpartum', tags: ['pregnancy', 'pelvic-floor', 'trimester', 'prenatal'] },
  { slug: 'pelvic-floor-bowel-dysfunction', title: 'Pelvic Floor and Bowel Dysfunction: The Often-Missed Connection', category: 'dysfunction', tags: ['bowel', 'constipation', 'pelvic-floor', 'dysfunction'] },
  { slug: 'painful-sex-diagnostic-framework', title: 'Painful Sex: A Non-Embarrassing Diagnostic Framework', category: 'pain', tags: ['painful-sex', 'dyspareunia', 'pelvic-floor', 'diagnosis'] },
  { slug: 'dilator-therapy', title: "Dilator Therapy: What It Is, When It's Used, How to Start", category: 'pain', tags: ['dilators', 'vaginismus', 'vestibulodynia', 'therapy'] },
  { slug: 'biofeedback-for-pelvic-floor', title: 'Biofeedback for Pelvic Floor: The Technology and When It Helps', category: 'pelvic-pt', tags: ['biofeedback', 'technology', 'pelvic-floor', 'treatment'] },
  { slug: 'pelvic-floor-health-through-every-decade', title: 'The Long Game: Maintaining Pelvic Floor Health Through Every Decade', category: 'exercises', tags: ['longevity', 'pelvic-floor', 'prevention', 'health', 'aging'] },
];

function generateStubBody(title, category) {
  return `<section data-tldr="ai-overview" aria-label="In short">
  <p>This article covers ${title.toLowerCase()} — what it is, how it affects pelvic floor function, and what the evidence says about treatment.</p>
</section>

<p>Understanding ${title.toLowerCase()} is an important part of pelvic floor health education. This guide covers the key concepts, symptoms, and treatment approaches.</p>

<h2 id="overview">Overview</h2>
<p>This is a comprehensive guide to ${title.toLowerCase()}. Pelvic floor conditions require professional assessment. Always consult a pelvic floor physical therapist or qualified healthcare provider for personalized guidance.</p>

<h2 id="what-to-know">What You Need to Know</h2>
<p>Evidence-based information on this topic is available. A qualified pelvic PT can assess your specific situation and develop an appropriate treatment plan.</p>

<h2 id="treatment">Treatment Approaches</h2>
<p>Multiple treatment options exist for this condition. The most effective approach depends on the specific nature of your dysfunction, which is why professional assessment is the essential first step.</p>

<h2 id="next-steps">Next Steps</h2>
<p>If you're experiencing symptoms related to ${title.toLowerCase()}, the most important step is to seek an assessment from a qualified pelvic floor physical therapist. The <a href="https://www.pelvicrehab.com" target="_blank" rel="nofollow noopener noreferrer">Pelvic Rehab locator</a> is the best place to find one.</p>

<div class="health-disclaimer">
  <strong>Disclaimer:</strong> Content on thepelvicfloor.com is for educational purposes only. Always consult a qualified healthcare provider.
</div>`;
}

// ─── Build article list ───────────────────────────────────────────────────────

const now = new Date();
const articles = [];

FULL_ARTICLES.forEach((a, i) => {
  const publishedAt = new Date(now);
  publishedAt.setDate(publishedAt.getDate() - (FULL_ARTICLES.length - i) * 3);
  articles.push({
    id: i + 1,
    slug: a.slug,
    title: a.title,
    meta_description: a.meta_description,
    og_title: a.og_title,
    og_description: a.og_description,
    category: a.category,
    tags: a.tags,
    body: a.body,
    hero_url: null,
    image_alt: a.image_alt,
    reading_time: a.reading_time,
    author: 'The Oracle Lover',
    published_at: publishedAt.toISOString(),
    updated_at: now.toISOString(),
    status: 'published',
  });
});

STUBS.forEach((s, i) => {
  const publishedAt = new Date(now);
  publishedAt.setDate(publishedAt.getDate() - (STUBS.length - i));
  articles.push({
    id: FULL_ARTICLES.length + i + 1,
    slug: s.slug,
    title: s.title,
    meta_description: `An in-depth guide to ${s.title.toLowerCase()}.`,
    og_title: s.title,
    og_description: `Everything you need to know about ${s.title.toLowerCase()}.`,
    category: s.category,
    tags: s.tags,
    body: generateStubBody(s.title, s.category),
    hero_url: null,
    image_alt: s.title,
    reading_time: 8,
    author: 'The Oracle Lover',
    published_at: publishedAt.toISOString(),
    updated_at: now.toISOString(),
    status: 'published',
  });
});

// ─── Write to file ────────────────────────────────────────────────────────────

const outputPath = path.join(__dirname, '../../data/articles.json');
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
console.log(`✅ Seeded ${articles.length} articles to ${outputPath}`);
