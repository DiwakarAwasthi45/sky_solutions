"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Loader2,
  UploadCloud,
  Info,
  Settings2,
  ImagePlus,
  ListChecks,
  Plus,
  Trash2,
} from "lucide-react";

const inputBase =
  "w-full border rounded-lg p-3 outline-none transition focus:ring-2 focus:ring-[#1C8BCA]/30 focus:border-[#1C8BCA]";

const numberInputClass = `${inputBase} [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      features: [{ value: "" }],
      status: true,
      featured: false,
      image: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const titleValue = watch("title");

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

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const { onChange: onSlugChange, ...slugRegister } = register("slug", {
    required: "Slug is required",
  });

  const { onChange: onImageChange, ...imageRegister } = register("image", {
    required: "Service image is required",
  });

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const cleanedFeatures = data.features
        .map((f) => f.value.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("shortDescription", data.shortDescription);
      formData.append("description", data.description);
      formData.append("features", JSON.stringify(cleanedFeatures));
      formData.append("status", String(data.status));
      formData.append("featured", String(data.featured));
      formData.append("image", data.image[0]);

      const res = await axios.post("/api/services", formData);

      if (res.data.success) {
        toast.success("Service created successfully");
        router.push("/admin/services");
      } else {
        toast.error(res.data.message || "Failed to create service");
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
            Create Service
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to publish a new service.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Info} title="Basic Information" />

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className={`${inputBase} ${
                    errors.title ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="Service title"
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
                  placeholder="service-slug"
                />
                {errors.slug ? (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-1">
                    Auto-generated from the title — used in the service URL.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("shortDescription", {
                    required: "Short description is required",
                  })}
                  rows={3}
                  className={`${inputBase} resize-none ${
                    errors.shortDescription
                      ? "border-red-400"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  placeholder="Short summary of the service"
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.shortDescription.message}
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
                  rows={6}
                  className={`${inputBase} resize-none ${
                    errors.description
                      ? "border-red-400"
                      : "border-gray-300 bg-gray-100"
                  }`}
                  placeholder="Full details about the service"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={ListChecks} title="Features" />

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field._id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <input
                      {...register(`features.${index}.value`, {
                        required: "Feature cannot be empty",
                      })}
                      className={`${inputBase} ${
                        errors.features?.[index]?.value
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {errors.features?.[index]?.value && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.features[index].value.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="mt-1 p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    aria-label="Remove feature"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C8BCA] hover:text-sky-700 transition"
            >
              <Plus size={16} />
              Add Feature
            </button>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={Settings2} title="Status & Featured" />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  {...register("status")}
                  className={`${inputBase} border-gray-300 bg-gray-100`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Featured
                </label>
                <select
                  {...register("featured")}
                  className={`${inputBase} border-gray-300 bg-gray-100`}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <SectionHeader icon={ImagePlus} title="Service Image" />

            <label
              htmlFor="service-image"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition hover:border-[#1C8BCA] hover:bg-sky-50 ${
                errors.image ? "border-red-400" : "border-gray-200"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Service preview"
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
                id="service-image"
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/services")}
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
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}