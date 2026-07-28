"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { UploadCloud, Info, Settings2, ImagePlus } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const inputBase =
  "w-full border rounded-lg p-3 outline-none transition focus:ring-2 focus:ring-[#1C8BCA]/30 focus:border-[#1C8BCA]";

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1C8BCA]">
        <Icon size={17} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      course: "",
      message: "",
      rating: 5,
      status: true,
      image: null,
    },
  });

  const { onChange: onImageChange, ...imageRegister } = register("image", {
    required: "Testimonial image is required",
  });

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("course", data.course);
      formData.append("message", data.message);
      formData.append("rating", data.rating);
      formData.append("status", data.status);
      formData.append("image", data.image[0]);

      const res = await axios.post("/api/testimonials", formData);

      if (res.data.success) {
        toast.success("Testimonial created successfully");
        router.push("/admin/testimonials");
      } else {
        toast.error(res.data.message || "Failed to create testimonial");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Testimonial
          </h1>
          <p className="text-gray-500 mt-1">
            Add a student testimonial to your website.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Info} title="Basic Information" />

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className={`${inputBase} ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Student name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("course", { required: "Course is required" })}
                  className={`${inputBase} ${
                    errors.course ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Web Development"
                />
                {errors.course && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.course.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={5}
                  className={`${inputBase} resize-none ${
                    errors.message ? "border-red-400" : "border-gray-300 bg-gray-100"
                  }`}
                  placeholder="What did the student say?"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Settings2} title="Rating & Status" />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("rating", { required: "Rating is required" })}
                  className={`${inputBase} border-gray-300 bg-gray-100`}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
                {errors.rating && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  {...register("status")}
                  className={`${inputBase} border-gray-300 bg-gray-100`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={ImagePlus} title="Testimonial Image" />

            <label
              htmlFor="testimonial-image"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition hover:border-[#1C8BCA] hover:bg-sky-50 ${
                errors.image ? "border-red-400" : "border-gray-200"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Testimonial preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <>
                  <UploadCloud className="text-gray-400" size={30} />
                  <p className="text-sm text-gray-500">
                    Click to upload, or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG or JPG, up to 5MB</p>
                </>
              )}

              <input
                id="testimonial-image"
                type="file"
                accept="image/*"
                {...imageRegister}
                onChange={(e) => {
                  onImageChange(e);
                  handleImagePick(e);
                }}
                className="hidden"
              />
            </label>

            {errors.image && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image.message}
              </p>
            )}
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/testimonials")}
              className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C8BCA] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <LoadingSpinner size={18} />}
              {loading ? "Creating..." : "Create Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}