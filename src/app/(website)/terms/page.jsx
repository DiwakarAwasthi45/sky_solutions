import Link from 'next/link'

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By using the Sky Solutions Computer Institute website or enrolling in any course, you agree to these terms and conditions. If you do not agree, please do not use our services.',
    ],
  },
  {
    title: '2. Enrollment & Fees',
    body: [
      '• Course admission is confirmed after the enrollment form is submitted and the applicable fee is paid.',
      '• Fees, schedules, and course content may be updated by the institute as necessary.',
      '• Refund policies are handled on a case-by-case basis in accordance with institute policy. Please contact the office for details.',
    ],
  },
  {
    title: '3. Student Responsibilities',
    body: [
      'Students are expected to attend classes regularly, complete assignments, and follow the institute code of conduct. Misbehavior or damage to institute property may lead to disciplinary action.',
    ],
  },
  {
    title: '4. Courses & Schedules',
    body: [
      '• Class schedules and batch timings are announced by the institute and may change with prior notice.',
      '• The institute reserves the right to cancel or reschedule a batch if the minimum number of students is not met.',
    ],
  },
  {
    title: '5. Certificates',
    body: [
      'Certificates are awarded to students who complete the course requirements and pass the final assessment. Certificates remain the property of the institute and can be verified by employers or institutions on request.',
    ],
  },
  {
    title: '6. Intellectual Property',
    body: [
      'All course materials, syllabus content, and website content are the property of Sky Solutions Computer Institute and may not be copied, resold, or redistributed without written permission.',
    ],
  },
  {
    title: '7. Website Use',
    body: [
      'You agree to use this website lawfully and not to attempt unauthorized access, disrupt services, or misuse any content or functionality of the site.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'The institute is not liable for any indirect or consequential loss arising from the use of our services, training outcomes, or this website. Our total liability is limited to the fees paid by you for the relevant service.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These terms are governed by the laws of Nepal. Any disputes shall be subject to the jurisdiction of the courts of Kanchanpur, Nepal.',
    ],
  },
  {
    title: '10. Contact',
    body: [
      'For questions regarding these terms, contact Sky Solutions Computer Institute, Bedkot Nagarpalika-3, Shamadaiji, Kanchanpur, Nepal. Email: Skysolutions1987@gmail.com, Phone: +977-9867868324.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            Terms & Conditions
          </span>
          <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl leading-tight">
            Terms of <span className="text-yellow-300">Service</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-blue-100">
            Please read these terms carefully before using our website or enrolling
            in a course. Effective date: 1 August 2083.
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
            <h2 className="text-xl font-bold">Questions About These Terms?</h2>
            <p className="mt-3 text-blue-100">
              Contact our office and we will be happy to assist you.
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
