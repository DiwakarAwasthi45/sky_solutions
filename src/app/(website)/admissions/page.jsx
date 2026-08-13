'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  FileText,
  Phone,
  CreditCard,
  GraduationCap,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: 'Enquiry & Counseling',
    description:
      'Visit our institute or call us to discuss your goals. Our counselors help you choose the right course based on your level and career objectives.',
  },
  {
    icon: FileText,
    title: 'Fill the Enrollment Form',
    description:
      'Complete the online enrollment form or collect a form from our office. Submit your basic details and choose your preferred batch.',
  },
  {
    icon: CreditCard,
    title: 'Pay the Admission Fee',
    description:
      'Pay the course admission fee at our office by cash or bank transfer. An official receipt and enrollment ID will be provided.',
  },
  {
    icon: GraduationCap,
    title: 'Start Your Classes',
    description:
      'Join your batch on the scheduled date. Receive your syllabus, class schedule, and access to our computer lab and learning resources.',
  },
]

const faqs = [
  {
    q: 'What is the minimum age to enroll?',
    a: 'Students who have completed SEE (Class 10) can join most courses. For basic computer courses, no specific qualification is required.',
  },
  {
    q: 'Do you provide certificates?',
    a: 'Yes. After completing a course and passing the final assessment, students receive a verified certificate from Sky Solutions Computer Institute.',
  },
  {
    q: 'Can I choose my own class schedule?',
    a: 'Yes. We offer morning, day, and evening batches. You can select a schedule that fits your school, college, or job timing.',
  },
  {
    q: 'What happens if I miss a class?',
    a: 'You can attend the missed topic in the next batch free of cost. We also provide practical materials for self-practice.',
  },
  {
    q: 'Do you offer practical training on real projects?',
    a: 'Absolutely. Our training is hands-on. You work on real projects and assignments so you gain confidence for the job market.',
  },
  {
    q: 'Can I pay the course fee in installments?',
    a: 'Yes, for longer professional courses we offer installment options. Please discuss the details with our office.',
  },
]

export default function AdmissionsPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20 lg:py-24">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            Admissions 2083
          </span>
          <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl md:text-6xl leading-tight">
            Admission Process
            <span className="block text-yellow-300">Made Simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
            Join Sky Solutions Computer Institute in a few easy steps. Choose your course,
            complete the form, and start building your IT career.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/enrollment"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#146A9A] shadow-xl transition hover:-translate-y-1"
            >
              Enroll Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <Phone size={18} />
              +977-9867868324
            </Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
              How It Works
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-gray-900">
              4 Simple Steps to <span className="text-[#1C8BCA]">Get Started</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative rounded-3xl bg-white p-8 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <span className="absolute right-6 top-6 text-5xl font-black text-sky-100 group-hover:text-sky-200 transition">
                  {i + 1}
                </span>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C8BCA]/10">
                  <step.icon size={32} className="text-[#1C8BCA]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-4 leading-7 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
              FAQ
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Frequently Asked <span className="text-[#1C8BCA]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const open = openIndex === i
              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    open
                      ? 'border-[#1C8BCA]/40 bg-white shadow-lg'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#1C8BCA] transition-transform duration-300 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-6 pb-6">
                      <p className="leading-7 text-gray-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-12 rounded-3xl bg-[#1C8BCA] p-8 text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold">Still have questions?</h3>
            <p className="mt-3 text-blue-100">
              Our team is happy to help you choose the right course and batch.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#1C8BCA] transition hover:-translate-y-1"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
