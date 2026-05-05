import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_ASSESSMENTS } from '../../data/assessments';

const urgencyColors: Record<string, string> = {
  low: 'var(--sage)',
  moderate: 'var(--mauve)',
  high: 'var(--dusty-rose)',
};

export default function AssessmentsPage() {
  return (
    <main className="assessments-page">
      {/* Hero */}
      <section className="assessments-hero">
        <div className="container">
          <div className="assessments-hero__content">
            <span className="label">Self-Assessment Tools</span>
            <h1>Know Your Pelvic Floor</h1>
            <p className="lead">
              These are not diagnoses. They're starting points. Answer honestly, get a
              personalized summary of what your symptoms might indicate, and find out
              what to do next.
            </p>
            <p className="assessments-hero__disclaimer">
              Always consult a qualified healthcare provider for diagnosis and treatment.
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Cards */}
      <section className="assessments-grid-section">
        <div className="container">
          <div className="assessments-grid">
            {ALL_ASSESSMENTS.map((assessment) => (
              <article key={assessment.id} className="assessment-card">
                <div
                  className="assessment-card__image"
                  style={{ backgroundImage: `url(${assessment.heroImage})` }}
                >
                  <div className="assessment-card__image-overlay" />
                  <span className="assessment-card__time">
                    {assessment.estimatedTime}
                  </span>
                </div>
                <div className="assessment-card__body">
                  <h2 className="assessment-card__title">{assessment.title}</h2>
                  <p className="assessment-card__subtitle">{assessment.subtitle}</p>
                  <p className="assessment-card__description">{assessment.description}</p>
                  <div className="assessment-card__meta">
                    <span className="assessment-card__questions">
                      {assessment.questions.length} questions
                    </span>
                    <span className="assessment-card__results">
                      {assessment.results.length} possible outcomes
                    </span>
                  </div>
                  <Link
                    to={`/assessments/${assessment.slug}`}
                    className="btn btn--primary assessment-card__cta"
                  >
                    Take the Assessment
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Educational note */}
          <div className="assessments-note">
            <div className="assessments-note__inner">
              <h3>A Note on Self-Assessment</h3>
              <p>
                These tools are designed to help you understand your symptoms and find
                relevant educational content. They are not diagnostic tools and cannot
                replace a professional assessment from a qualified pelvic floor physical
                therapist or healthcare provider.
              </p>
              <p>
                If you're experiencing significant symptoms — pain, significant leaking,
                prolapse symptoms, or anything that's affecting your quality of life —
                please seek professional care. The{' '}
                <a
                  href="https://www.pelvicrehab.com"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Pelvic Rehab locator
                </a>{' '}
                is the best place to find a qualified pelvic PT near you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
