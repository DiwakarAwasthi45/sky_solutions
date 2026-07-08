"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function page(){

const router=useRouter();
const [loading,setLoading]=useState(false);

const {
register,
handleSubmit,
reset
}=useForm({
defaultValues:{
image:"",
title:"",
description:"",
status:true
}
});


const onSubmit=async(data)=>{

try{

setLoading(true);

const res=await axios.post(
"/api/facilities",
data
);


if(res.data.success){

toast.success(
"Facility created successfully"
);

reset();

router.push(
"/admin/facilities"
);

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
Create Facility
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
?
"Saving..."
:
"Create Facility"
}

</button>


</form>


</div>

);

}