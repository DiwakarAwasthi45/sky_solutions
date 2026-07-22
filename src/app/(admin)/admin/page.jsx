"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  BookOpen,
  Users,
  Wrench,
  Quote,
  MessageSquare,
  Images,
  TrendingUp,
  PlusCircle,
  List,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image,
  FileText,
} from "lucide-react";

const statCards = [
  {
    title: "Courses",
    key: "totalCourses",
    icon: BookOpen,
    gradient: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-200",
    href: "/admin/courses",
  },
  {
    title: "Enrollments",
    key: "totalEnrollments",
    icon: Users,
    gradient: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-200",
    href: "/admin/enrollments",
  },
  {
    title: "Services",
    key: "totalServices",
    icon: Wrench,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-200",
    href: "/admin/services",
  },
  {
    title: "Testimonials",
    key: "totalTestimonials",
    icon: Quote,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
    href: "/admin/testimonials",
  },
  {
    title: "Contacts",
    key: "totalContacts",
    icon: MessageSquare,
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-200",
    href: "/admin/enrollments",
  },
  {
    title: "Gallery",
    key: "totalGallery",
    icon: Image,
    gradient: "from-cyan-500 to-teal-600",
    shadow: "shadow-cyan-200",
    href: "/admin/gallery",
  },
];

const quickActions = [
  { label: "New Course", href: "/admin/courses/create", icon: BookOpen, color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100" },
  { label: "New Service", href: "/admin/services/create", icon: Wrench, color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  { label: "New Testimonial", href: "/admin/testimonials/create", icon: Quote, color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
  { label: "Upload Gallery", href: "/admin/gallery/create", icon: Image, color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100" },
  { label: "Enrollments", href: "/admin/enrollments", icon: Users, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  { label: "Site Settings", href: "/admin/settings", icon: Settings, color: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100" },
];

const statusIcon = {
  pending: <Clock size={14} className="text-amber-500" />,
  approved: <CheckCircle2 size={14} className="text-emerald-500" />,
  rejected: <XCircle size={14} className="text-red-500" />,
  completed: <CheckCircle2 size={14} className="text-blue-500" />,
};

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard");
        if (data.success) {
          setStats(data.stats);
          setRecent(data.recent);
        }
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load dashboard");
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-400" size={48} />
          <p className="mt-4 text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700"
          >
            Retry
          </button>
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
          <p className="text-gray-500 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3 text-sm bg-white px-4 py-2.5 rounded-xl shadow-sm border">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
            <span className="text-sky-600 font-bold text-xs">SS</span>
          </div>
          <span className="font-medium text-gray-700">Sky Solutions Institute</span>
        </div>
      </div>

      {/* Pending Alert */}
      {stats?.pendingEnrollments > 0 && (
        <Link
          href="/admin/enrollments"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 hover:bg-amber-100 transition"
        >
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <p className="text-sm font-medium text-amber-800">
            You have <span className="font-bold">{stats.pendingEnrollments}</span> pending enrollment{stats.pendingEnrollments !== 1 ? "s" : ""} waiting for review.
          </p>
          <ArrowUpRight size={16} className="text-amber-400 ml-auto shrink-0" />
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${card.shadow}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{card.title}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${action.color}`}
              >
                <Icon size={16} />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Enrollments</h3>
            <Link href="/admin/enrollments" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent?.enrollments?.length === 0 ? (
              <p className="px-6 py-10 text-center text-gray-400 text-sm">No enrollments yet</p>
            ) : (
              recent?.enrollments?.map((item) => (
                <div key={item._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{item.course?.title || "N/A"} · {item.batch}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[item.enrollmentStatus] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
                      {statusIcon[item.enrollmentStatus]}
                      {item.enrollmentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
            <span className="text-xs text-gray-400">{stats?.totalContacts ?? 0} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recent?.contacts?.length === 0 ? (
              <p className="px-6 py-10 text-center text-gray-400 text-sm">No messages yet</p>
            ) : (
              recent?.contacts?.map((item) => (
                <div key={item._id} className="px-6 py-3.5 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-3">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.email}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Testimonials */}
      {recent?.testimonials?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Testimonials</h3>
            <Link href="/admin/testimonials" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {recent.testimonials.map((item) => (
              <div key={item._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-2 italic">"{item.review}"</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                    <span className="text-sky-600 font-bold text-xs">{(item.name || "U")[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.course || ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
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
