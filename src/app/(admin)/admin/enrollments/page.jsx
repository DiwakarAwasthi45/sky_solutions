"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Eye,
  Trash2,
  ClipboardList,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";

const paymentStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const enrollmentStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function Page() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/enrollments");
      if (res.data.success) {
        setEnrollments(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || "Failed to load enrollments";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const deleteEnrollment = async () => {
    if (!selectedEnrollment?._id) {
      toast.error("Enrollment id missing");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(
        `/api/enrollments/${selectedEnrollment._id}`
      );

      if (res.data.success) {
        toast.success("Enrollment deleted successfully", { autoClose: 2000 });
        setEnrollments((prev) =>
          prev.filter((item) => item._id !== selectedEnrollment._id)
        );
        setSelectedEnrollment(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredEnrollments = enrollments.filter((item) =>
    (item.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Enrollments</h1>
            <p className="text-gray-500 mt-2">Manage student enrollment requests</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4">
            <Search className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left">Student</th>
                  <th className="p-5 text-left">Course</th>
                  <th className="p-5">Batch</th>
                  <th className="p-5">Payment</th>
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
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <ClipboardList className="mx-auto text-gray-400" size={45} />
                      <p className="text-gray-500 mt-3">No enrollment found</p>
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        <h3 className="font-semibold text-gray-900">
                          {item.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">{item.email}</p>
                        <p className="text-sm text-gray-500">{item.phone}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-800">
                          {item.course?.title || "—"}
                        </p>
                      </td>
                      <td className="p-5 text-center">{item.batch}</td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            paymentStyles[item.paymentStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            enrollmentStyles[item.enrollmentStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.enrollmentStatus}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/admin/enrollments/${item._id}`}
                            className="bg-[#1C8BCA] text-white p-3 rounded-xl hover:bg-[#166f9f]"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => setSelectedEnrollment(item)}
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

        {selectedEnrollment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="text-red-600" size={30} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center">
                Delete Enrollment?
              </h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete the enrollment for <br />
                <b>{selectedEnrollment.fullName}</b>?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={deleteEnrollment}
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