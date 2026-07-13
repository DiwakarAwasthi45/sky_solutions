"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Plus,
  Settings as SettingsIcon,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import axios from "axios";

export default function Page() {
  const [settingsList, setSettingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettings, setSelectedSettings] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/settings");
      if (res.data.success) {
        // Handles API returning either an array or a single object
        const data = res.data.data;
        setSettingsList(Array.isArray(data) ? data : data ? [data] : []);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const deleteSettings = async () => {
    if (!selectedSettings?._id) {
      toast.error("Settings id missing");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(`/settings/${selectedSettings._id}`);

      if (res.data.success) {
        toast.success("Settings deleted successfully", { autoClose: 2000 });
        setSettingsList((prev) =>
          prev.filter((item) => item._id !== selectedSettings._id)
        );
        setSelectedSettings(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSettings = settingsList.filter((item) =>
    (item.siteName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-2">Manage your website settings</p>
          </div>

          <Link
            href="/admin/settings/create"
            className="bg-sky-600 text-white px-5 py-3 rounded flex items-center gap-2 rounded-xl hover:bg-sky-700 transition"
          >
            <Plus size={16} />
            Add Settings
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4">
            <Search className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by site name..."
              className="w-full py-3 outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left">Logo</th>
                  <th className="p-5 text-left">Site Info</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Updated</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20">
                      <Loader2
                        className="animate-spin mx-auto text-[#1C8BCA]"
                        size={40}
                      />
                      <p className="mt-3 text-gray-500">Loading...</p>
                    </td>
                  </tr>
                ) : filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20">
                      <SettingsIcon className="mx-auto text-gray-400" size={45} />
                      <p className="text-gray-500 mt-3">No settings found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-5">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.siteName || "Logo"}
                            className="w-24 h-16 rounded-xl object-contain bg-gray-50 border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-24 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No logo
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <h3 className="font-semibold text-gray-900">
                          {item.siteName || "—"}
                        </h3>
                        <p className="text-sm text-gray-500">{item.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.phone}
                        </p>
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.maintenanceMode
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.maintenanceMode ? "Maintenance" : "Active"}
                        </span>
                      </td>
                      <td className="p-5 text-center text-sm text-gray-500">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/admin/settings/edit/${item._id}`}
                            className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => setSelectedSettings(item)}
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

        {selectedSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="text-red-600" size={30} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center">
                Delete Settings?
              </h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete <br />
                <b>{selectedSettings.siteName}</b>?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedSettings(null)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={deleteSettings}
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