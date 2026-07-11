"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, Settings as SettingsIcon } from "lucide-react";
import axios from "axios";

export default function SettingsListPage() {
  const [settingsList, setSettingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/settings");

      if (res.data.success) {
        // Handles API returning either an array or a single object
        const data = res.data.data;
        setSettingsList(Array.isArray(data) ? data : data ? [data] : []);
      } else {
        toast.error(res.data.message || "Failed to load settings.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this settings record? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await axiosClient.delete(`/settings/${id}`);

      if (res.data.success) {
        toast.success("Settings deleted successfully.");
        setSettingsList((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete settings."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <Link
          href="/admin/settings/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          <Plus size={18} />
          New Settings
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        ) : settingsList.length === 0 ? (
          <div className="p-16 text-center">
            <SettingsIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700">
              No settings created yet
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Create your website settings to get started.
            </p>
            <Link
              href="/admin/settings/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Settings
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                  <th className="p-4 font-semibold">Site Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Updated</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingsList.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {item.siteName || "—"}
                    </td>
                    <td className="p-4 text-gray-600">{item.email || "—"}</td>
                    <td className="p-4 text-gray-600">{item.phone || "—"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.maintenanceMode
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.maintenanceMode ? "Maintenance" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/settings/${item._id}/edit`}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}