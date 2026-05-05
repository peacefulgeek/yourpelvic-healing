import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_ASSESSMENTS, Assessment, AssessmentResult } from '../../data/assessments';

type Answers = Record<string, string>;

function computeResult(assessment: Assessment, answers: Answers): AssessmentResult {
  if (assessment.scoringLogic === 'sum') {
    let total = 0;
    for (const q of assessment.questions) {
      const answer = answers[q.id];
      if (!answer) continue;
      const option = q.options.find((o) => o.value === answer);
      if (option?.score !== undefined) total += option.score;
    }
    // Map score to result
    const results = assessment.results;
    if (assessment.id === 'hypertonic-vs-hypotonic') {
      if (total >= 8) return results.find((r) => r.id === 'hypertonic-likely') || results[0];
      if (total <= -2) return results.find((r) => r.id === 'hypotonic-likely') || results[1];
      return results.find((r) => r.id === 'mixed') || results[2];
    }
    if (assessment.id === 'postpartum-readiness') {
      const weeksQ = answers['p1'];
      if (weeksQ === '0-6') return results.find((r) => r.id === 'early-postpartum') || results[2];
      const seePT = Object.values(answers).some((v) => {
        return ['significant', 'see-pt'].includes(v);
      });
      if (total < 8 || seePT) return results.find((r) => r.id === 'not-ready-see-pt') || results[1];
      return results.find((r) => r.id === 'ready-low-impact') || results[0];
    }
    return results[0];
  }

  // Tag-match logic for symptom screener
  const tagCounts: Record<string, number> = {};
  for (const q of assessment.questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const option = q.options.find((o) => o.value === answer);
    if (option?.tags) {
      for (const tag of option.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }

  // Priority: urgent tags first, then highest-count tag
  const urgentTags = ['prolapse', 'postpartum', 'menopause', 'stress-incontinence', 'hypertonic'];
  for (const tag of urgentTags) {
    if (tagCounts[tag] && tagCounts[tag] >= 1) {
      const result = assessment.results.find((r) => r.id === tag || r.id === `${tag}-likely`);
      if (result) return result;
    }
  }

  return assessment.results.find((r) => r.id === 'low-risk') || assessment.results[0];
}

const urgencyConfig = {
  low: { label: 'Low Priority', color: '#7a9e7e', bg: '#f0f5f0' },
  moderate: { label: 'Moderate Priority', color: '#9b6b8a', bg: '#f5f0f4' },
  high: { label: 'High Priority', color: '#c4756b', bg: '#fdf0ee' },
};

export default function AssessmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const assessment = ALL_ASSESSMENTS.find((a) => a.slug === slug);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [started, setStarted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentQ]);

  if (!assessment) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1>Assessment Not Found</h1>
        <Link to="/assessments" className="btn btn--primary">
          View All Assessments
        </Link>
      </main>
    );
  }

  const question = assessment.questions[currentQ];
  const progress = ((currentQ) / assessment.questions.length) * 100;
  const isLast = currentQ === assessment.questions.length - 1;

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      const r = computeResult(assessment, newAnswers);
      setResult(r);
    } else {
      setCurrentQ((q) => q + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  }

  function handleRestart() {
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setStarted(false);
  }

  if (result) {
    const urgency = urgencyConfig[result.urgency];
    return (
      <main className="assessment-result-page">
        <div className="container assessment-result-container">
          <div className="assessment-result">
            {/* Header */}
            <div
              className="assessment-result__header"
              style={{ borderColor: urgency.color }}
            >
              <span
                className="assessment-result__urgency"
                style={{ background: urgency.bg, color: urgency.color }}
              >
                {urgency.label}
              </span>
              <h1 className="assessment-result__title">{result.title}</h1>
            </div>

            {/* Description */}
            <div className="assessment-result__description">
              <p>{result.description}</p>
            </div>

            {/* Recommendations */}
            <div className="assessment-result__recommendations">
              <h2>What to Do Next</h2>
              <ol className="assessment-result__list">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <div className="assessment-result__cta-block">
              <Link to={result.cta.href} className="btn btn--primary btn--large">
                {result.cta.text}
              </Link>
              <button
                onClick={handleRestart}
                className="btn btn--ghost"
              >
                Retake Assessment
              </button>
            </div>

            {/* Related Articles */}
            {result.relatedArticles.length > 0 && (
              <div className="assessment-result__related">
                <h3>Related Reading</h3>
                <ul className="assessment-result__related-list">
                  {result.relatedArticles.map((slug) => (
                    <li key={slug}>
                      <Link to={`/articles/${slug}`}>
                        {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="assessment-result__disclaimer">
              <p>
                <strong>Important:</strong> This assessment is for educational purposes
                only and is not a medical diagnosis. Always consult a qualified healthcare
                provider for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="assessment-intro-page">
        <div
          className="assessment-intro__hero"
          style={{ backgroundImage: `url(${assessment.heroImage})` }}
        >
          <div className="assessment-intro__hero-overlay" />
          <div className="assessment-intro__hero-content">
            <span className="label label--light">Self-Assessment</span>
            <h1>{assessment.title}</h1>
            <p className="lead">{assessment.subtitle}</p>
          </div>
        </div>

        <div className="container">
          <div className="assessment-intro__body">
            <p className="assessment-intro__description">{assessment.description}</p>

            <div className="assessment-intro__meta">
              <div className="assessment-intro__meta-item">
                <span className="assessment-intro__meta-icon">⏱</span>
                <span>{assessment.estimatedTime}</span>
              </div>
              <div className="assessment-intro__meta-item">
                <span className="assessment-intro__meta-icon">❓</span>
                <span>{assessment.questions.length} questions</span>
              </div>
              <div className="assessment-intro__meta-item">
                <span className="assessment-intro__meta-icon">📋</span>
                <span>{assessment.results.length} possible outcomes</span>
              </div>
            </div>

            <div className="assessment-intro__disclaimer">
              <p>
                This is not a medical diagnosis. It's an educational tool to help you
                understand your symptoms and find relevant resources.
              </p>
            </div>

            <button
              className="btn btn--primary btn--large"
              onClick={() => setStarted(true)}
            >
              Start Assessment
            </button>

            <Link to="/assessments" className="assessment-intro__back">
              ← Back to All Assessments
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="assessment-quiz-page">
      <div className="container assessment-quiz-container">
        {/* Progress */}
        <div className="assessment-progress" ref={progressRef}>
          <div className="assessment-progress__header">
            <span className="assessment-progress__label">
              Question {currentQ + 1} of {assessment.questions.length}
            </span>
            <span className="assessment-progress__title">{assessment.title}</span>
          </div>
          <div className="assessment-progress__bar">
            <div
              className="assessment-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="assessment-question">
          <h2 className="assessment-question__text">{question.text}</h2>
          {question.subtext && (
            <p className="assessment-question__subtext">{question.subtext}</p>
          )}

          <div className="assessment-question__options">
            {question.options.map((option) => (
              <button
                key={option.value}
                className={`assessment-option ${
                  answers[question.id] === option.value
                    ? 'assessment-option--selected'
                    : ''
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <span className="assessment-option__indicator" />
                <span className="assessment-option__label">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="assessment-question__nav">
            {currentQ > 0 && (
              <button
                className="btn btn--ghost"
                onClick={handleBack}
              >
                ← Back
              </button>
            )}
            <button
              className="btn btn--ghost assessment-question__restart"
              onClick={handleRestart}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
