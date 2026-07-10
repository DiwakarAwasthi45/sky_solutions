"use client";

import { useEffect,useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

export default function page(){

const [enrollments,setEnrollments]=useState([]);
const [loading,setLoading]=useState(true);


  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/enrollments");

      if (data.success) {
        setEnrollments(data.data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch enrollments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const deleteEnrollment = async (id) => {
    if (!confirm("Delete this enrollment?")) return;

    try {
      const { data } = await axios.delete(`/api/enrollments/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchEnrollments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete enrollment."
      );
    }
  };


return(

<div className="p-6">


<h1 className="text-3xl font-bold mb-6">
Enrollments
</h1>



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
Student
</th>

<th className="p-4 text-left">
Course
</th>

<th className="p-4 text-left">
Phone
</th>

<th className="p-4 text-left">
Batch
</th>

<th className="p-4 text-left">
Payment
</th>

<th className="p-4 text-left">
Status
</th>

<th className="p-4 text-left">
Action
</th>

</tr>

</thead>


<tbody>


{
enrollments.length ?

enrollments.map(item=>(


<tr
key={item._id}
className="border-t border-gray-200"
>


<td className="p-4">

<p className="font-semibold">
{item.fullName}
</p>

<p className="text-sm text-gray-500">
{item.email}
</p>

</td>



<td className="p-4">

{
item.course?.title || "N/A"
}

</td>



<td className="p-4">

{item.phone}

</td>



<td className="p-4">

{item.batch}

</td>



<td className="p-4">


<select
value={item.paymentStatus}
onChange={(e)=>
updatePayment(
item._id,
e.target.value
)
}
className="border border-gray-200 rounded p-2"
>


<option value="pending">
Pending
</option>


<option value="paid">
Paid
</option>


<option value="failed">
Failed
</option>


</select>


</td>



<td className="p-4">


<select
value={item.enrollmentStatus}
onChange={(e)=>
updateStatus(
item._id,
e.target.value
)
}
className="border border-gray-200 rounded p-2"
>


<option value="pending">
Pending
</option>


<option value="approved">
Approved
</option>


<option value="rejected">
Rejected
</option>


<option value="completed">
Completed
</option>


</select>


</td>



<td className="p-4">

<button
onClick={()=>deleteEnrollment(item._id)}
className="bg-red-600 text-white p-2 rounded"
>

<Trash2 size={16}/>

</button>

</td>


</tr>


))

:

<tr>

<td
colSpan="7"
className="p-8 text-center text-gray-500"
>
No enrollments found
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