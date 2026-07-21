"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  BookOpen,
  Users,
  Wrench,
  Quote,
  TrendingUp,
  Loader2,
  PlusCircle,
  List,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const statCards = [
  {
    title: "Courses",
    icon: BookOpen,
    gradient: "from-sky-500 to-sky-600",
    lightBg: "bg-sky-50",
    textColor: "text-sky-600",
    trend: "Available Courses",
    href: "/admin/courses",
  },
  {
    title: "Enrollments",
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-600",
    trend: "Student Registrations",
    href: "/admin/enrollments",
  },
  {
    title: "Services",
    icon: Wrench,
    gradient: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-50",
    textColor: "text-amber-600",
    trend: "Institute Services",
    href: "/admin/services",
  },
  {
    title: "Testimonials",
    icon: Quote,
    gradient: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-50",
    textColor: "text-violet-600",
    trend: "Student Reviews",
    href: "/admin/testimonials",
  },
];

const quickActions = [
  { label: "New Course", href: "/admin/courses/create", icon: PlusCircle, color: "text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-200" },
  { label: "New Service", href: "/admin/services/create", icon: PlusCircle, color: "text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { label: "All Enrollments", href: "/admin/enrollments", icon: List, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
  { label: "Site Settings", href: "/admin/settings", icon: Settings, color: "text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200" },
];

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

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
          <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your institute at a glance.</p>
        </div>
        <div className="flex items-center gap-3 text-sm bg-white px-4 py-2.5 rounded-xl shadow-sm border">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
            <span className="text-sky-600 font-bold text-xs">SS</span>
          </div>
          <span className="font-medium text-gray-700">Sky Solutions Institute</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const total = stats?.[`total${card.title}`] ?? 0;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 tabular-nums">
                    <AnimatedCounter key={total} from={0} to={total} />
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.lightBg} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} className={card.textColor} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <TrendingUp size="15" className={card.textColor} />
                  <span className="font-medium">{card.trend}</span>
                </div>
                <ArrowUpRight size="16" className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border font-medium text-sm transition-all ${action.color}`}
              >
                <Icon size={18} />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Sky Solutions Computer Institute</h3>
            <p className="text-gray-400 text-sm mt-0.5">Bedkot-3, Kanchanpur, Nepal</p>
          </div>
          <span className="text-xs text-gray-500">v1.0</span>
        </div>
      </div>
    </div>
  );
}
