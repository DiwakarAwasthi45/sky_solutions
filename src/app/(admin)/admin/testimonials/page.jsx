"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil,Trash2 } from "lucide-react";

export default function Page(){

const [testimonials,setTestimonials]=useState([]);
const [loading,setLoading]=useState(true);


const fetchTestimonials=async()=>{

try{

setLoading(true);

const res=await axios.get("/api/testimonials");

if(res.data.success){

setTestimonials(res.data.data || res.data.testimonials || []);

}

}catch(error){

toast.error(
error.response?.data?.message ||
"Failed to fetch testimonials"
);

}finally{

setLoading(false);

}

};


useEffect(()=>{

fetchTestimonials();

},[]);



const deleteTestimonial=async(id)=>{

if(!confirm("Delete this testimonial?")) return;


try{

const res=await axios.delete(
`/api/testimonials/${id}`
);


if(res.data.success){

toast.success(
"Testimonial deleted"
);

fetchTestimonials();

}


}catch(error){

toast.error(
error.response?.data?.message ||
"Delete failed"
);

}

};



return(

<div className="p-6">


<div className="flex justify-between items-center mb-6">

<div>

<h1 className="text-3xl font-bold">
Testimonials
</h1>

<p className="text-gray-500">
Manage institute testimonials.
</p>

</div>


<Link
href="/admin/testimonials/create"
className="bg-[#0F5E8C] text-white px-5 py-3 rounded-lg"
>
+ Add Testimonial
</Link>


</div>



<div className="bg-white rounded-xl shadow overflow-x-auto">


{
loading?

<div className="p-10 text-center">
Loading...
</div>

:

<table className="w-full">


<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">
Image
</th>

<th className="p-4 text-left">
Name
</th>

<th className="p-4 text-left">
Course
</th>

<th className="p-4 text-left">
Message
</th>

<th className="p-4 text-left">
Rating
</th>

<th className="p-4 text-left">
Status
</th>

<th className="p-4 text-center">
Action
</th>

</tr>

</thead>



<tbody>


{
testimonials.length?

testimonials.map(item=>(


<tr
key={item._id}
className="border-t border-gray-200"
>


<td className="p-4">

<img
src={item.image}
className="w-14 h-14 rounded-full object-cover"
/>

</td>



<td className="p-4 font-semibold">

{item.name}

</td>



<td className="p-4">

{item.course}

</td>



<td className="p-4 max-w-xs">

{item.message}

</td>



<td className="p-4">

{"⭐".repeat(item.rating)}

</td>



<td className="p-4">

{
item.status?

<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
Active
</span>

:

<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
Inactive
</span>
}

</td>



<td className="p-4">

<div className="flex justify-center gap-2">


<Link
href={`/admin/testimonials/edit/${item._id}`}
className="bg-yellow-500 text-white p-2 rounded"
>

<Pencil size={16}/>

</Link>



<button
onClick={()=>deleteTestimonial(item._id)}
className="bg-red-600 text-white p-2 rounded"
>

<Trash2 size={16}/>

</button>


</div>

</td>


</tr>


))

:

<tr>

<td
colSpan="7"
className="p-8 text-center text-gray-500"
>
No testimonials found.
</td>

</tr>

}


</tbody>


</table>

}


</div>


</div>

);

}