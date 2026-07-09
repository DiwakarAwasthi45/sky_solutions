"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function page() {
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");

      if (res.data.success) {
        setCourses(res.data.data);
      } else {
        toast.error(res.data.message || "Unable to load courses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load courses");
    } finally {
      setCourseLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/enrollments", data);

      if (res.data.success) {
        toast.success(res.data.message || "Enrollment submitted successfully");
        reset();
      } else {
        toast.error(res.data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const Input = ({ icon: Icon, error, children }) => (
    <div>
      <div
        className={`flex items-center gap-3 rounded-xl border ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
        } px-4 py-3 focus-within:border-sky-500 focus-within:bg-white transition`}
      >
        <Icon className={error ? "text-red-500" : "text-sky-600"} size={20} />
        {children}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );

  const features = [
    "100% Practical Classes",
    "Experienced Trainers",
    "Flexible Batch Timing",
    "Internship Opportunity",
    "Certificate After Completion",
  ];

  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-blue-100 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}

          <div>
            <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-5 py-2 rounded-full font-semibold">
              <GraduationCap size={18} />
              Sky Solution Institute
            </span>

            <h1 className="text-5xl font-black text-gray-900 mt-8 leading-tight">
              Start Your
              <span className="block text-sky-600">IT Career Today</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              Join Nepal's professional IT training institute. Learn from
              experienced instructors with practical projects and job-oriented
              training.
            </p>

            <div className="mt-10 space-y-5">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
                >
                  <CheckCircle2 className="text-green-500" size={24} />

                  <span className="font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div className="bg-white shadow-2xl rounded-3xl p-8">
            <h2 className="text-3xl font-bold">Course Enrollment</h2>

            <p className="text-gray-500 mt-2 mb-8">
              Fill out the application form below.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Input icon={User} error={errors.fullName}>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                    placeholder="Full Name"
                    className="w-full bg-transparent outline-none"
                  />
                </Input>

                <Input icon={Mail} error={errors.email}>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email",
                      },
                    })}
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent outline-none"
                  />
                </Input>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input icon={Phone} error={errors.phone}>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\s-]{7,15}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    placeholder="Phone Number"
                    className="w-full bg-transparent outline-none"
                  />
                </Input>

                <Input icon={Calendar} error={errors.dob}>
                  <input
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                    type="date"
                    className="w-full bg-transparent outline-none"
                  />
                </Input>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input icon={Users} error={errors.gender}>
                  <select
                    {...register("gender", {
                      required: "Please select gender",
                    })}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Input>

                <Input icon={GraduationCap} error={errors.course}>
                  <select
                    {...register("course", {
                      required: "Please select a course",
                    })}
                    className="w-full bg-transparent outline-none"
                  >
                    <option value="">
                      {courseLoading ? "Loading Courses..." : "Select Course"}
                    </option>

                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </Input>
              </div>

              <Input icon={Clock} error={errors.batch}>
                <select
                  {...register("batch", {
                    required: "Please select a batch",
                  })}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Select Batch</option>
                  <option>Morning (6 AM - 9 AM)</option>
                  <option>Day (10 AM - 2 PM)</option>
                  <option>Evening (3 PM - 7 PM)</option>
                </select>
              </Input>

              <div>
                <div
                  className={`flex gap-3 border rounded-xl p-4 ${
                    errors.address
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <MapPin
                    className={
                      errors.address
                        ? "text-red-500 mt-1"
                        : "text-sky-600 mt-1"
                    }
                  />

                  <textarea
                    {...register("address", {
                      required: "Address is required",
                    })}
                    rows={3}
                    placeholder=" Address"
                    className="w-full bg-transparent outline-none resize-none"
                  />
                </div>

                {errors.address && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 border border-gray-200 rounded-xl bg-gray-50 p-4">
                <MessageSquare className="text-sky-600 mt-1" />

                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Additional Information"
                  className="w-full bg-transparent outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 accent-sky-600"
                />
                I agree to the Terms & Conditions.
              </label>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-4 text-white font-bold transition flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}