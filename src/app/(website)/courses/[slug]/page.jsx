"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { toast } from "react-toastify";
import { Clock, Signal, ChevronDown, ArrowLeft } from "lucide-react";

export default function Page({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    if (!slug) {
      console.warn("No slug found in params:", resolvedParams);
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      const { data } = await axios.get(`/api/courses/${slug}`);

      console.log("API response:", data);

      if (data.success && data.data) {
        setCourse(data.data);
      } else {
        setNotFound(true);
        toast.error(data.message || "Course not found");
      }
    } catch (error) {
      console.error("Fetch course error:", error);

      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
        toast.error(
          error.response?.data?.message || "Failed to load course"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 max-w-5xl mx-auto px-6 animate-pulse">
        <div className="h-72 w-full bg-gray-200 rounded-3xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mt-8" />
        <div className="h-4 bg-gray-200 rounded w-full mt-4" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mt-2" />
      </section>
    );
  }

  if (notFound || !course) {
    return (
      <section className="py-32 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Course not found
        </h2>
        <p className="text-gray-500 mt-2">
          It may have been removed or the link is incorrect.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 text-[#1C8BCA] font-semibold hover:underline"
        >
          <ArrowLeft size={16} />
          Back to all courses
        </Link>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C8BCA] transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to courses
        </Link>

        {/* Hero image */}
        <div className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Title & meta */}
        <div className="mt-10">
          <span className="inline-block bg-[#1C8BCA]/10 text-[#1C8BCA] text-xs font-semibold px-3 py-1 rounded-full">
            {course.level}
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4">
            {course.title}
          </h1>

          <p className="mt-4 text-gray-600 leading-7 max-w-3xl">
            {course.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-700">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#1C8BCA]" />
              <span className="font-medium">{course.duration} Months</span>
            </div>

            <div className="flex items-center gap-2">
              <Signal size={18} className="text-[#1C8BCA]" />
              <span className="font-medium">{course.level}</span>
            </div>

            <div className="text-2xl font-bold text-[#1C8BCA]">
              ${course.price}
            </div>
          </div>

          <button className="mt-8 bg-[#1C8BCA] text-white px-8 py-3 rounded-xl font-semibold hover:bg-sky-700 transition">
            Enroll Now
          </button>
        </div>

        {/* Syllabus */}
        {course.syllabus?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Course Syllabus
            </h2>

            <div className="space-y-3">
              {course.syllabus.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() =>
                      setOpenModule(openModule === index ? -1 : index)
                    }
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      Module {index + 1}: {item.module}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-500 transition-transform ${
                        openModule === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openModule === index && (
                    <ul className="px-6 pb-4 space-y-2">
                      {item.topics?.map((topic, tIndex) => (
                        <li
                          key={tIndex}
                          className="text-gray-600 text-sm flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1C8BCA]" />
                          {topic.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}