"use client";

import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BadgeCheck,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Courses } from "@/app/(website)/Data";

export default function page() {
  
      const { slug } = useParams();
   const course = Courses.find((item) => item.slug === slug);

  if (!course) return notFound();

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* BACK BUTTON */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[#1C8BCA] font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* IMAGE (SAFE - no next/image errors) */}
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-[380px] object-cover hover:scale-105 transition duration-700"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {course.title}
            </h1>

            {/* META */}
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock size={16} className="text-[#1C8BCA]" />
                {course.duration}
              </span>

              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <BadgeCheck size={16} className="text-[#1C8BCA]" />
                {course.level}
              </span>

              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Tag size={16} className="text-[#1C8BCA]" />
                {course.price}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-lg text-gray-600 leading-8">
              {course.description}
            </p>

            {/* WHAT YOU WILL LEARN */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                What You Will Learn
              </h2>
              <p className="mt-3 text-gray-600">
                Practical, job-ready training with real-world IT skills and hands-on practice.
              </p>
            </div>

            {/* SYLLABUS */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Syllabus
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">

                {course.syllabus?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                  >
                    <CheckCircle2 className="text-[#1C8BCA] mt-1" size={18} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}

                {!course.syllabus?.length && (
                  <p className="text-gray-500">Syllabus coming soon...</p>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:sticky lg:top-20 h-fit space-y-6">

            {/* COURSE CARD */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Course Details
              </h3>

              <div className="mt-4 space-y-3 text-gray-600">
                <p> Duration: {course.duration}</p>
                <p> Level: {course.level}</p>
                <p> Price: {course.price}</p>
              </div>

              <Link
                href="/enrollment"
                className="mt-6 block text-center bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
              >
                Enroll Now
              </Link>
            </div>

            {/* INFO BOX */}
            <div className="bg-gradient-to-r from-[#1C8BCA] to-sky-600 text-white p-6 rounded-3xl">
              <h3 className="text-lg font-bold">
                Start Your IT Career Today
              </h3>
              <p className="mt-2 text-white/80 text-sm">
                Get practical skills, expert guidance, and job-ready training.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}