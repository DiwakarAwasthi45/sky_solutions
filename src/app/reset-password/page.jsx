"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89]">
          <LoadingSpinner size={40} />
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        token,
        password: formData.password,
      });

      toast.success(data.message);
      reset();
      setDone(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-5">
            <CheckCircle2 className="text-green-500" size={56} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Password Reset Successful
          </h2>

          <p className="text-gray-500 mt-3 leading-6">
            Your password has been changed. You can now login with your new
            password.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-8 w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C8BCA]/10">
            <KeyRound className="text-[#1C8BCA]" size={28} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Set New Password
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Enter a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

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
