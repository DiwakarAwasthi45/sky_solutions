import Link from 'next/link'

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'When you use our website or enroll in a course, we may collect the following information:',
      '• Your name, phone number, email address, and address',
      '• Course enrollment and academic records',
      '• Information you provide through contact and enrollment forms',
      '• Technical data such as browser type and pages visited (for improving our website)',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use the information we collect to:',
      '• Process course enrollments and manage your student records',
      '• Communicate class schedules, results, and important announcements',
      '• Respond to your enquiries and provide support',
      '• Improve our courses, services, and website experience',
    ],
  },
  {
    title: '3. Information Sharing',
    body: [
      'We do not sell, trade, or rent your personal information to third parties. Your data is shared only:',
      '• With our staff who need it to provide training and services',
      '• When required by law or to protect our legal rights',
      '• With your consent, for example when verifying certificates with employers',
    ],
  },
  {
    title: '4. Data Security',
    body: [
      'We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Data Retention',
    body: [
      'We retain student records for as long as necessary to provide services, issue certificates, and comply with legal obligations. You may request deletion of your personal data where applicable by contacting us.',
    ],
  },
  {
    title: '6. Cookies & Analytics',
    body: [
      'Our website may use cookies and similar technologies to improve functionality and understand how visitors use the site. You can disable cookies in your browser settings; however, some features may not work correctly.',
    ],
  },
  {
    title: '7. Your Rights',
    body: [
      'You have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact us at the details below and we will respond within a reasonable time.',
    ],
  },
  {
    title: "8. Children's Privacy",
    body: [
      'Our services are intended for students of all ages, and for minors, consent of a parent or guardian is required at the time of enrollment. We do not knowingly collect personal information without guardian consent.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    body: [
      'We may update this privacy policy from time to time. The latest version will always be published on this page with the effective date shown below.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            Privacy Policy
          </span>
          <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl leading-tight">
            Your Privacy <span className="text-yellow-300">Matters</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-blue-100">
            This policy explains how Sky Solutions Computer Institute collects, uses,
            and protects your personal information. Effective date: 1 August 2083.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                <div className="mt-4 space-y-2">
                  {section.body.map((line, i) => (
                    <p key={i} className="leading-7 text-gray-600">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#1C8BCA] p-8 text-center text-white shadow-xl">
            <h2 className="text-xl font-bold">Contact Us About Privacy</h2>
            <p className="mt-3 text-blue-100">
              For any questions about this policy, reach us at Skysolutions1987@gmail.com
              or call +977-9867868324.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-xl bg-white px-7 py-3 font-semibold text-[#1C8BCA] transition hover:-translate-y-1"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
