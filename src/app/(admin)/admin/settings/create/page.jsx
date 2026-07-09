"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Convert comma-separated keywords into array
      data.seoKeywords = data.seoKeywords
        ? data.seoKeywords.split(",").map((item) => item.trim())
        : [];

      data.maintenanceMode = data.maintenanceMode || false;

      const res = await axios.post("/api/settings", data);

      if (res.data.success) {
        toast.success("Settings created successfully.");
        router.push("/admin/settings");
        reset();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
      <h1 className="text-3xl font-bold mb-8">
        Create Website Settings
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Site Name */}
        <div>
          <label className="font-medium">Site Name *</label>
          <input
            {...register("siteName", { required: true })}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
          {errors.siteName && (
            <p className="text-red-500 text-sm mt-1">
              Site Name is required
            </p>
          )}
        </div>

        {/* Site Title */}
        <div>
          <label className="font-medium">Site Title</label>
          <input
            {...register("siteTitle")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-medium">Email *</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium">Phone *</label>
          <input
            {...register("phone", { required: true })}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="font-medium">Alternate Phone</label>
          <input
            {...register("alternatePhone")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Website */}
        <div>
          <label className="font-medium">Website</label>
          <input
            {...register("website")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="font-medium">Address *</label>
          <textarea
            rows={2}
            {...register("address", { required: true })}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="font-medium">Description</label>
          <textarea
            rows={4}
            {...register("description")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="font-medium">Logo URL</label>
          <input
            {...register("logo")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Favicon */}
        <div>
          <label className="font-medium">Favicon URL</label>
          <input
            {...register("favicon")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Google Map */}
        <div className="md:col-span-2">
          <label className="font-medium">Google Map Embed URL</label>
          <input
            {...register("googleMap")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Social Links */}
        <div>
          <label className="font-medium">Facebook</label>
          <input {...register("facebook")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        <div>
          <label className="font-medium">Instagram</label>
          <input {...register("instagram")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        <div>
          <label className="font-medium">YouTube</label>
          <input {...register("youtube")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        <div>
          <label className="font-medium">LinkedIn</label>
          <input {...register("linkedin")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        <div>
          <label className="font-medium">Twitter</label>
          <input {...register("twitter")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        <div>
          <label className="font-medium">WhatsApp</label>
          <input {...register("whatsapp")} className="w-full border border-gray-200 rounded-lg p-3 mt-2" />
        </div>

        {/* Office Hours */}
        <div className="md:col-span-2">
          <label className="font-medium">Office Hours</label>
          <input
            {...register("officeHours")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Hero Title */}
        <div>
          <label className="font-medium">Hero Title</label>
          <input
            {...register("heroTitle")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Hero Subtitle */}
        <div>
          <label className="font-medium">Hero Subtitle</label>
          <input
            {...register("heroSubtitle")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Hero Image */}
        <div className="md:col-span-2">
          <label className="font-medium">Hero Image URL</label>
          <input
            {...register("heroImage")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* Footer Copyright */}
        <div className="md:col-span-2">
          <label className="font-medium">Footer Copyright</label>
          <input
            {...register("footerCopyright")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
          />
        </div>

        {/* SEO Keywords */}
        <div className="md:col-span-2">
          <label className="font-medium">SEO Keywords (comma separated)</label>
          <input
            {...register("seoKeywords")}
            className="w-full border border-gray-200 rounded-lg p-3 mt-2"
            placeholder="computer, institute, web development"
          />
        </div>

        {/* Maintenance Mode */}
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            {...register("maintenanceMode")}
          />
          <label className="font-medium">Enable Maintenance Mode</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Settings"}
        </button>
      </form>
    </div>
  );
}