"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Wrench,
  Quote,
  TrendingUp,
  Loader2,
  Plus,
  Eye,
  ArrowRight,
  GraduationCap,
  Mail,
} from "lucide-react";

const statCards = [
  {
    title: "Courses",
    icon: BookOpen,
    gradient: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    trend: "Available Courses",
    href: "/admin/courses",
    createHref: "/admin/courses/create",
  },
  {
    title: "Enrollments",
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    trend: "Student Registrations",
    href: "/admin/enrollments",
    createHref: null,
  },
  {
    title: "Services",
    icon: Wrench,
    gradient: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-50",
    trend: "Institute Services",
    href: "/admin/services",
    createHref: "/admin/services/create",
  },
  {
    title: "Testimonials",
    icon: Quote,
    gradient: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-50",
    trend: "Student Reviews",
    href: "/admin/testimonials",
    createHref: "/admin/testimonials/create",
  },
];

const quickActions = [
  { label: "Add Course", href: "/admin/courses/create", icon: BookOpen, color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
  { label: "Add Service", href: "/admin/services/create", icon: Wrench, color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
  { label: "Add Testimonial", href: "/admin/testimonials/create", icon: Quote, color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
  { label: "View Enrollments", href: "/admin/enrollments", icon: Users, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
];

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard");
        if (data.success) setStats(data.stats);
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
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-sky-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-sky-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{greeting} 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening at your institute today.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-4 py-2.5 rounded-xl shadow-sm border">
          <GraduationCap size={18} className="text-sky-600" />
          <span className="font-medium text-gray-700">Sky Solutions Institute</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const total = stats?.[`total${card.title}`] ?? 0;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} rounded-t-2xl`}></div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-2 tabular-nums">
                    {total}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.lightBg} group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={`bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <TrendingUp size={15} />
                  {card.trend}
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <Eye size={18} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-all ${action.color}`}
              >
                <Icon size={20} />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Need help managing your site?</h3>
            <p className="text-sky-100 mt-1 text-sm">Contact support for assistance with content, users, or settings.</p>
          </div>
          <a
            href="mailto:info@skysolutions.com"
            className="inline-flex items-center gap-2 bg-white text-sky-700 px-6 py-3 rounded-xl font-semibold hover:bg-sky-50 transition shrink-0"
          >
            <Mail size={16} />
            Get Support
          </a>
        </div>
      </div>
    </div>
  );
}
