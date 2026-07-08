"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil,Trash2,Plus } from "lucide-react";

export default function page(){

const [gallery,setGallery]=useState([]);
const [loading,setLoading]=useState(false);

 const fetchGallery = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/gallery");

      if (data.success) {
        setGallery(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch Gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const deleteGallery = async (id) => {
    if (!confirm("Delete this gallery?")) return;

    try {
      const { data } = await axios.delete(`/api/gallery/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchGallery();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete gallery."
      );
    }
  };




return(

<div className="p-6">


<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">
Gallery
</h1>


<Link
href="/admin/gallery/create"
className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex items-center gap-2"
>

<Plus size={18}/>

Add Gallery

</Link>


</div>



<div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">


{
loading?

<div className="p-10 text-center">
Loading...
</div>

:

<table className="w-full">


<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">
Image
</th>

<th className="p-3 text-left">
Title
</th>

<th className="p-3 text-left">
Category
</th>

<th className="p-3 text-left">
Action
</th>

</tr>

</thead>



<tbody>


{
gallery.length?

gallery.map(item=>(


<tr
key={item._id}
className="border-t"
>


<td className="p-3">

<img
src={item.image}
className="w-20 h-16 rounded object-cover"
/>

</td>



<td className="p-3 font-semibold">

{item.title}

</td>



<td className="p-3">

{item.category || "-"}

</td>



<td className="p-3">


<div className="flex gap-2">


<Link
href={`/admin/gallery/edit/${item._id}`}
className="bg-yellow-500 text-white p-2 rounded"
>

<Pencil size={16}/>

</Link>


<button
onClick={()=>deleteGallery(item._id)}
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
colSpan="4"
className="text-center p-8"
>

No gallery found

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