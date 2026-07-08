"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil,Trash2,Plus } from "lucide-react";

export default function page() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/courses");

      if (data.success) {
        setCourses(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;

    try {
      const { data } = await axios.delete(`/api/courses/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete course."
      );
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Courses
          </h1>

          <p className="text-gray-500">
            Manage all institute courses.
          </p>
        </div>

        <Link
          href="/admin/courses/create"
          className="rounded-lg bg-[#0F5E8C] px-5 py-3 text-white hover:bg-sky-700"
        >
          + Add Course
        </Link>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-4 text-left">Image</th>
              <th className="px-5 py-4 text-left">Title</th>
              <th className="px-5 py-4 text-left">Duration</th>
              <th className="px-5 py-4 text-left">Level</th>
              <th className="px-5 py-4 text-left">Price</th>
              <th className="px-5 py-4 text-center">
                Syllabus
              </th>
              <th className="px-5 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-14 w-20 rounded object-cover"
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold">
                      {course.title}
                    </div>

                    <div className="text-xs text-gray-500">
                      {course.slug}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {course.duration}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">
                      {course.level}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    Rs. {course.price}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {course.syllabus?.length}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/courses/edit/${course._id}`}
                        className="rounded bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
                      >
                        <Pencil size={16}/>
                      </Link>

                      <button
                        onClick={() =>
                          deleteCourse(course._id)
                        }
                        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}