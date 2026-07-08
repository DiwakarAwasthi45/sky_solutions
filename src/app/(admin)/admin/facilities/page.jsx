"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil,Trash2,Plus } from "lucide-react";

export default function page(){

const [facilities,setFacilities]=useState([]);
const [loading,setLoading]=useState(false);
const fetchFacilities = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/facilities");

      if (data.success) {
        setFacilities(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch facilities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const deleteFacility = async (id) => {
    if (!confirm("Delete this Facility?")) return;

    try {
      const { data } = await axios.delete(`/api/facilities/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchFacilities();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete facility."
      );
    }
  };

return(

<div className="p-6">


<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">
Facilities
</h1>


<Link
href="/admin/facilities/create"
className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex items-center gap-2"
>

<Plus size={18}/>
Add Facility

</Link>


</div>



<div className="bg-white border border-gray-200 rounded-xl shadow overflow-x-auto">


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
Status
</th>

<th className="p-3 text-left">
Action
</th>

</tr>

</thead>



<tbody>


{
facilities.length?

facilities.map(item=>(

<tr
key={item._id}
className="border-t"
>


<td className="p-3">

<img
src={item.image}
className="w-16 h-16 rounded object-cover"
/>

</td>



<td className="p-3 font-semibold">

{item.title}

</td>



<td className="p-3">

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



<td className="p-3">

<div className="flex gap-2">


<Link
href={`/admin/facilities/edit/${item._id}`}
className="bg-yellow-500 text-white p-2 rounded"
>

<Pencil size={16}/>

</Link>


<button
onClick={()=>deleteFacility(item._id)}
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
No facilities found
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