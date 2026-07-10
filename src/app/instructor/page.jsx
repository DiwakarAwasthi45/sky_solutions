"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BookOpen,
  Users,
  ClipboardList,
  Bell,
  LogOut,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/instructor/dashboard", {
          withCredentials: true,
        });

        setInstructor(data.instructor);
        setStats(data.stats);
        setCourses(data.courses || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#1877AE]" size={36} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back{instructor?.name ? `, ${instructor.name}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-[#1877AE]/10 p-3">
              <BookOpen className="text-[#1877AE]" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCourses}
              </p>
              <p className="text-sm text-gray-500">My Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalStudents}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-amber-50 p-3">
              <ClipboardList className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingAssignments}
              </p>
              <p className="text-sm text-gray-500">Pending Assignments</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
            <Link
              href="/instructor/courses/new"
              className="flex items-center gap-2 rounded-xl bg-[#1877AE] px-4 py-2 text-sm font-semibold text-white hover:bg-[#145f8b]"
            >
              <PlusCircle size={16} />
              New Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">
              You haven't created any courses yet.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-3 font-semibold">Course</th>
                    <th className="py-3 font-semibold">Students</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b last:border-0">
                      <td className="py-4 font-medium text-gray-900">
                        {course.title}
                      </td>
                      <td className="py-4 text-gray-600">
                        {course.studentsCount ?? 0}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            course.status === "published"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {course.status === "published"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/instructor/courses/${course._id}`}
                          className="font-semibold text-[#1877AE] hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}