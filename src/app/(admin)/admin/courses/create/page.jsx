"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Loader2,
  UploadCloud,
  X,
  Info,
  Settings2,
  ImagePlus,
  ListChecks,
} from "lucide-react";

const inputBase =
  "w-full border rounded-lg p-3 outline-none transition focus:ring-2 focus:ring-[#1C8BCA]/30 focus:border-[#1C8BCA]";

const numberInputClass = `${inputBase} [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`;

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

export default function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      level: "Beginner",
      status: "Active",
      syllabus: [
        {
          module: "",
          topics: [{ title: "" }],
        },
      ],
    },
  });

  const {
    fields: modules,
    append: addModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "syllabus",
  });

  const titleValue = watch("title");

  // Auto-fill slug from title until the user edits slug manually
  useEffect(() => {
    if (slugEdited || !titleValue) return;

    const generated = titleValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setValue("slug", generated);
  }, [titleValue, slugEdited, setValue]);

  // Revoke old preview URLs so they don't leak memory
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const { onChange: onSlugChange, ...slugRegister } = register("slug", {
    required: "Slug is required",
  });

  const { onChange: onImageChange, ...imageRegister } = register("image", {
    required: "Course image is required",
  });

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("duration", data.duration);
      formData.append("level", data.level);
      formData.append("price", data.price);
      formData.append("status", data.status);
      formData.append("image", data.image[0]);
      formData.append("syllabus", JSON.stringify(data.syllabus));

      const res = await axios.post("/api/courses", formData);

      if (res.data.success) {
        toast.success("Course created successfully");
        router.push("/admin/courses");
      } else {
        toast.error(res.data.message || "Failed to create course");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Course
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to publish a new course.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Info} title="Basic Information" />

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className={`${inputBase} ${
                    errors.title ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Web Development"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  {...slugRegister}
                  onChange={(e) => {
                    onSlugChange(e);
                    setSlugEdited(true);
                  }}
                  className={`${inputBase} ${
                    errors.slug ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="web-development"
                />
                {errors.slug ? (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-1">
                    Auto-generated from the title — used in the course URL.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={5}
                  className={`${inputBase} resize-none ${
                    errors.description ? "border-red-400" : "border-gray-300 bg-gray-100"
                  }`}
                  placeholder="What will students learn in this course?"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Pricing & Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Settings2} title="Pricing & Details" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Duration (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("duration", {
                    required: "Required",
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                  placeholder="e.g. 6"
                  className={`${numberInputClass} ${
                    errors.duration ? "border-red-400" : "border-gray-300 bg-gray-100"
                  }`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("price", {
                    required: "Required",
                    min: { value: 0, message: "Must be 0 or more" },
                  })}
                  placeholder="e.g. 15000"
                  className=  {` ${numberInputClass} border-gray-300 bg-gray-100 `} 
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Level
                </label>
                <select
                  {...register("level")}
                  className=  {` ${inputBase} border-gray-300 bg-gray-100 `}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  {...register("status")}
                  className={`${inputBase} border-gray-200 bg-white`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          {/* Course Image */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={ImagePlus} title="Course Image" />

            <label
              htmlFor="course-image"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition hover:border-[#1C8BCA] hover:bg-sky-50 ${
                errors.image ? "border-red-400" : "border-gray-200"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Course preview"
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
                id="course-image"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.image.message}
              </p>
            )}
          </section>

          {/* Syllabus */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader icon={ListChecks} title="Course Syllabus" />

            <div className="space-y-4">
              {modules.map((module, index) => (
                <ModuleField
                  key={module.id}
                  control={control}
                  register={register}
                  errors={errors}
                  moduleIndex={index}
                  onRemoveModule={() => removeModule(index)}
                  canRemoveModule={modules.length > 1}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                addModule({ module: "", topics: [{ title: "" }] })
              }
              className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-[#1C8BCA] font-semibold text-sm hover:border-[#1C8BCA] hover:bg-sky-50 transition"
            >
              <Plus size={18} />
              Add Module
            </button>
          </section>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/courses")}
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
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModuleField({
  control,
  register,
  errors,
  moduleIndex,
  onRemoveModule,
  canRemoveModule,
}) {
  const {
    fields: topics,
    append: addTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `syllabus.${moduleIndex}.topics`,
  });

  const moduleError = errors?.syllabus?.[moduleIndex]?.module;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Module {moduleIndex + 1}</h3>

        {canRemoveModule && (
          <button
            type="button"
            onClick={onRemoveModule}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <input
        {...register(`syllabus.${moduleIndex}.module`, {
          required: "Module name is required",
        })}
        placeholder="Module name (e.g. Introduction to React)"
        className={`${inputBase} ${
          moduleError ? "border-red-400" : "border-gray-200"
        }`}
      />
      {moduleError && (
        <p className="text-red-500 text-xs mt-1">{moduleError.message}</p>
      )}

      <div className="mt-4 space-y-2">
        {topics.map((topic, topicIndex) => {
          const topicError =
            errors?.syllabus?.[moduleIndex]?.topics?.[topicIndex]?.title;

          return (
            <div key={topic.id}>
              <div className="flex items-center gap-2">
                <input
                  {...register(
                    `syllabus.${moduleIndex}.topics.${topicIndex}.title`,
                    { required: "Topic title is required" }
                  )}
                  placeholder={`Topic ${topicIndex + 1}`}
                  className={`${inputBase} ${
                    topicError ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(topicIndex)}
                    className="text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {topicError && (
                <p className="text-red-500 text-xs mt-1">
                  {topicError.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => addTopic({ title: "" })}
        className="mt-3 flex items-center gap-1.5 text-sm text-[#1C8BCA] font-medium hover:underline"
      >
        <Plus size={14} />
        Add Topic
      </button>
    </div>
  );
}