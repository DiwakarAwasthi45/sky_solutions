"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Defined OUTSIDE the page component so its identity is stable across renders.
// Defining this inside Page() used to recreate the component on every render,
// which made React remount every input and drop focus after each keystroke.
const Input = ({ icon: Icon, error, children }) => (
  <div>
    <div
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 ${
        error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
      } focus-within:border-sky-500 transition`}
    >
      <Icon size={20} className={error ? "text-red-500" : "text-sky-600"} />
      {children}
    </div>

    {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
  </div>
);

const features = [
  "100% Practical Classes",
  "Experienced Trainers",
  "Flexible Batch Timing",
  "Internship Opportunity",
  "Certificate After Completion",
];

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      address: "",
      course: "",
      batch: "",
      message: "",
    },
  });

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/courses");

        if (data.success) {
          // Fall back to [] in case the API returns success:true with no
          // courses field — keeps courses.map() from crashing on undefined.
          setCourses(data.data);
        }
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Submit Enrollment
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { data: res } = await axios.post("/api/enrollments", data);

      if (res.success) {
        toast.success("Enrollment created successfully");
        reset();
        // Was previously "/admin/enrollments" — this is a public-facing form,
        // so it shouldn't send visitors into the admin area. Point this at
        // whatever confirmation route you actually want.
        router.push("/enrollment-success");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 grid lg:grid-cols-2 gap-10 sm:gap-14 items-center">
        {/* LEFT - Dark hero panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] p-8 sm:p-10 lg:p-12">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 font-semibold text-white backdrop-blur-md">
              <GraduationCap size={18} />
              Sky Solution Institute
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-8 text-white">
              Start Your
              <span className="block text-yellow-300">IT Career Today</span>
            </h1>

            <p className="mt-6 text-lg text-blue-100">
              Join Nepal's professional IT training institute. Learn practical
              skills from experienced trainers.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-md"
                >
                  <CheckCircle2 className="text-yellow-300 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8">
          <h2 className="text-3xl font-bold">Course Enrollment</h2>
          <p className="text-gray-500 mt-2 mb-8">Fill the application form</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Input icon={User} error={errors.fullName}>
                <input
                  {...register("fullName", { required: "Name is required" })}
                  placeholder="Full Name"
                  className="w-full bg-white outline-none text-gray-900 placeholder:text-gray-500"
                />
              </Input>

              <Input icon={Mail} error={errors.email}>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Email"
                  className="w-full bg-white outline-none text-gray-900 placeholder:text-gray-500"
                />
              </Input>
            </div>

            <Input icon={Phone} error={errors.phone}>
              <input
                {...register("phone", { required: "Phone is required" })}
                placeholder="Phone Number"
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </Input>

            <Input icon={Calendar} error={errors.dob}>
              <input
                type="text"
                {...register("dob", { required: "DOB required" })}
                placeholder="Date of Birth (DD/MM/YYYY)"
                className="w-full bg-white outline-none text-gray-900 placeholder:text-gray-500"
              />
            </Input>

            <Input icon={Users} error={errors.gender}>
              <select
                {...register("gender", { required: "Gender required" })}
                className="w-full bg-white outline-none text-gray-900"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Input>

           <Input icon={GraduationCap} error={errors.course}>
  <select
    {...register("course", {
      required: "Course required",
    })}
    className="w-full bg-white outline-none text-gray-900"
  >
    <option value="">
      {courseLoading ? "Loading Courses..." : "Select Course"}
    </option>

    {Array.isArray(courses) &&
      courses.map((course) => (
        <option key={course._id} value={course._id}>
          {course.title}
        </option>
      ))}
  </select>
</Input>

            <Input icon={Clock} error={errors.batch}>
              <select
                {...register("batch", { required: "Batch required" })}
                className="w-full bg-white outline-none text-gray-900"
              >
                <option value="">Select Batch</option>
                <option>Morning</option>
                <option>Day</option>
                <option>Evening</option>
              </select>
            </Input>

            <Input icon={MapPin} error={errors.address}>
              <textarea
                {...register("address", { required: "Address required" })}
                placeholder="Address"
                rows="3"
                className="w-full bg-transparent outline-none resize-none text-gray-900 placeholder:text-gray-400"
              />
            </Input>

            <textarea
              {...register("message")}
              placeholder="Additional Information"
              rows="4"
              className="w-full border-2 border-gray-300 rounded-xl p-4 outline-none text-gray-900 placeholder:text-gray-500"
            />

            <button
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={18} />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
