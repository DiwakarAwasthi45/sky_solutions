"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/courses");

      if (data.success) {
        setCourses(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Our <span className="text-[#1C8BCA]">Courses</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Professional IT training programs designed for real-world skills and career growth.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading courses...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <Link href={`/courses/${course.slug}`}
                key={course._id}
                className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-500 hover:-translate-y-2"
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#1C8BCA] text-white text-xs px-3 py-1 rounded-full">
                      {course.duration}
                    </span>
                  </div>
                </Link>

                <div className="p-6">
                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="mt-3 text-gray-600 text-sm leading-6">
                    {course.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {course.level}
                    </span>
                    <span className="text-[#1C8BCA] font-bold">
                      {course.price}
                    </span>
                  </div>

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
        )}
      </div>
    </section>
  );
}