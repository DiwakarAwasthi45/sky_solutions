"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { toast } from "react-toastify";
import { Clock, Signal, ChevronDown, ArrowLeft, GraduationCap, CalendarRange, DollarSign } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageHero from "@/components/PageHero";

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
      <section className="py-24 max-w-5xl mx-auto px-6">
        <LoadingSpinner fullPage text="Loading course..." />
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
    <>
      <PageHero
        badge={`${course.level} Course`}
        title={course.title}
        description={course.description}
      >
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
            <Clock size={16} className="text-yellow-300" />
            {course.duration} Months
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
            <Signal size={16} className="text-yellow-300" />
            {course.level}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
            <DollarSign size={16} className="text-yellow-300" />
            ${course.price}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/enrollment"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 font-semibold text-[#146A9A] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            Enroll Now
            <GraduationCap size={18} />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            All Courses
          </Link>
        </div>
      </PageHero>

      <section className="py-24 bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Course image */}
        <div className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
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
    </>
  );
}