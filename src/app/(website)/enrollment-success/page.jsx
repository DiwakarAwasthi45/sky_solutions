"use client";

import Link from "next/link";
import { CheckCircle2, Home, GraduationCap, ArrowRight } from "lucide-react";

export default function EnrollmentSuccessPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center px-5">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2
              size={60}
              className="text-green-600"
            />
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mt-8">
          Enrollment Successful!
        </h1>

        <p className="text-gray-600 mt-5 leading-8">
          Thank you for enrolling at
          <span className="font-semibold text-sky-600">
            {" "}Sky Solution Computer Institute
          </span>.
        </p>

        <p className="text-gray-500 mt-3">
          We have received your application successfully.
          Our team will contact you shortly regarding your class schedule and further process.
        </p>

        <div className="mt-8 bg-sky-50 rounded-2xl p-6 border border-sky-100">
          <div className="flex items-center justify-center gap-2 text-sky-700 font-semibold">
            <GraduationCap size={22} />
            Next Steps
          </div>

          <ul className="mt-5 space-y-3 text-left text-gray-600">
            <li>✅ Our team will review your application.</li>
            <li>✅ You will receive a confirmation call/email.</li>
            <li>✅ Visit the institute on your scheduled date.</li>
            <li>✅ Start your learning journey.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <Link
            href="/"
            className="flex-1 flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl py-3 font-semibold transition"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/courses"
            className="flex-1 flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold transition"
          >
            View Courses
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    </section>
  );
}