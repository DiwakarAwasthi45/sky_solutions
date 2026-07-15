'use client'

import { Clock, CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';



export default function page() {
   const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchUpcoming();
    }, []);
  
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
  
        const { data } = await axios.get("/api/upcoming");
  
        if (data.success) {
          setUpcoming(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load UpcomingClass");
      } finally {
        setLoading(false);
      }
    };
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
            Upcoming Classes
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
            Join Our Next
            <span className="text-[#1C8BCA]"> Training Batches</span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Check our upcoming class schedule and reserve your seat before the batch gets full.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((item) => (
            <div
              key={item._id}
              className="group rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Status badge */}
              <span className="inline-block rounded-full bg-[#1C8BCA]/10 px-4 py-1 text-xs font-semibold text-[#1C8BCA]">
                {item.status}
              </span>

              {/* Title */}
              <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA]">
                {item.title}
              </h3>

              {/* Date */}
              <div className="mt-5 flex items-center gap-2 text-gray-600 text-sm">
                <CalendarDays size={16} className="text-[#1C8BCA]" />
                {item.date}
              </div>

              {/* Time */}
              <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
                <Clock size={16} className="text-[#1C8BCA]" />
                {item.time}
              </div>

              {/* Button */}
              <Link
                href="/enrollment"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-[#1C8BCA] hover:gap-3 transition-all"
              >
                Enroll Now
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-3 rounded-full bg-[#1C8BCA] px-8 py-4 font-semibold text-white transition hover:bg-sky-700"
          >
            View All Courses
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  )
}