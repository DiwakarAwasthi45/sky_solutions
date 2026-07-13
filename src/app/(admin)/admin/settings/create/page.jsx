"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SettingsCreatePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      siteName: "",
      siteTitle: "",
      description: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      googleMap: "",
      website: "",
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      twitter: "",
      whatsapp: "",
      officeHours: "",
      maintenanceMode: false,
      footerCopyright: "",
      heroTitle: "",
      heroSubtitle: "",
      seoKeywords: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "seoKeywords") {
          const keywords = value
            ? value.split(",").map((item) => item.trim()).filter(Boolean)
            : [];
          keywords.forEach((keyword) => formData.append("seoKeywords", keyword));
          return;
        }

        if (key === "maintenanceMode") {
          formData.append(key, value ? "true" : "false");
          return;
        }

        formData.append(key, value ?? "");
      });

      await axios.post("/api/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Settings created successfully");
      reset();
      router.push("/admin/settings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create settings");
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <input
            {...register("siteName", { required: "Site name is required" })}
            placeholder="Site Name"
            className={inputClass}
          />
          {errors.siteName && (
            <p className="mt-1 text-sm text-red-500">{errors.siteName.message}</p>
          )}
        </div>

        <input {...register("siteTitle")} placeholder="Site Title" className={inputClass} />
        <textarea {...register("description")} placeholder="Description" className={inputClass} />

        <div>
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone", { required: "Phone is required" })}
            placeholder="Phone"
            className={inputClass}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <input {...register("alternatePhone")} placeholder="Alternate Phone" className={inputClass} />

        <div>
          <input
            {...register("address", { required: "Address is required" })}
            placeholder="Address"
            className={inputClass}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <input {...register("googleMap")} placeholder="Google Map" className={inputClass} />
        <input {...register("website")} placeholder="Website" className={inputClass} />
        <input {...register("facebook")} placeholder="Facebook" className={inputClass} />
        <input {...register("instagram")} placeholder="Instagram" className={inputClass} />
        <input {...register("youtube")} placeholder="YouTube" className={inputClass} />
        <input {...register("linkedin")} placeholder="LinkedIn" className={inputClass} />
        <input {...register("twitter")} placeholder="Twitter" className={inputClass} />
        <input {...register("whatsapp")} placeholder="WhatsApp" className={inputClass} />
        <input {...register("officeHours")} placeholder="Office Hours" className={inputClass} />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("maintenanceMode")} />
          <span>Maintenance Mode</span>
        </label>

        <input {...register("footerCopyright")} placeholder="Footer Copyright" className={inputClass} />
        <input {...register("heroTitle")} placeholder="Hero Title" className={inputClass} />
        <textarea {...register("heroSubtitle")} placeholder="Hero Subtitle" className={inputClass} />

        <input
          {...register("seoKeywords")}
          placeholder="SEO Keywords (comma separated)"
          className={inputClass}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-sky-600 px-4 py-2 text-white "
        >
          {isSubmitting ? "Saving..." : "Create Settings"}
        </button>
      </form>
    </div>
  );
}