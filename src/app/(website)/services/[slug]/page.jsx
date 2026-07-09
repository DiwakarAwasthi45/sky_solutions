"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Clock,
} from "lucide-react";

export default function page() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchService();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setNotFoundFlag(false);

      // slug can be a string or an array (catch-all routes) — normalize it
      const slugParam = Array.isArray(slug) ? slug[0] : slug;

      const { data } = await axios.get(`/api/services/${slugParam}`);

      if (data?.success && data?.data) {
        setService(data.data);
      } else {
        toast.error(data?.message || "Service not found");
        setNotFoundFlag(true);
      }
    } catch (error) {
      console.error(error);
      // Distinguish "not found" (404) from real network/server errors
      if (error?.response?.status === 404) {
        setNotFoundFlag(true);
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong loading this service. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // Only trigger Next.js's 404 page when we're sure the service doesn't exist,
  // not on every failure (e.g. network errors, which now show a toast instead).
  if (notFoundFlag) {
    notFound();
  }

  if (!service) {
    // Defensive fallback — avoids crashing on undefined `service` fields below
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-xl font-semibold text-gray-700">
          We couldn't load this service right now.
        </p>
        <button
          onClick={fetchService}
          className="rounded-xl bg-[#1877AE] px-6 py-3 font-semibold text-white transition hover:bg-[#145f8b]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src={service.image}
          alt={service.title || "Service"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-3xl">
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-white backdrop-blur"
            >
              <ArrowLeft size={18} />
              Back to Services
            </Link>

            <h1 className="mt-6 text-5xl font-black text-white">
              {service.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-200">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black text-gray-900">
              About this Service
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {service.details}
            </p>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900">
                What You'll Get
              </h3>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {(service.features?.length
                  ? service.features
                  : [
                      "Practical Hands-on Training",
                      "Experienced Trainers",
                      "Latest Technology",
                      "Professional Guidance",
                      "Certificate After Completion",
                      "Career Support",
                      "Flexible Class Timing",
                      "Project Based Learning",
                    ]
                ).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl bg-white p-5 shadow"
                  >
                    <CheckCircle2 className="text-[#1877AE]" size={22} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="text-2xl font-bold">Service Information</h3>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#1877AE]" />
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-semibold">
                      {service.availability || "Monday - Saturday"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-[#1877AE]" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold">
                      {service.contact || "+977-9867868324"}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877AE] py-4 font-semibold text-white transition hover:bg-[#145f8b]"
              >
                Request Service
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#1877AE] to-[#1C8BCA] px-10 py-16 text-center text-white">
          <h2 className="text-4xl font-black">Ready to Get Started?</h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Contact Sky Solutions Computer Institute today and let our
            experts help you with professional IT services and training.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-[#1877AE] transition hover:-translate-y-1"
            >
              Contact Us
            </Link>

            <Link
              href="/enrollment"
              className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-[#1877AE]"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}