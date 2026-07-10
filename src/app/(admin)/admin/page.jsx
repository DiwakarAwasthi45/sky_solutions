"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  BookOpen,
  Users,
  Wrench,
  Quote,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    {
      title: "Courses",
      total: 0,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      trend: "Available Courses",
      trendUp: true,
    },
    {
      title: "Enrollments",
      total: 0,
      icon: Users,
      color: "bg-green-100 text-green-600",
      trend: "Student Registrations",
      trendUp: true,
    },
    {
      title: "Services",
      total: 0,
      icon: Wrench,
      color: "bg-yellow-100 text-yellow-600",
      trend: "Institute Services",
      trendUp: true,
    },
    {
      title: "Testimonials",
      total: 0,
      icon: Quote,
      color: "bg-purple-100 text-purple-600",
      trend: "Student Reviews",
      trendUp: true,
    },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard");

        if (data.success) {
          setStats([
            {
              title: "Courses",
              total: data.stats.totalCourses,
              icon: BookOpen,
              color: "bg-blue-100 text-blue-600",
              trend: "Available Courses",
              trendUp: true,
            },
            {
              title: "Enrollments",
              total: data.stats.totalEnrollments,
              icon: Users,
              color: "bg-green-100 text-green-600",
              trend: "Student Registrations",
              trendUp: true,
            },
            {
              title: "Services",
              total: data.stats.totalServices,
              icon: Wrench,
              color: "bg-yellow-100 text-yellow-600",
              trend: "Institute Services",
              trendUp: true,
            },
            {
              title: "Testimonials",
              total: data.stats.totalTestimonials,
              icon: Quote,
              color: "bg-purple-100 text-purple-600",
              trend: "Student Reviews",
              trendUp: true,
            },
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Overview of your academy at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow border p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500">{item.title}</h3>

                  <p className="text-3xl font-bold mt-2">
                    {item.total}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 text-green-600 text-sm">
                <TrendingUp size={16} />
                {item.trend}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}