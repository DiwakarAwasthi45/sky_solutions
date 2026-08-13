"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/auth/forgot-password",
        formData
      );

      toast.success(data.message);
      reset();
      setSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C8BCA]/10">
            <KeyRound className="text-[#1C8BCA]" size={28} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Enter your registered email address and we will send you a password
          reset link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
            <p className="text-green-700 font-medium">
              Check your inbox!
            </p>
            <p className="text-green-600 text-sm mt-2 leading-6">
              If an account exists with this email, a password reset link has
              been sent. The link is valid for 1 hour.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={18} />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[#1C8BCA] font-semibold hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </p>
      </div>
    </section>
  );
}
