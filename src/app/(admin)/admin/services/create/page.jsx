"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function page(){

const router=useRouter();
const [loading,setLoading]=useState(false);

const {register,handleSubmit,reset}=useForm({
defaultValues:{
title:"",
slug:"",
image:"",
shortDescription:"",
description:"",
status:true,
featured:false
}
});


const onSubmit=async(data)=>{

try{

setLoading(true);

const res=await axios.post(
"/api/services",
data
);


if(res.data.success){

toast.success("Service created successfully");

reset();

router.push("/admin/services");

}

}catch(error){

toast.error(
error.response?.data?.message ||
"Something went wrong"
);

}finally{

setLoading(false);

}

};


return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">
Create Service
</h1>


<form
onSubmit={handleSubmit(onSubmit)}
className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm"
>


<input
{...register("title")}
placeholder="Service Title"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<input
{...register("slug")}
placeholder="Slug"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<input
{...register("image")}
placeholder="Image URL"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<input
{...register("shortDescription")}
placeholder="Short Description"
className="w-full border border-gray-200 rounded-lg p-3"
/>


<textarea
{...register("description")}
placeholder="Description"
rows="5"
className="w-full border border-gray-200 rounded-lg p-3"
/>



<div className="flex gap-6">


<label className="flex items-center gap-2">

<input
type="checkbox"
{...register("status")}
/>

Active

</label>



<label className="flex items-center gap-2">

<input
type="checkbox"
{...register("featured")}
/>

Featured

</label>


</div>



<button
disabled={loading}
className="bg-[#0F5E8C] text-white px-6 py-3 rounded-lg"
>

{
loading
?
"Saving..."
:
"Create Service"
}

</button>


</form>


</div>

);

}