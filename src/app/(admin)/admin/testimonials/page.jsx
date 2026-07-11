"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Plus,
  MessageSquareQuote,
  Loader2,
  AlertTriangle,
  Search,
  Star,
} from "lucide-react";

export default function Page() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/testimonials");
      if (res.data.success) {
        setTestimonials(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const deleteTestimonial = async () => {
    if (!selectedTestimonial?._id) {
      toast.error("Testimonial id missing");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(
        `/api/testimonials/${selectedTestimonial._id}`
      );

      if (res.data.success) {
        toast.success("Testimonial deleted successfully", { autoClose: 2000 });
        setTestimonials((prev) =>
          prev.filter((item) => item._id !== selectedTestimonial._id)
        );
        setSelectedTestimonial(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredTestimonials = testimonials.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-500 mt-2">Manage student testimonials</p>
          </div>

          <Link
            href="/admin/testimonials/create"
            className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex items-center gap-2 rounded-xl hover:bg-[#0D4E6A] transition"
          >
            <Plus size={16} />
            Add Testimonial
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4">
            <Search className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left">Image</th>
                  <th className="p-5 text-left">Name</th>
                  <th className="p-5 text-left">Course</th>
                  <th className="p-5">Rating</th>
                  <th className="p-5">Status</th>
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
                ) : filteredTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <MessageSquareQuote
                        className="mx-auto text-gray-400"
                        size={45}
                      />
                      <p className="text-gray-500 mt-3">No testimonial found</p>
                    </td>
                  </tr>
                ) : (
                  filteredTestimonials.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        <img
                          src={item.image}
                          alt={item.name || "Testimonial"}
                          className="w-14 h-14 rounded-full object-cover"
                          loading="lazy"
                        />
                      </td>
                      <td className="p-5">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {item.message}
                        </p>
                      </td>
                      <td className="p-5 text-gray-800">{item.course}</td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < item.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.status
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/admin/testimonials/edit/${item._id}`}
                            className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => setSelectedTestimonial(item)}
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

        {selectedTestimonial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="text-red-600" size={30} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center">
                Delete Testimonial?
              </h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete the testimonial from <br />
                <b>{selectedTestimonial.name}</b>?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={deleteTestimonial}
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