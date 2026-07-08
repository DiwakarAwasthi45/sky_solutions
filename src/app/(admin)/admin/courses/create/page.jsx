"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
} from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function ModuleItem({
  moduleIndex,
  control,
  register,
  removeModule,
}) {
  const {
    fields: topicFields,
    append: addTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: `syllabus.${moduleIndex}.topics`,
  });

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-5">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          Module {moduleIndex + 1}
        </h3>

        <button
          type="button"
          onClick={() => removeModule(moduleIndex)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          Remove Module
        </button>
      </div>


      {/* Module Name */}
      <input
        {...register(
          `syllabus.${moduleIndex}.module`,
          {
            required: true,
          }
        )}
        placeholder="Module Name"
        className="w-full border border-gray-200 rounded-lg p-3 mb-5"
      />


      {/* Topics */}
      <h4 className="font-medium mb-3">
        Topics
      </h4>

      {
        topicFields.map((topic, topicIndex) => (
          <div
            key={topic.id}
            className="flex gap-3 mb-3"
          >

            <input
              {...register(
                `syllabus.${moduleIndex}.topics.${topicIndex}.title`,
                {
                  required: true,
                }
              )}
              placeholder={`Topic ${topicIndex + 1}`}
              className="flex-1 border border-gray-200 rounded-lg p-3"
            />


            <button
              type="button"
              onClick={() =>
                removeTopic(topicIndex)
              }
              className="bg-red-500 text-white px-4 rounded-lg"
            >
              Delete
            </button>

          </div>
        ))
      }


      <button
        type="button"
        onClick={() =>
          addTopic({
            title: "",
          })
        }
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Topic
      </button>

    </div>
  );
}


export default function page() {

  const router = useRouter();

  const [loading,setLoading] = useState(false);


  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm({

    defaultValues: {

      title:"",
      slug:"",
      image:"",
      description:"",
      duration:"",
      level:"Beginner",
      price:"",

      syllabus:[
        {
          module:"",
          topics:[
            {
              title:""
            }
          ]
        }
      ]

    }

  });



  const {
    fields,
    append,
    remove

  } = useFieldArray({

    control,

    name:"syllabus"

  });



  const onSubmit = async(data)=>{

    try {

      setLoading(true);


      const res = await axios.post(
        "/api/courses",
        data
      );


      if(res.data.success){

        toast.success(
          "Course created successfully"
        );


        reset();


        router.push(
          "/admin/courses"
        );

      }


    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

    finally{

      setLoading(false);

    }

  };



  return (

    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">


      <h1 className="text-3xl font-bold mb-8">
        Create Course
      </h1>



      <form
        onSubmit={
          handleSubmit(onSubmit)
        }
        className="space-y-6"
      >


        {/* Title */}

        <input
          {...register("title",
          {
            required:true
          })}
          placeholder="Course Title"
          className="w-full border border-gray-200 rounded-lg p-3"
        />



        {/* Slug */}

        <input

          {...register("slug",
          {
            required:true
          })}

          placeholder="Slug"

          className="w-full border border-gray-200 rounded-lg p-3"

        />



        {/* Image */}

        <input

          {...register("image",
          {
            required:true
          })}

          placeholder="Image URL"

          className="w-full border border-gray-200 rounded-lg p-3"

        />



        {/* Description */}

        <textarea

          {...register("description",
          {
            required:true
          })}

          rows="5"

          placeholder="Description"

          className="w-full border border-gray-200 rounded-lg p-3"

        />




        <div className="grid md:grid-cols-3 gap-5">


          <input

            {...register("duration",
            {
              required:true
            })}

            placeholder="Duration"

            className="border border-gray-200 rounded-lg p-3"

          />



          <select

            {...register("level")}

            className="border border-gray-200 rounded-lg p-3"

          >

            <option>
              Beginner
            </option>

            <option>
              Intermediate
            </option>

            <option>
              Advanced
            </option>

          </select>




          <input

            {...register("price",
            {
              required:true
            })}

            placeholder="Price"

            className="border border-gray-200 rounded-lg p-3"

          />


        </div>





        {/* Syllabus */}


        <div>


          <div className="flex justify-between items-center mb-5">


            <h2 className="text-xl font-bold">
              Course Syllabus
            </h2>



            <button

              type="button"

              onClick={()=>append(
                {
                  module:"",
                  topics:[
                    {
                      title:""
                    }
                  ]
                }
              )}

              className="bg-[#0F5E8C] text-white px-4 py-2 rounded-lg"

            >

              + Add Module

            </button>


          </div>





          {
            fields.map(
              (field,index)=>(

                <ModuleItem

                  key={field.id}

                  moduleIndex={index}

                  control={control}

                  register={register}

                  removeModule={remove}

                />

              )
            )
          }


        </div>





        <button

          disabled={loading}
          className="w-full bg-[#0F5E8C] text-white py-3 rounded-lg hover:bg-sky-700"
        >

          {
            loading ? "Creating...":  "Create Course"
          }
        </button>
      </form>
    </div>
  );

}