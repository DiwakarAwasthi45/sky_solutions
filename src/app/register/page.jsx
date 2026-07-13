'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
const router = useRouter();

const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [submitting, setSubmitting] = useState(false);

const {
register,
handleSubmit,
watch,
formState: { errors },
} = useForm({
defaultValues: {
name: "",
email: "",
phone: "",
password: "",
confirmPassword: "",
},
mode: "onBlur",
});

const password = watch("password");

const onSubmit = async (formData) => {
try {
setSubmitting(true);

// Prepare payload (do not send confirmPassword)
const payload = {
name: formData.name.trim(),
email: formData.email.trim().toLowerCase(),
phone: formData.phone ? formData.phone.trim() : "",
password: formData.password,
};

const { data } = await axios.post("/api/auth/register", payload);

if (data?.success) {
toast.success("Account created! You can now log in.");
router.push("/login");
} else {
toast.error(data?.message || "Registration failed");
}
} catch (error) {
console.error(error);
toast.error(
error?.response?.data?.message || "Something went wrong. Please try again."
);
} finally {
setSubmitting(false);
}
};

return (
<main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
<div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
<h1 className="text-3xl font-black text-gray-900">Create Account</h1>
<p className="mt-2 text-gray-500">Join Sky Solutions Computer Institute to get started.</p>

<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
{/* Name */}
<div>
<label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
Full Name
</label>
<div className="relative">
<User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<input
id="name"
type="text"
placeholder="Your full name"
className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition focus:border-[#1877AE] focus:ring-1 focus:ring-[#1877AE] ${
errors.name ? "border-red-400" : "border-gray-200"
}`}
{...register("name", {
required: "Name is required",
minLength: { value: 2, message: "Name is too short" },
})}
/>
</div>
{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
</div>

{/* Email */}
<div>
<label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
Email
</label>
<div className="relative">
<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<input
id="email"
type="email"
placeholder="you@example.com"
className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition focus:border-[#1877AE] focus:ring-1 focus:ring-[#1877AE] ${
errors.email ? "border-red-400" : "border-gray-200"
}`}
{...register("email", {
required: "Email is required",
pattern: {
value: /^[^\s@]+@[^\s@]+.[^\s@]+$/,
message: "Enter a valid email address",
},
})}
/>
</div>
{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
</div>

{/* Phone */}
<div>
<label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
Phone <span className="font-normal text-gray-400">(optional)</span>
</label>
<div className="relative">
<Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<input
id="phone"
type="tel"
placeholder="+977-98XXXXXXXX"
className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition focus:border-[#1877AE] focus:ring-1 focus:ring-[#1877AE] ${
errors.phone ? "border-red-400" : "border-gray-200"
}`}
{...register("phone", {
pattern: {
value: /^[0-9+-\s()]{6,15}$/,
message: "Enter a valid phone number",
},
})}
/>
</div>
{errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
</div>

{/* Password */}
<div>
<label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">
Password
</label>
<div className="relative">
<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<input
id="password"
type={showPassword ? "text" : "password"}
placeholder="At least 8 characters"
className={`w-full rounded-xl border py-3 pl-11 pr-11 outline-none transition focus:border-[#1877AE] focus:ring-1 focus:ring-[#1877AE] ${
errors.password ? "border-red-400" : "border-gray-200"
}`}
{...register("password", {
required: "Password is required",
minLength: { value: 8, message: "Password must be at least 8 characters" },
})}
/>
<button
type="button"
onClick={() => setShowPassword((v) => !v)}
className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
aria-label={showPassword ? "Hide password" : "Show password"}
>
{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
{errors.password && (
<p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
)}
</div>

{/* Confirm Password */}
<div>
<label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-gray-700">
Confirm Password
</label>
<div className="relative">
<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<input
id="confirmPassword"
type={showConfirm ? "text" : "password"}
placeholder="Re-enter your password"
className={`w-full rounded-xl border py-3 pl-11 pr-11 outline-none transition focus:border-[#1877AE] focus:ring-1 focus:ring-[#1877AE] ${
errors.confirmPassword ? "border-red-400" : "border-gray-200"
}`}
{...register("confirmPassword", {
required: "Please confirm your password",
validate: (value) => value === password || "Passwords do not match",
})}
/>
<button
type="button"
onClick={() => setShowConfirm((v) => !v)}
className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
aria-label={showConfirm ? "Hide password" : "Show password"}
>
{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
{errors.confirmPassword && (
<p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
)}
</div>

<button
type="submit"
disabled={submitting}
className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877AE] py-3.5 font-semibold text-white transition hover:bg-[#145f8b] disabled:cursor-not-allowed disabled:opacity-60"
>
{submitting ? "Creating Account..." : "Create Account"}
{!submitting && <ArrowRight size={18} />}
</button>
</form>

<p className="mt-8 text-center text-sm text-gray-500">
Already have an account?{" "}
<Link href="/login" className="font-semibold text-[#1877AE] hover:underline">Log in</Link>
</p>
</div>
</main>
);
}