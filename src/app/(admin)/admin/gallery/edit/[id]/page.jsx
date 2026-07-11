"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Loader2, UploadCloud, Info, Settings2, ImagePlus } from "lucide-react";

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
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      status: true,
      image: null,
    },
  });

  const { onChange: onImageChange, ...imageRegister } = register("image");

  useEffect(() => {
    if (id) fetchGallery();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`/api/gallery/${id}`);
      const gallery = res.data.data;

      reset({
        title: gallery.title || "",
        status: gallery.status ?? true,
        image: null,
      });

      setValue("status", gallery.status ? "true" : "false");

      if (gallery.image) {
        setImagePreview(gallery.image);
      } else {
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("status", data.status);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axios.put(`/api/gallery/${id}`, formData);

      if (res.data.success) {
        toast.success("Gallery updated successfully");
        router.push("/admin/gallery");
      } else {
        toast.error(res.data.message || "Failed to update gallery");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#1C8BCA]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Gallery</h1>
          <p className="text-gray-500 mt-1">
            Update the gallery details below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Info} title="Basic Information" />

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className={`${inputBase} ${
                    errors.title ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Gallery title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Settings2} title="Status" />

            <div className="grid sm:grid-cols-2 gap-5">
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
            <SectionHeader icon={ImagePlus} title="Gallery Image" />

            <label
              htmlFor="gallery-image"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition hover:border-[#1C8BCA] hover:bg-sky-50 ${
                errors.image ? "border-red-400" : "border-gray-200"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Gallery preview"
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
                id="gallery-image"
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
              <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
            )}
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/gallery")}
              className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C8BCA] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Updating..." : "Update Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}