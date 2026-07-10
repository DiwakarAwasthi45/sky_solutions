"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, Loader2, UserCog } from "lucide-react";

export default function page() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "student",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      reset();

      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "instructor") {
        router.push("/instructor");
      } else {
        router.push("/students");
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Login
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Login to your account
        </p>

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

          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <div className="relative">
              <UserCog
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <select
                {...register("role", {
                  required: "Please select a role",
                })}
                className="w-full appearance-none pl-10 pr-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#1C8BCA] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#1C8BCA] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}