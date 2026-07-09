"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/upcoming",
        formData
      );

      if (data.success) {
        toast.success("Upcoming class created successfully");
        reset();
        router.push("/admin/upcoming");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create upcoming class"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Upcoming Class
          </h1>

          <p className="mt-2 text-gray-500">
            Fill in the details below to create a new upcoming class.
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
                Creating...
              </>
            ) : (
              "Create Upcoming Class"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}