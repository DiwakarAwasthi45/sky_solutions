"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Plus,
  Wrench,
  Loader2,
  AlertTriangle,
  Search,
  Star,
} from "lucide-react";

export default function page() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/services");
      if (res.data.success) {
        setServices(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteService = async () => {
    if (!selectedService?._id) {
      toast.error("Service id missing");
      return;
    }

    try {
      setDeleting(true);
      const res = await axios.delete(`/api/services/${selectedService._id}`);

      if (res.data.success) {
        toast.success("Service deleted successfully", { autoClose: 2000 });
        setServices((prev) =>
          prev.filter((item) => item._id !== selectedService._id)
        );
        setSelectedService(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter((service) =>
    (service.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-500 mt-2">Manage your institute services</p>
          </div>

          <Link
            href="/admin/services/create"
            className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex items-center gap-2 rounded-xl hover:bg-[#0D4E6A] transition"
          >
            <Plus size={16} />
            Add Service
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4">
            <Search className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service..."
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
                  <th className="p-5 text-left">Service</th>
                  <th className="p-5 text-left">Features</th>
                  <th className="p-5">Featured</th>
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
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <Wrench className="mx-auto text-gray-400" size={45} />
                      <p className="text-gray-500 mt-3">No service found</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const features = Array.isArray(service.features)
                      ? service.features
                      : [];
                    const visibleFeatures = features.slice(0, 2);
                    const remaining = features.length - visibleFeatures.length;

                    return (
                      <tr
                        key={service._id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="p-5">
                          <img
                            src={service.image}
                            alt={service.title || "Service"}
                            className="w-24 h-16 rounded-xl object-cover"
                            loading="lazy"
                          />
                        </td>
                        <td className="p-5">
                          <h3 className="font-semibold text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-500">/{service.slug}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-xs">
                            {service.shortDescription}
                          </p>
                        </td>
                        <td className="p-5 max-w-[220px]">
                          {features.length === 0 ? (
                            <span className="text-gray-400 text-sm">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {visibleFeatures.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-sky-50 text-[#1C8BCA] text-xs font-medium px-2.5 py-1 rounded-full truncate max-w-[110px]"
                                  title={feature}
                                >
                                  {feature}
                                </span>
                              ))}
                              {remaining > 0 && (
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                  +{remaining} more
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-5 text-center">
                          {service.featured ? (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                              <Star size={14} className="fill-yellow-500 text-yellow-500" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="p-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              service.status
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {service.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex justify-center gap-3">
                            <Link
                              href={`/admin/services/edit/${service._id}`}
                              className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button
                              onClick={() => setSelectedService(service)}
                              className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="text-red-600" size={30} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center">Delete Service?</h2>
              <p className="text-center text-gray-500 mt-2">
                Are you sure you want to delete <br />
                <b>{selectedService.title}</b>?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={deleteService}
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