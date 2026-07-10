"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

const numberInputClass = `${inputBase}
[appearance:textfield]
[-moz-appearance:textfield]
[&::-webkit-outer-spin-button]:appearance-none
[&::-webkit-inner-spin-button]:appearance-none`;

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1C8BCA]">
        <Icon size={17} />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      duration: "",
      price: "",
      level: "Beginner",
      status: "Active",
      image: null,
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

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      const course = res.data.course;

      reset({
        title: course.title || "",
        slug: course.slug || "",
        description: course.description || "",
        duration: course.duration ?? "",
        price: course.price ?? "",
        level: course.level || "Beginner",
        status: course.status || "Active",
        image: null,
        syllabus:
          course.syllabus?.length > 0
            ? course.syllabus
            : [
                {
                  module: "",
                  topics: [{ title: "" }],
                },
              ],
      });

      if (course.image) {
        setImagePreview(course.image);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load course");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    setValue("image", e.target.files, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("duration", data.duration);
      formData.append("price", data.price);
      formData.append("level", data.level);
      formData.append("status", data.status);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      } else if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("syllabus", JSON.stringify(data.syllabus || []));

      const res = await axios.put(`/api/courses/${id}`, formData);

      if (res.data.success) {
        toast.success("Course updated successfully");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Edit Course</h1>
          <p className="text-gray-500 mt-1">Update course information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <SectionHeader icon={Info} title="Basic Information" />

            <input
              {...register("title", { required: "Title required" })}
              placeholder="Course title"
              className=  {` ${inputBase} border-gray-300 bg-gray-100 `} 
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Description"
              className={`${inputBase} mt-5 border-gray-300 bg-gray-100 `}
            />

            <input
              {...register("slug")}
              placeholder="Slug"
              className={`${inputBase} mt-5 border-gray-300 bg-gray-100 `}
            />
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <SectionHeader icon={Settings2} title="Pricing & Details" />
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="number"
                {...register("duration")}
                placeholder="Duration"
                className=  {` ${numberInputClass} border-gray-300 bg-gray-100 `} 
              />
              <input
                type="number"
                {...register("price")}
                placeholder="Price"
                className=  {` ${numberInputClass} border-gray-300 bg-gray-100 `} 
              />
              <select {...register("level")} className=  {` ${inputBase} border-gray-300 bg-gray-100 `}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <select {...register("status")} className=  {` ${inputBase} border-gray-300 bg-gray-100 `}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <SectionHeader icon={ImagePlus} title="Course Image" />
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-[#1C8BCA]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <>
                  <UploadCloud />
                  <p>Upload image</p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleImagePick}
                className="hidden"
              />
            </label>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <SectionHeader icon={ListChecks} title="Course Syllabus" />

            {modules.map((module, index) => (
              <ModuleField
                key={module.id}
                control={control}
                register={register}
                moduleIndex={index}
                removeModule={() => removeModule(index)}
                canRemove={modules.length > 1}
              />
            ))}

            <button
              type="button"
              onClick={() =>
                addModule({
                  module: "",
                  topics: [{ title: "" }],
                })
              }
              className="mt-5 w-full border-dashed border-2 rounded-xl py-3 text-[#1C8BCA]"
            >
              <Plus size={18} className="inline" /> Add Module
            </button>
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/courses")}
              className="px-6 py-3"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-[#1C8BCA] text-white px-8 py-3 rounded-lg flex gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModuleField({ control, register, moduleIndex, removeModule, canRemove }) {
  const {
    fields: topics,
    append: addTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `syllabus.${moduleIndex}.topics`,
  });

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-bold">Module {moduleIndex + 1}</h3>
        {canRemove && (
          <button type="button" onClick={removeModule} className="text-red-500">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <input
        {...register(`syllabus.${moduleIndex}.module`)}
        placeholder="Module name"
        className=  {` ${inputBase} border-gray-300 bg-gray-100 `} 
      />

      {topics.map((topic, index) => (
        <div key={topic.id} className="flex gap-2 mt-3">
          <input
            {...register(`syllabus.${moduleIndex}.topics.${index}.title`)}
            placeholder="Topic"
            className=  {` ${inputBase} border-gray-300 bg-gray-100 `} 
          />
          {topics.length > 1 && (
            <button type="button" onClick={() => removeTopic(index)}>
              <X />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => addTopic({ title: "" })}
        className="mt-3 text-[#1C8BCA]"
      >
        <Plus size={15} className="inline" /> Add Topic
      </button>
    </div>
  );
}