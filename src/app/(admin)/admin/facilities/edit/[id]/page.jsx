"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function page() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      description: "",
      duration: "",
      price: "",
      level: "",
      topics: [{ name: "" }],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  });


  // Fetch Single Course
  useEffect(() => {
    if (id) {
      getCourse();
    }
  }, [id]);


  const getCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);

      const course = res.data.course;

      reset({
        title: course.title,
        slug: course.slug,
        image: course.image,
        description: course.description,
        duration: course.duration,
        price: course.price,
        level: course.level,
        topics: course.topics?.map((item) => ({
          name: item.name,
        })) || [{ name: "" }],
      });

    } catch (error) {
      toast.error("Failed to load course");
    } finally {
      setFetchLoading(false);
    }
  };


  // Update Course
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `/api/courses/${id}`,
        data
      );


      if (res.data.success) {
        toast.success("Course updated successfully");

        router.push("/admin/courses");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );

    } finally {
      setLoading(false);
    }
  };


  if (fetchLoading) {
    return (
      <div className="p-10 text-center">
        Loading course...
      </div>
    );
  }


  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Services
      </h1>

<form
onSubmit={handleSubmit(onSubmit)}
className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm"
>


<input
{...register("title")}
placeholder="Facility Title"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<input
{...register("image")}
placeholder="Image URL"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<textarea
{...register("description")}
placeholder="Facility Description"
rows="5"
className="w-full border border-gray-200 rounded-lg p-3"
/>



<label className="flex items-center gap-2">

<input
type="checkbox"
{...register("status")}
/>

Active

</label>
 <button
          disabled={loading}
          className="bg-[#0F5E8C] text-white px-6 py-3 rounded-lg"
        >

          {
            loading 
            ? "Updating..."
            : "Update Course"
          }

        </button>

</form>    

    </div>
  );
}