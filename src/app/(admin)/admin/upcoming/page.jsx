"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Plus,
  CalendarClock,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";

export default function Page() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/upcoming");
      if (res.data.success) {
        setClasses(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load upcoming classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const deleteClass = async () => {
    if (!selectedClass?._id) {
      toast.error("Class id missing");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(
        `/api/upcoming/${selectedClass._id}`
      );

      if (res.data.success) {
        toast.success("Class deleted successfully", { autoClose: 2000 });
        setClasses((prev) =>
          prev.filter((item) => item._id !== selectedClass._id)
        );
        setSelectedClass(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredClasses = classes.filter((item) =>
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Upcoming Classes
            </h1>
            <p className="text-gray-500 mt-2">Manage your upcoming classes</p>
          </div>

          <Link
            href="/admin/upcoming/create"
            className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex items-center gap-2 rounded-xl hover:bg-[#0D4E6A] transition"
          >
            <Plus size={16} />
            Add Class
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4">
            <Search className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search class..."
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left">Class</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Time</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Active</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <Loader2
                        className="animate-spin mx-auto text-[#1C8BCA]"
                        size={40}
                      />
                      <p className="mt-3 text-gray-500">Loading...</p>
                    </td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <CalendarClock className="mx-auto text-gray-400" size={45} />
                      <p className="text-gray-500 mt-3">No class found</p>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                      </td>
                      <td className="p-5 text-center">{item.date}</td>
                      <td className="p-5 text-center">{item.time}</td>
                      <td className="p-5 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/admin/upcoming/edit/${item._id}`}
                            className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => setSelectedClass(item)}
                            className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700"
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

        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="text-red-600" size={30} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center">Delete Class?</h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete <br />
                <b>{selectedClass.title}</b>?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={deleteClass}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}