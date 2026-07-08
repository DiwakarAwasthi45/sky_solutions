'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert('❌ Passwords do not match!')
      return
    }

    console.log(form)
    alert('Account created successfully!')
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1877AE] via-[#1C8BCA] to-[#0E5C89] px-6">

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white">

          <h1 className="text-4xl font-black">
            Join Sky Solutions 🚀
          </h1>

          <p className="mt-4 text-blue-100 leading-7">
            Create your account and start learning professional IT courses.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-10">

          <h2 className="text-3xl font-bold text-gray-900">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* NAME */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 py-3 border rounded-xl"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 py-3 border rounded-xl"
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
                className="w-full pl-10 pr-10 py-3 border rounded-xl"
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

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />

              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border rounded-xl"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#1C8BCA] text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1C8BCA] font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </section>
  )
}