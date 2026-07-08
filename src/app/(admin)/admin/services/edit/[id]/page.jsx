"use client";

import { useEffect,useState } from "react";
import { useRouter,useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

export default function page(){

const router=useRouter();
const {id}=useParams();

const [loading,setLoading]=useState(false);
const [fetching,setFetching]=useState(true);


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


// Fetch Single Service

const getService=async()=>{

try{

const res=await axios.get(
`/api/services/${id}`
);

const service=res.data.service;

reset({
title:service.title,
slug:service.slug,
image:service.image,
shortDescription:service.shortDescription,
description:service.description,
status:service.status,
featured:service.featured
});


}catch(error){

toast.error("Failed to load service");

}finally{

setFetching(false);

}

};


useEffect(()=>{

if(id) getService();

},[id]);



// Update Service

const onSubmit=async(data)=>{

try{

setLoading(true);

const res=await axios.put(
`/api/services/${id}`,
data
);


if(res.data.success){

toast.success(
"Service updated successfully"
);

router.push(
"/admin/services"
);

}


}catch(error){

toast.error(
error.response?.data?.message ||
"Update failed"
);

}finally{

setLoading(false);

}

};



if(fetching){

return(
<div className="p-6">
Loading...
</div>
);

}



return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">
Edit Service
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
loading?
"Updating..."
:
"Update Service"
}

</button>


</form>


</div>

);

}