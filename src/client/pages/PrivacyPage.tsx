export function PrivacyPage() {
  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #2D1B2E 0%, #4A2550 100%)',
          padding: 'var(--space-24) 0 var(--space-16)',
        }}
      >
        <div className="content-width" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'white',
          }}>
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="article-body" style={{ paddingTop: 'var(--space-16)' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <h2>Overview</h2>
        <p>
          The Pelvic Floor ("we," "our," or "us") operates thepelvicfloor.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our site.
        </p>

        <h2>Amazon Associates Disclosure</h2>
        <p>
          The Pelvic Floor is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
        </p>
        <p>
          As an Amazon Associate, we earn from qualifying purchases. When you click on an Amazon affiliate link on this site (marked with "(paid link)"), we may earn a commission at no additional cost to you. This does not influence our editorial content or product recommendations.
        </p>

        <h2>Health Disclaimer</h2>
        <p>
          Content on thepelvicfloor.com is for educational purposes only. Pelvic floor conditions require professional assessment. Nothing on this site constitutes medical advice. Always consult a pelvic floor physical therapist or qualified healthcare provider before beginning any treatment or exercise program.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect minimal data. When you use our pelvic floor assessment tool, we may store your anonymized responses to improve the tool. We do not collect your name, email address, or any personally identifiable information unless you voluntarily provide it.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use privacy-respecting analytics to understand how visitors use the site. This data is aggregated and does not identify individual users.
        </p>

        <h2>Cookies</h2>
        <p>
          This site uses minimal cookies necessary for basic functionality. We do not use advertising cookies or third-party tracking cookies.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          This site contains links to third-party websites, including Amazon.com and theoraclelover.com. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          This site is not directed at children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this privacy policy? Visit <a href="https://theoraclelover.com" target="_blank" rel="noopener noreferrer">theoraclelover.com</a>.
        </p>
      </div>
    </>
  );
}
export default PrivacyPage;
