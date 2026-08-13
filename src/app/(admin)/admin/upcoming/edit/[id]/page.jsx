"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  GraduationCap,
  User,
  Users,
  UploadCloud,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import EditModeBanner from "@/components/EditModeBanner";

const inputBase =
  "w-full border rounded-lg p-3 outline-none transition focus:ring-2 focus:ring-[#1C8BCA]/30 focus:border-[#1C8BCA]";

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
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      course: "",
      instructor: "",
      maxSeats: 20,
      seatsFilled: 0,
      status: "Open",
      isActive: true,
      image: null,
    },
  });

  useEffect(() => {
    if (id) fetchUpcoming();
  }, [id]);

  const fetchUpcoming = async () => {
    try {
      const res = await axios.get(`/api/upcoming/${id}`);
      const upcoming = res.data.data;

      reset({
        title: upcoming.title || "",
        description: upcoming.description || "",
        date: upcoming.date || "",
        time: upcoming.time || "",
        venue: upcoming.venue || "",
        course: upcoming.course || "",
        instructor: upcoming.instructor || "",
        maxSeats: upcoming.maxSeats ?? 20,
        seatsFilled: upcoming.seatsFilled ?? 0,
        status: upcoming.status || "Open",
        isActive: upcoming.isActive ?? true,
        image: null,
      });

      if (upcoming.image) {
        setImagePreview(upcoming.image);
      } else {
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batch");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description || "");
      fd.append("date", formData.date);
      fd.append("time", formData.time);
      fd.append("venue", formData.venue || "");
      fd.append("course", formData.course || "");
      fd.append("instructor", formData.instructor || "");
      fd.append("maxSeats", String(formData.maxSeats));
      fd.append("seatsFilled", String(formData.seatsFilled));
      fd.append("status", formData.status);
      fd.append("isActive", String(formData.isActive));

      if (formData.image?.[0]) {
        fd.append("image", formData.image[0]);
      }

      const res = await axios.put(`/api/upcoming/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Batch updated successfully");
        router.push("/admin/upcoming");
      } else {
        toast.error(res.data.message || "Failed to update batch");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Edit Live Batch
          </h1>
          <p className="text-gray-500 mt-1">
            Update the batch details below.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <EditModeBanner label="Batch" />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Batch Title <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3">
                <BookOpen size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Basic Computer"
                  {...register("title", { required: "Batch title is required" })}
                  className="w-full p-3 outline-none"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Short description of this batch..."
                {...register("description")}
                className={`${inputBase} border-gray-200`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    className="w-full p-3 outline-none"
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <Clock size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="7:00 AM - 9:00 AM"
                    {...register("time", { required: "Time is required" })}
                    className="w-full p-3 outline-none"
                  />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>

              {/* Venue */}
              <div>
                <label className="block mb-2 text-sm font-medium">Venue</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <MapPin size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Sky Solutions Computer Institute"
                    {...register("venue")}
                    className="w-full p-3 outline-none"
                  />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block mb-2 text-sm font-medium">Course</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <GraduationCap size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Graphic Design"
                    {...register("course")}
                    className="w-full p-3 outline-none"
                  />
                </div>
              </div>

              {/* Instructor */}
              <div>
                <label className="block mb-2 text-sm font-medium">Instructor</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Instructor name"
                    {...register("instructor")}
                    className="w-full p-3 outline-none"
                  />
                </div>
              </div>

              {/* Max seats */}
              <div>
                <label className="block mb-2 text-sm font-medium">Max Seats</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <Users size={18} className="text-gray-400" />
                  <input
                    type="number"
                    {...register("maxSeats", { valueAsNumber: true })}
                    className="w-full p-3 outline-none"
                  />
                </div>
              </div>

              {/* Seats filled */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Seats Already Filled
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3">
                  <Users size={18} className="text-gray-400" />
                  <input
                    type="number"
                    {...register("seatsFilled", { valueAsNumber: true })}
                    className="w-full p-3 outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="Starting Soon">Starting Soon</option>
                  <option value="Few Seats Left">Few Seats Left</option>
                  <option value="Seats Full">Seats Full</option>
                  <option value="Admission Closed">Admission Closed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 text-sm font-medium">Batch Image</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-[#1C8BCA]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Batch preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <UploadCloud className="text-gray-400" size={32} />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload batch image
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image")}
                  onChange={(e) => {
                    register("image").onChange(e);
                    handleImagePick(e);
                  }}
                />
              </label>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-5 w-5"
              />
              <label className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={18} className="text-green-600" />
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
                  <LoadingSpinner size={18} />
                  Updating...
                </>
              ) : (
                "Update Batch"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
