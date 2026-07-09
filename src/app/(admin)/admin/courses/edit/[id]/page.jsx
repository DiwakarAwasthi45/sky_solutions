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
        Edit Course
      </h1>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-white p-6 rounded-xl shadow"
      >


        <input
          {...register("title")}
          placeholder="Course Title"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <input
          {...register("slug")}
          placeholder="Slug"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <input
          {...register("image")}
          placeholder="Image URL"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <textarea
          {...register("description")}
          placeholder="Description"
          rows="5"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <input
          {...register("duration")}
          placeholder="Duration"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <input
          {...register("price")}
          placeholder="Price"
          className="w-full border  border-gray-200 p-3 rounded"
        />


        <select
          {...register("level")}
          className="w-full border  border-gray-200 p-3 rounded"
        >
          <option value="">
            Select Level
          </option>

          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>

        </select>



        {/* Topics */}

        <div>

          <div className="flex justify-between mb-3">

            <h2 className="font-semibold">
              Course Topics
            </h2>

            <button
              type="button"
              onClick={() => append({ name: "" })}
              className="bg-[#0F5E8C] text-white px-4 py-2 rounded"
            >
              + Add Topic
            </button>

          </div>


          {
            fields.map((field,index)=>(
              <div
                key={field.id}
                className="flex gap-3 mb-3"
              >

                <input
                  {...register(
                    `topics.${index}.name`
                  )}
                  placeholder="Topic name"
                  className="flex-1 border border-gray-200 p-3 rounded"
                />


                {
                  fields.length > 1 &&
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white px-4 rounded"
                  >
                    Remove
                  </button>
                }


              </div>
            ))
          }


        </div>



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