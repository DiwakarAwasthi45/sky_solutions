'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  FileCheck,
  Award,
  BadgeCheck,
  Download,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ResultsPage() {
  const [rollNo, setRollNo] = useState('')
  const [searching, setSearching] = useState(false)

  const handleCheck = (e) => {
    e.preventDefault()
    if (!rollNo.trim()) {
      toast.error('Please enter your enrollment / roll number')
      return
    }
    setSearching(true)
    setTimeout(() => {
      setSearching(false)
      toast.info(
        'Online result portal is under maintenance. Please contact the institute office for your results.'
      )
    }, 800)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20 lg:py-24">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            Student Results
          </span>
          <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl md:text-6xl leading-tight">
            Check Your
            <span className="block text-yellow-300">Results & Certificates</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
            Find out how to access your course results, grade cards, and completion
            certificates after finishing your training at Sky Solutions.
          </p>
        </div>
      </section>

      {/* RESULT CHECKER */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C8BCA]/10">
                <Search size={32} className="text-[#1C8BCA]" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Result Inquiry
              </h2>
              <p className="mt-3 text-gray-600">
                Enter your enrollment / roll number to check your result.
              </p>
            </div>

            <form onSubmit={handleCheck} className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. SS-2083-0012"
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-[#1C8BCA]"
              />
              <button
                type="submit"
                disabled={searching}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C8BCA] px-8 py-4 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                {searching ? 'Checking...' : 'Check Result'}
                {!searching && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Can't remember your number? Call{' '}
              <a href="tel:+9779867868324" className="font-semibold text-[#1C8BCA]">
                +977-9867868324
              </a>{' '}
              for assistance.
            </p>
          </div>
        </div>
      </section>

      {/* HOW RESULTS WORK */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
              How It Works
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Your Result Process at <span className="text-[#1C8BCA]">Sky Solutions</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 text-center transition duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C8BCA]/10">
                <FileCheck size={32} className="text-[#1C8BCA]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Final Assessment</h3>
              <p className="mt-4 leading-7 text-gray-600">
                After completing the course syllabus, students appear for a final
                written and practical assessment covering all trained topics.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 text-center transition duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/20">
                <Award size={32} className="text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Grading</h3>
              <p className="mt-4 leading-7 text-gray-600">
                Results are graded as Excellent, Very Good, Good, or Average based on
                practical skills, assignments, and exam performance.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 text-center transition duration-500 hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <BadgeCheck size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Certificate</h3>
              <p className="mt-4 leading-7 text-gray-600">
                Successful students receive a verified completion certificate that
                recognizes their skills and supports their career journey.
              </p>
            </div>
          </div>

          {/* INFO CARDS */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-[#1C8BCA] p-8 text-white shadow-xl">
              <ShieldCheck size={32} className="mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold">Certificate Verification</h3>
              <p className="mt-3 leading-7 text-blue-100">
                Employers and institutions can verify the authenticity of certificates
                by contacting our office or requesting verification via email.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-dashed border-gray-300 p-8 text-center">
              <Download size={32} className="mx-auto mb-4 text-[#1C8BCA]" />
              <h3 className="text-xl font-bold text-gray-900">Download Grade Card</h3>
              <p className="mt-3 leading-7 text-gray-600">
                Your grade card and certificate are issued at the institute. A digital
                copy can be shared to your email upon request.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#1C8BCA] px-6 py-3 font-semibold text-[#1C8BCA] transition hover:bg-[#1C8BCA] hover:text-white"
              >
                Request a Copy
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-3xl bg-slate-50 p-8 text-center border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Need help with your result?</h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Visit the institute office with your enrollment ID or call us and we
              will resolve your query right away.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+9779867868324"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1C8BCA] px-7 py-3.5 font-semibold text-white transition hover:bg-sky-700"
              >
                <Phone size={18} />
                +977-9867868324
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1C8BCA] px-7 py-3.5 font-semibold text-[#1C8BCA] transition hover:bg-[#1C8BCA] hover:text-white"
              >
                Contact Office
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
