"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Page() {
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
        setUpcoming(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load upcoming classes");
    } finally {
      setLoading(false);
    }
  };

  const deleteUpcoming = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/upcoming/${id}`);

      if (data.success) {
        toast.success("Deleted successfully");
        fetchUpcoming();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Upcoming Classes
          </h1>

          <p className="mt-2 text-gray-500">
            Manage upcoming classes.
          </p>
        </div>

        <Link
          href="/admin/upcoming/create"
          className="flex items-center gap-2 rounded-lg bg-[#0F5E8C] px-5 py-3 text-white hover:bg-[#0F5E8C]"
        >
          <Plus size={18} />
          Add Class
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-4 text-left">Title</th>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-left">Time</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-center">
                Active
              </th>
              <th className="px-5 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : upcoming.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center"
                >
                  No Upcoming Classes Found
                </td>
              </tr>
            ) : (
              upcoming.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium">
                    {item.title}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {item.date}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {item.time}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    {item.isActive ? (
                      <CheckCircle className="mx-auto text-green-600" />
                    ) : (
                      <span className="text-red-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/admin/upcoming/edit/${item._id}`}
                        className="rounded-lg bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() =>
                          deleteUpcoming(item._id)
                        }
                        className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={18} />
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