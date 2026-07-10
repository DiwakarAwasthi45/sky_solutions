"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Pencil,
  Trash2,
  Plus,
  BookOpen,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";


export default function page() {

  const [courses,setCourses] = useState([]);

  const [loading,setLoading] = useState(true);

  const [selectedCourse,setSelectedCourse] = useState(null);

  const [deleting,setDeleting] = useState(false);

  const [search,setSearch] = useState("");





  // FETCH COURSES

  const fetchCourses = async()=>{

    try{

      setLoading(true);

      const res = await axios.get(
        "/api/courses"
      );


      if(res.data.success){

        setCourses(res.data.data);

      }


    }catch(error){

      toast.error(
        "Failed to load courses"
      );

    }
    finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    fetchCourses();

  },[]);

  // DELETE COURSE

  const deleteCourse = async()=>{


    if(!selectedCourse?._id){

      toast.error(
        "Course id missing"
      );

      return;

    }


    try{

      setDeleting(true);


      const res = await axios.delete(
        `/api/courses/${selectedCourse._id}`
      );



      if(res.data.success){


        toast.success(
          "Course deleted successfully",
          {
            autoClose:2000
          }
        );



        setCourses(prev=>
          prev.filter(
            item =>
            item._id !== selectedCourse._id
          )
        );


        setSelectedCourse(null);

      }



    }catch(error){


      console.log(error);


      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );


    }finally{

      setDeleting(false);

    }


  };





  const filteredCourses =
  courses.filter(course=>

    course.title
    .toLowerCase()
    .includes(search.toLowerCase())

  );






return (

<div className="
min-h-screen
bg-gray-50
p-6
md:p-10
">


<div className="
max-w-7xl
mx-auto
">





{/* HEADER */}

<div className="
flex
flex-col
md:flex-row
justify-between
gap-5
mb-8
">


<div>

<h1 className="
text-4xl
font-bold
text-gray-900
">

Courses

</h1>


<p className="
text-gray-500
mt-2
">

Manage your institute courses

</p>


</div>





<Link

href="/admin/courses/create"

className="
flex
items-center
justify-center
gap-2
bg-[#1C8BCA]
text-white
px-6
py-3
rounded-xl
font-semibold
hover:bg-sky-700
transition
"

>

<Plus size={20}/>

Add Course

</Link>



</div>






{/* SEARCH */}

<div className="
bg-white
rounded-xl
border border-gray-200
mb-6
">


<div className="
flex
items-center
gap-3
border border-gray-300
rounded-lg
px-4
">


<Search
className="text-gray-400"
/>


<input

value={search}

onChange={
e=>setSearch(e.target.value)
}

placeholder="Search course..."

className="
w-full
py-3
outline-none
"

/>


</div>


</div>







{/* TABLE */}



<div className="
bg-white
rounded-2xl
shadow
overflow-hidden
border border-gray-200
">


<div className="
overflow-x-auto
">


<table className="w-full">


<thead className="
bg-gray-100
">


<tr>

<th className="p-5 text-left">
Image
</th>


<th className="p-5 text-left">
Course
</th>


<th className="p-5">
Duration
</th>


<th className="p-5">
Level
</th>


<th className="p-5">
Price
</th>


<th className="p-5">
Action
</th>


</tr>


</thead>






<tbody>


{

loading ?

<tr>

<td
colSpan="6"
className="text-center py-20"
>


<Loader2
className="
animate-spin
mx-auto
text-[#1C8BCA]
"
size={40}
/>


<p className="mt-3 text-gray-500">
Loading...
</p>


</td>

</tr>



:

filteredCourses.length===0 ?


<tr>

<td
colSpan="6"
className="text-center py-20"
>


<BookOpen
className="
mx-auto
text-gray-400
"
size={45}
/>


<p className="text-gray-500 mt-3">
No course found
</p>


</td>

</tr>



:


filteredCourses.map(course=>(


<tr

key={course._id}

className="
border-t
border-gray-200
hover:bg-gray-50
transition
"

>


<td className="p-5">


<img

src={course.image}

alt={course.title}

className="
w-24
h-16
rounded-xl
object-cover
"

/>


</td>





<td className="p-5">


<h3 className="
font-semibold
text-gray-900
">

{course.title}

</h3>


<p className="
text-sm
text-gray-500
">

/{course.slug}

</p>


</td>





<td className="p-5 text-center">

{course.duration} Months

</td>





<td className="p-5 text-center">

<span className="
bg-blue-100
text-blue-700
px-3
py-1
rounded-full
text-sm
">

{course.level}

</span>

</td>





<td className="p-5 text-center font-semibold">

Rs. {course.price}

</td>






<td className="p-5">


<div className="
flex
justify-center
gap-3
">


<Link

href={`/admin/courses/edit/${course._id}`}

className="
bg-yellow-500
text-white
p-3
rounded-xl
hover:bg-yellow-600
"

>

<Pencil size={18}/>

</Link>





<button

onClick={()=>setSelectedCourse(course)}

className="
bg-red-600
text-white
p-3
rounded-xl
hover:bg-red-700
"

>

<Trash2 size={18}/>

</button>



</div>


</td>



</tr>


))


}


</tbody>


</table>


</div>


</div>







{/* DELETE MODAL */}


{

selectedCourse &&


<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


<div className="
bg-white
rounded-2xl
p-8
w-full
max-w-md
">


<div className="
flex
justify-center
mb-4
">

<div className="
bg-red-100
p-4
rounded-full
">

<AlertTriangle
className="text-red-600"
size={30}
/>


</div>

</div>




<h2 className="
text-2xl
font-bold
text-center
">

Delete Course?

</h2>


<p className="
text-center
text-gray-500
mt-2
">

Are you sure you want to delete

<br/>

<b>
{selectedCourse.title}
</b>

?

</p>





<div className="
flex
gap-3
mt-7
">


<button

onClick={()=>
setSelectedCourse(null)
}

className="
flex-1
border
py-3
rounded-xl
"

>

Cancel

</button>





<button

disabled={deleting}

onClick={deleteCourse}

className="
flex-1
bg-red-600
text-white
py-3
rounded-xl
"

>


{

deleting

?

"Deleting..."

:

"Delete"

}


</button>


</div>



</div>


</div>


}



</div>


</div>

);

}