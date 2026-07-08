"use client";

import Link from "next/link";
import { Courses } from "../Data";

export default function page() {
  return (
    <section className="py-24 bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Our <span className="text-[#1C8BCA]">Courses</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Professional IT training programs designed for real-world skills and career growth.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {Courses.map((course) => (
            <Link href={`/courses/${course.slug}`}
              key={course.id}
              className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-500 hover:-translate-y-2"
            >

              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Badge */}
                <span className="absolute top-4 left-4 bg-[#1C8BCA] text-white text-xs px-3 py-1 rounded-full">
                  {course.duration}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
                  {course.title}
                </h3>

                <p className="mt-3 text-gray-600 text-sm leading-6">
                  {course.description}
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between">

                  <span className="text-sm font-semibold text-gray-700">
                    {course.level}
                  </span>

                  <span className="text-[#1C8BCA] font-bold">
                    {course.price}
                  </span>
                </div>

                {/* Button */}
                <Link
                  href={`/courses/${course.slug}`}
                  className="mt-6 inline-flex items-center justify-center w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
                >
                  View Details
                </Link>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}
