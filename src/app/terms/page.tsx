import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-rose-500 hover:underline text-sm">← Back to Home</Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 mt-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800">1. Introduction and Acceptance</h2>
            <p className="text-gray-600">
              Welcome to CoupleUp (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing or using CoupleUp, you agree to be bound by these Terms &amp; Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform. These Terms constitute a legally binding agreement between you and CoupleUp. We reserve the right to modify these Terms at any time, and your continued use of the Platform following any changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">2. Eligibility and Age Requirements</h2>
            <p className="text-gray-600">
              You must be at least 18 years of age to use CoupleUp. By using our Platform, you represent and warrant that you are 18 years of age or older. If we discover or have reason to believe that a user is under 18, we will immediately terminate that account and delete all associated data. Parents or guardians who become aware of a minor using CoupleUp should contact us immediately at support@coupleup.app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">3. Account Registration and Instagram Authentication</h2>
            <p className="text-gray-600">
              CoupleUp uses Instagram OAuth for user authentication. By connecting your Instagram account, you authorise us to access your Instagram username, display name, and profile photo. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must provide accurate and complete information and keep your profile information up-to-date. CoupleUp is not affiliated with or endorsed by Meta Platforms, Inc. or Instagram.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">4. Numerology Matching System</h2>
            <p className="text-gray-600">
              CoupleUp uses a Pythagorean numerology algorithm to calculate compatibility between users based on Life Path Numbers (derived from date of birth), Expression Numbers (derived from full name), and Soul Urge Numbers (derived from vowels in full name). The matching system is provided for entertainment purposes only. Compatibility scores and matches do not constitute professional advice of any kind, including romantic, psychological, or relationship advice. CoupleUp makes no guarantees regarding the accuracy or effectiveness of its numerology-based matching system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">5. User Content and Public Visibility</h2>
            <p className="text-gray-600">
              Your Instagram display name and profile photo will be visible to all CoupleUp users as part of couple pairings displayed in the public feed and leaderboard. By consenting to these Terms, you grant CoupleUp a non-exclusive, royalty-free licence to display your profile information within the Platform for the purposes of matchmaking and the voting feed. You may remove your data at any time by deleting your account via the Settings page. CoupleUp does not sell, rent, or otherwise commercialise your profile photo or display name to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">6. Voting System and Daily Limits</h2>
            <p className="text-gray-600">
              Users may vote for couple pairings in the public feed. Each user is limited to 10 votes per calendar day (UTC). Users may not vote on their own couple pairings. Votes are permanent and cannot be retracted. Attempting to manipulate the voting system through automation, multiple accounts, or any other means is strictly prohibited and may result in immediate account termination. CoupleUp reserves the right to adjust vote counts or remove votes if manipulation is suspected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">7. Prohibited Conduct</h2>
            <p className="text-gray-600">
              You agree not to: (a) impersonate any person or entity or misrepresent your affiliation with any person or entity; (b) harass, abuse, threaten, or intimidate other users; (c) upload or transmit any content that is unlawful, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable; (d) attempt to gain unauthorised access to any portion of the Platform or its related systems; (e) use automated scripts, bots, or other tools to interact with the Platform; (f) use the Platform for any commercial purpose without our express written consent; (g) violate any applicable local, national, or international law or regulation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">8. Reporting and Content Moderation</h2>
            <p className="text-gray-600">
              Users may report couple pairings that they believe violate these Terms. CoupleUp reserves the right to remove any content and deactivate any account that violates these Terms or that we determine, in our sole discretion, is harmful to the Platform or its users. Couple pairings that receive 5 or more pending reports may be automatically hidden pending review. CoupleUp is not obligated to monitor all content on the Platform but reserves the right to do so.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">9. Data Retention and Deletion</h2>
            <p className="text-gray-600">
              You may request deletion of your account and associated data at any time through the Settings page. Upon account deletion, your profile will be anonymised (display name replaced with &quot;[Deleted User]&quot;), your couple pairings will be deactivated, and your personally identifiable information will be removed from active systems. Consent records, vote records, and anonymised data may be retained for legal compliance purposes. Please see our Privacy Policy for full details on data retention.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">10. Intellectual Property</h2>
            <p className="text-gray-600">
              The CoupleUp platform, including its design, algorithms, text, graphics, and code (excluding user-provided content), is owned by CoupleUp and protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Platform without express written permission. The CoupleUp name and logo are trademarks of CoupleUp. Other trademarks mentioned on the Platform are the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">11. Disclaimers and Limitation of Liability</h2>
            <p className="text-gray-600">
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, COUPLEUP DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. COUPLEUP DOES NOT GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. IN NO EVENT SHALL COUPLEUP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">12. Governing Law and Contact</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. If you have any questions about these Terms, please contact us at legal@coupleup.app. For data protection queries, contact our Data Protection Officer at dpo@coupleup.app.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
