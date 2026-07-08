'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
    alert('Login successful!')
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6">

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - INFO */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white">

          <h1 className="text-4xl font-black">
            Welcome Back 👋
          </h1>

          <p className="mt-4 text-blue-100 leading-7">
            Login to access your courses, enrollments, and learning dashboard
            at Sky Solutions Computer Institute.
          </p>

          <div className="mt-8 space-y-3 text-sm text-blue-100">
            <p>✔ Access all courses</p>
            <p>✔ Track your progress</p>
            <p>✔ Download certificates</p>
          </div>

        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="bg-white p-10">

          <h2 className="text-3xl font-bold text-gray-900">
            Login
          </h2>

          <p className="text-gray-500 mt-2">
            Please enter your details
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end text-sm">
              <Link href="#" className="text-[#1C8BCA] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Login
            </button>

          </form>

          {/* SIGNUP */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Don’t have an account?{' '}
            <Link href="/register" className="text-[#1C8BCA] font-semibold">
              Sign up
            </Link>
          </p>

        </div>

      </div>

    </section>
  )
}