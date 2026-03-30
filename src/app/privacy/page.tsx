import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-rose-500 hover:underline text-sm">← Back to Home</Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mt-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800">1. Who We Are</h2>
            <p className="text-gray-600">
              CoupleUp (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the social matchmaking platform available at coupleup.app. We are the data controller responsible for your personal data. For data protection matters, contact us at dpo@coupleup.app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">2. Data We Collect</h2>
            <p className="text-gray-600">We collect the following categories of personal data:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
              <li><strong>Identity Data:</strong> Instagram user ID, username, display name</li>
              <li><strong>Profile Data:</strong> Profile photo URL (sourced from Instagram)</li>
              <li><strong>Numerology Data:</strong> Full birth name (used for calculation only, not displayed publicly), date of birth, calculated Life Path Number, Expression Number, and Soul Urge Number</li>
              <li><strong>Preference Data:</strong> Gender identity, matching preferences, relationship goals, city, age, personality type</li>
              <li><strong>Consent Data:</strong> Timestamp of consent, IP address at time of consent, user agent string, T&amp;C version accepted</li>
              <li><strong>Usage Data:</strong> Votes cast, reports submitted, last active timestamp</li>
              <li><strong>Technical Data:</strong> IP address (for consent logging and fraud prevention), browser user agent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">3. How We Use Your Data</h2>
            <p className="text-gray-600">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
              <li>To authenticate you via Instagram OAuth and maintain your account</li>
              <li>To calculate your numerological profile and match you with compatible users</li>
              <li>To display your couple pairings in the public feed and leaderboard</li>
              <li>To enforce daily vote limits and prevent abuse</li>
              <li>To record your consent for legal compliance purposes</li>
              <li>To investigate reports of inappropriate content or conduct</li>
              <li>To improve our matching algorithm and platform features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">4. Legal Basis for Processing</h2>
            <p className="text-gray-600">
              We process your personal data under the following legal bases under UK GDPR: (a) <strong>Consent</strong> — for displaying your profile publicly and processing your numerology data; (b) <strong>Contract</strong> — to provide the matchmaking and voting services you have requested; (c) <strong>Legitimate Interests</strong> — for fraud prevention, security, and platform improvement; (d) <strong>Legal Obligation</strong> — to maintain consent records as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">5. Data Sharing</h2>
            <p className="text-gray-600">
              We do not sell your personal data to third parties. We may share your data with: (a) our hosting and infrastructure providers (who process data on our behalf under data processing agreements); (b) law enforcement or regulatory authorities where required by law; (c) other users of the Platform — specifically, your display name and profile photo are visible to all registered users as part of couple pairings. Your full birth name, date of birth, and IP address are never shared publicly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">6. Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal data for as long as your account is active. Upon account deletion: profile information is anonymised within 30 days; consent records are retained for 7 years for legal compliance; anonymised usage statistics (vote counts, match scores) may be retained indefinitely for research purposes. You may request a copy of your data or ask for specific data to be deleted by contacting dpo@coupleup.app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">7. Your Rights</h2>
            <p className="text-gray-600">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Rectification</strong> — ask us to correct inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your personal data (exercisable via Settings &gt; Delete Account)</li>
              <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong>Restriction</strong> — ask us to restrict processing of your data in certain circumstances</li>
              <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent</strong> — withdraw your consent at any time, which will not affect the lawfulness of prior processing</li>
            </ul>
            <p className="text-gray-600 mt-2">To exercise any of these rights, contact dpo@coupleup.app. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">8. Cookies and Tracking</h2>
            <p className="text-gray-600">
              CoupleUp uses session cookies necessary for authentication and security. We use NextAuth.js session tokens stored in HTTP-only cookies. We do not use third-party tracking cookies or advertising networks. Analytics, if used, are privacy-preserving and do not include personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">9. Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include encrypted data transmission (HTTPS), HTTP-only session cookies, parameterised database queries to prevent SQL injection, and access controls limiting who can view sensitive data. No security system is impenetrable, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">10. International Transfers</h2>
            <p className="text-gray-600">
              Your data is stored and processed in the European Economic Area (EEA) or the United Kingdom. If we transfer data outside these regions, we ensure appropriate safeguards are in place in accordance with UK GDPR, such as Standard Contractual Clauses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">11. Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              CoupleUp is not directed at individuals under 18 years of age. We do not knowingly collect personal data from anyone under 18. If you believe a child has provided us with personal data, please contact us at dpo@coupleup.app and we will delete such data promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">12. Contact and Complaints</h2>
            <p className="text-gray-600">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer at dpo@coupleup.app. If you are dissatisfied with our response, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk or by calling 0303 123 1113.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
