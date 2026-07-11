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
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "Open",
      isActive: true,
    },
  });

  const { onChange: onImageChange, ...imageRegister } = register("image");

  useEffect(() => {
    if (id) fetchUpcoming();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchUpcoming = async () => {
    try {
      const res = await axios.get(`/api/upcoming/${id}`);
      const upcoming = res.data.data;

      reset({
        name: upcoming.name || "",
        status: upcoming.status || "Open",
        isActive: upcoming.isActive ?? true,
      });

      setValue("status", upcoming.status ? "true" : "false");
      setValue("rating", String(upcoming.rating ?? 5));

      if (upcoming.image) {
        setImagePreview(upcoming.image);
      } else {
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load upcoming event");
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
      formData.append("name", data.name);
      formData.append("course", data.course);
      formData.append("message", data.message);
      formData.append("rating", data.rating);
      formData.append("status", data.status);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axios.put(`/api/upcoming/${id}`, formData);

      if (res.data.success) {
        toast.success("Upcoming event updated successfully");
        router.push("/admin/upcoming");
      } else {
        toast.error(res.data.message || "Failed to update upcoming event");
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
          <h1 className="text-3xl font-extrabold text-gray-900">
            Edit Upcoming Event
          </h1>
          <p className="text-gray-500 mt-1">
            Update the upcoming event details below.
          </p>
        </div>
  <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Class Title
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3">
              <BookOpen
                size={18}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Basic Computer"
                {...register("title", {
                  required: "Class title is required",
                })}
                className="w-full p-3 outline-none"
              />
            </div>

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Date
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3">
              <Calendar
                size={18}
                className="text-gray-400"
              />

              <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className="w-full p-3 outline-none"
              />
            </div>

            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Time
            </label>

            <div className="flex items-center border border-gray-200 rounded-xl px-3">
              <Clock
                size={18}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="7:00 AM - 9:00 AM"
                {...register("time", {
                  required: "Time is required",
                })}
                className="w-full p-3 outline-none"
              />
            </div>

            {errors.time && (
              <p className="text-red-500 text-sm mt-1">
                {errors.time.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Status
            </label>

            <select
              {...register("status", {
                required: "Status is required",
              })}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none"
            >
              <option value="Open">Open</option>
              <option value="Starting Soon">
                Starting Soon
              </option>
              <option value="Few Seats Left">
                Few Seats Left
              </option>
              <option value="Admission Closed">
                Admission Closed
              </option>
            </select>

            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-5 w-5"
            />

            <label className="flex items-center gap-2 font-medium">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
              Active
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1877AE] hover:bg-[#145f8b] text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={18}
                />
                Updating...
              </>
            ) : (
              "Update Upcoming Event"
            )}
          </button>
        </form>
       
      </div>
    </div>
  );
}