"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {
User,
Mail,
Phone,
MapPin,
Calendar,
Users,
BookOpen,
MessageSquare,
CheckCircle2
} from "lucide-react";


const courseOptions = [
"Basic Computer",
"Advanced Computer",
"MS Office Package",
"Graphic Design",
"Web Design",
"Web Development",
"Python Programming",
"Digital Marketing",
"Computer Hardware & Networking",
"Video Editing",
"Accounting Package (Tally)",
];


export default function Page(){

const [loading,setLoading]=useState(false);


const {
register,
handleSubmit,
reset
}=useForm({

defaultValues:{
fullName:"",
email:"",
phone:"",
gender:"",
dob:"",
address:"",
course:"",
batch:"",
message:""
}

});



const onSubmit=async(data)=>{

try{

setLoading(true);


const res=await axios.post(
"/api/enrollments",
data
);


if(res.data.success){

toast.success(
"Enrollment submitted successfully"
);

reset();

}


}catch(error){

toast.error(
error.response?.data?.message ||
"Submission failed"
);

}finally{

setLoading(false);

}

};




const features=[

"Professional IT Training",
"Experienced Trainers",
"Practical Hands-on Classes",
"Job & Internship Guidance",
"Industry Certificate"

];



return(

<section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-10 sm:py-16">


<div className="max-w-7xl mx-auto px-4 sm:px-6">


<div className="grid lg:grid-cols-2 gap-10 items-start">



{/* LEFT */}

<div className="lg:sticky lg:top-20">


<span className="inline-block bg-sky-100 text-[#1C8BCA] px-4 py-2 rounded-full text-sm font-semibold">

Join Sky Solution

</span>



<h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-6">

Start Your

<span className="text-[#1C8BCA]">
 IT Journey
</span>

</h1>



<p className="mt-5 text-gray-600 leading-7">

Fill the enrollment form and our admission team will contact you shortly.

</p>




<div className="mt-8 space-y-4">


{
features.map(item=>(

<div
key={item}
className="flex items-center gap-3"
>

<CheckCircle2
className="text-[#1C8BCA]"
size={22}
/>


<span className="text-gray-700">
{item}
</span>


</div>

))
}


</div>


</div>






{/* FORM */}


<div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-5 sm:p-8">


<h2 className="text-2xl sm:text-3xl font-bold">

Course Enrollment

</h2>


<p className="text-gray-500 mt-2 mb-6">

Provide your details to apply.

</p>




<form
onSubmit={handleSubmit(onSubmit)}
className="space-y-5"
>




<div className="grid sm:grid-cols-2 gap-4">



<div className="inputBox">

<User/>

<input
{...register("fullName")}
placeholder="Full Name"
/>

</div>



<div className="inputBox">

<Mail/>

<input
{...register("email")}
type="email"
placeholder="Email Address"
/>

</div>


</div>





<div className="grid sm:grid-cols-2 gap-4">


<div className="inputBox">

<Phone/>

<input
{...register("phone")}
placeholder="Mobile Number"
/>

</div>




<div className="inputBox">

<Calendar/>

<input
{...register("dob")}
type="date"
/>

</div>


</div>





<div className="grid sm:grid-cols-2 gap-4">



<div className="inputBox">

<Users/>


<select
{...register("gender")}
>

<option value="">
Select Gender
</option>

<option>
Male
</option>

<option>
Female
</option>

<option>
Other
</option>

</select>


</div>





<div className="inputBox">


<BookOpen/>


<select
{...register("course")}
>


<option value="">
Select Course
</option>


{
courseOptions.map(course=>(

<option
key={course}
value={course}
>

{course}

</option>

))
}


</select>


</div>


</div>





<select
{...register("batch")}
className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#1C8BCA]"
>


<option value="">
Select Batch
</option>


<option>
Morning 6 AM - 9 AM
</option>


<option>
Day 10 AM - 2 PM
</option>


<option>
Evening 3 PM - 7 PM
</option>


</select>






<div className="flex border border-gray-200 rounded-xl p-3">


<MapPin size={20}/>


<textarea

{...register("address")}

rows="3"

placeholder="Residential Address"

className="ml-3 w-full outline-none resize-none"

/>


</div>







<div className="flex border border-gray-200 rounded-xl p-3">


<MessageSquare size={20}/>


<textarea

{...register("message")}

rows="4"

placeholder="Additional Information"

className="ml-3 w-full outline-none resize-none"

/>


</div>







<label className="flex gap-2 items-center text-sm text-gray-600">


<input
type="checkbox"
required
/>


I agree to admission terms and conditions.


</label>






<button

disabled={loading}

className="w-full bg-[#1C8BCA] hover:bg-sky-700 text-white py-3 rounded-xl font-bold transition"

>


{
loading
?
"Submitting..."
:
"Submit Application →"
}


</button>




</form>


</div>


</div>


</div>


</section>

);

}