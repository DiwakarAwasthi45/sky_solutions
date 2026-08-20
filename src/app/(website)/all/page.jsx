"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch courses
      const coursesRes = await axios.get("/api/courses");
      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }

      // Fetch services
      const servicesRes = await axios.get("/api/services");
      if (servicesRes.data.success) {
        setServices(servicesRes.data.data);
      }

      // Fetch gallery
      const galleryRes = await axios.get("/api/gallery");
      if (galleryRes.data.success) {
        setGallery(galleryRes.data.data);
      }

      // Fetch enrollments (public enrollment form data)
      const enrollmentsRes = await axios.get("/api/enrollments");
      if (enrollmentsRes.data.success) {
        setEnrollments(enrollmentsRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load all data:", error);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1877AE] via-[#1C8BCA] to-[#0E5A84] py-24">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-block rounded-full bg-white/20 px-5 py-2 font-semibold text-white backdrop-blur">
            Sky Solutions Institute
          </span>

          <h1 className="mt-6 text-5xl font-black text-white md:text-6xl">
            Complete Education Portal
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-blue-100">
            Explore our courses, services, gallery, and enrollment opportunities
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1877AE]">
              Our Courses
            </span>

            <h2 className="mt-5 text-4xl font-black text-gray-900 md:text-5xl">
              Professional IT Training
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Professional IT training programs designed for real-world skills and career growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-3">
                <LoadingSpinner fullPage text="Loading courses..." />
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-3 py-20 text-center text-xl font-semibold">
                No Courses Found
              </div>
            ) : courses.map((course) => (
              <Link
                href={`/courses/${course.slug}`}
                key={course._id}
                className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-500 hover:-translate-y-2"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 bg-[#1C8BCA] text-white text-xs px-3 py-1 rounded-full">
                    {course.duration}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
                    {course.title}
                  </h3>

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
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1877AE]">
              Our Services
            </span>

            <h2 className="mt-5 text-4xl font-black text-gray-900 md:text-5xl">
              IT Services
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-600">
              Professional IT services designed to support individuals, businesses, schools, colleges, and government organizations.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-3">
                <LoadingSpinner fullPage text="Loading services..." />
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-3 py-20 text-center text-xl font-semibold">
                No Services Found
              </div>
            ) : services.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                key={service._id}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={service.image || "/placeholder.jpg"}
                    alt={service.title}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute left-5 top-5 rounded-full bg-[#1877AE] px-4 py-2 text-sm font-semibold text-white">
                    IT Service
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 transition group-hover:text-[#1877AE]">
                    {service.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                    {service.shortDescription}
                  </p>

                  <span className="mt-8 inline-flex items-center gap-2 font-semibold text-[#1877AE] transition-all group-hover:gap-3">
                    Learn More
                    <svg
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 18l6-6-6-6m5 3l1-3-3 5 6-3m6 6l-6 6 6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Gallery
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our recent projects and events
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3">
                <LoadingSpinner fullPage text="Loading gallery..." />
              </div>
            ) : gallery.length === 0 ? (
              <div className="col-span-3 py-20 text-center text-xl font-semibold">
                No Gallery Items Found
              </div>
            ) : gallery.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={item.imageUrl || "/placeholder.jpg"}
                  alt={item.title || "Gallery"}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title || "Gallery Item"}
                  </h3>

                  <p className="mt-2 text-gray-600 text-sm">
                    {item.description || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollments */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Recent Enrollments
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Students currently enrolled
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No enrollments found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {enrollments.slice(0, 6).map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                      <span className="text-sky-600 font-bold text-xs">
                        {(enrollment.fullName || "U")[0]}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {enrollment.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enrollment.batch || "N/A"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    {enrollment.course?.title || "N/A"} · {enrollment.status}
                  </p>
                </div>
              ))
            }
            </div>
          )}
        </div>
      </section>
    </main>
  );
}