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
  Loader2,
} from "lucide-react";

// Defined OUTSIDE the page component so its identity is stable across renders.
// Defining this inside Page() used to recreate the component on every render,
// which made React remount every input and drop focus after each keystroke.
const Input = ({ icon: Icon, error, children }) => (
  <div>
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 py-16">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-14">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-5 py-2 rounded-full font-semibold">
            <GraduationCap size={18} />
            Sky Solution Institute
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-8 text-gray-900">
            Start Your
            <span className="block text-sky-600">IT Career Today</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Join Nepal's professional IT training institute. Learn practical
            skills from experienced trainers.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl p-4 shadow flex items-center gap-3"
              >
                <CheckCircle2 className="text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold">Course Enrollment</h2>
          <p className="text-gray-500 mt-2 mb-8">Fill the application form</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Input icon={User} error={errors.fullName}>
                <input
                  {...register("fullName", { required: "Name is required" })}
                  placeholder="Full Name"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
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
                  className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
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
                type="date"
                {...register("dob", { required: "DOB required" })}
                className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </Input>

            <Input icon={Users} error={errors.gender}>
              <select
                {...register("gender", { required: "Gender required" })}
                className="w-full bg-transparent outline-none text-gray-900"
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
    className="w-full bg-transparent outline-none text-gray-900"
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
                className="w-full bg-transparent outline-none text-gray-900"
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
              className="w-full border border-gray-200 rounded-xl p-4 outline-none text-gray-900 placeholder:text-gray-400"
            />

            <button
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
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
