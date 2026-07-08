'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '@/app/(website)/Data'

export default function page() {
  return (
    <main className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1877AE] via-[#1C8BCA] to-[#0E5A84] py-24">

        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">

          <span className="inline-block rounded-full bg-white/20 px-5 py-2 font-semibold text-white backdrop-blur">
            Our Professional Services
          </span>

          <h1 className="mt-6 text-5xl font-black text-white md:text-6xl">
            Technology Solutions &
            <span className="block text-yellow-300">
              Professional IT Services
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-blue-100">
            We provide complete IT solutions including computer hardware,
            software, networking, repair & maintenance, AMC/CMC services,
            and Bolpatra registration support.
          </p>

          <Link
            href="/courses"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-semibold text-[#1877AE] transition hover:-translate-y-1 hover:shadow-xl"
          >
            Explore Courses
            <ArrowRight size={20} />
          </Link>

        </div>
      </section>

      {/* Services */}
      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-16 text-center">

            <span className="rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1877AE]">
              What We Offer
            </span>

            <h2 className="mt-5 text-4xl font-black text-gray-900 md:text-5xl">
              Our IT Services
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              Professional IT services designed to support individuals,
              businesses, schools, colleges, and government organizations.
            </p>

          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {SERVICES.map((service) => (

              <Link  href={`/services/${service.slug}`}
                key={service.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >

                {/* Image */}
                <div className="relative overflow-hidden">

                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute left-5 top-5 rounded-full bg-[#1877AE] px-4 py-2 text-sm font-semibold text-white">
                    IT Service
                  </div>

                </div>

                {/* Content */}
                <div className="p-7">

                  <h3 className="text-2xl font-bold text-gray-900 transition group-hover:text-[#1877AE]">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {service.shortDescription}
                  </p>

                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-[#1877AE] transition hover:gap-3"
                  >
                    Learn More
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* Statistics */}
      <section className="bg-[#1877AE] py-20">

        <div className="mx-auto grid max-w-7xl gap-10 px-6 text-center text-white md:grid-cols-4">

          <div>
            <h3 className="text-5xl font-black">3000+</h3>
            <p className="mt-2 text-blue-100">Happy Students</p>
          </div>

          <div>
            <h3 className="text-5xl font-black">500+</h3>
            <p className="mt-2 text-blue-100">Projects Completed</p>
          </div>

          <div>
            <h3 className="text-5xl font-black">10+</h3>
            <p className="mt-2 text-blue-100">Years Experience</p>
          </div>

          <div>
            <h3 className="text-5xl font-black">100%</h3>
            <p className="mt-2 text-blue-100">Customer Satisfaction</p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-24">

        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#1877AE] to-[#1C8BCA] px-8 py-16 text-center text-white">

          <h2 className="text-4xl font-black">
            Need Professional IT Services?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Contact Sky Solutions today for reliable computer services,
            networking solutions, maintenance, and professional IT support.
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
              Get Started
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}