"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil,Trash2,Plus } from "lucide-react";

export default function page(){

const [services,setServices]=useState([]);
const [loading,setLoading]=useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/services");

      if (data.success) {
        setServices(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteService = async (id) => {
    if (!confirm("Delete this Services?")) return;

    try {
      const { data } = await axios.delete(`/api/services/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchServices();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete Service."
      );
    }
  };


return(
<div className="p-6">

<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Services</h1>

<Link
href="/admin/services/create"
className="bg-[#0F5E8C] text-white px-5 py-3 rounded flex gap-2 items-center">
<Plus size={18}/> Add Service
</Link>

</div>


<div className="bg-white rounded-xl shadow overflow-x-auto">

{loading?
<div className="p-10 text-center">Loading...</div>
:

<table className="w-full">

<thead className="bg-gray-100">
<tr>
<th className="p-3 text-left">Image</th>
<th className="p-3 text-left">Title</th>
<th className="p-3 text-left">Status</th>
<th className="p-3 text-left">Featured</th>
<th className="p-3 text-left">Order</th>
<th className="p-3 text-left">Action</th>
</tr>
</thead>


<tbody>

{
services.length?
services.map(service=>(

<tr key={service._id} className="border-t border-gray-200">

<td className="p-3">
<img
src={service.image}
className="w-14 h-14 rounded object-cover"
/>
</td>


<td className="p-3">
<p className="font-semibold">{service.title}</p>
<p className="text-sm text-gray-500">{service.slug}</p>
</td>


<td className="p-3">
{
service.status?
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
{service.featured?"Yes":"No"}
</td>


<td className="p-3">
{service.order}
</td>


<td className="p-3">

<div className="flex gap-2">

<Link
href={`/admin/services/edit/${service._id}`}
className="bg-yellow-500 text-white p-2 rounded">
<Pencil size={16}/>
</Link>

<button
onClick={()=>deleteService(service._id)}
className="bg-red-600 text-white p-2 rounded">
<Trash2 size={16}/>
</button>

</div>

</td>


</tr>

))
:
<tr>
<td colSpan="6" className="text-center p-8">
No services found
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