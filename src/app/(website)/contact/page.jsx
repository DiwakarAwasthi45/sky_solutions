'use client'

import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error(result.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            Get In Touch
          </h2>
          <p className="mt-4 text-gray-600">
            We are here to help you. Send us a message anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT - FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Form
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className={`w-full rounded-xl border  border-gray-300  p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA] text-gray-900 placeholder:text-gray-400 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`w-full rounded-xl border  border-gray-300  p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA] text-gray-900 placeholder:text-gray-400 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className={`w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA] text-gray-900 placeholder:text-gray-400 ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#1C8BCA] text-white py-4 rounded-xl font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

            </form>

            {/* QUICK INFO */}
            <div className="mt-8 space-y-3 text-gray-600">

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#1C8BCA]" />
                +977-9867868324
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#1C8BCA]" />
               Skysolutions1987@gmail.com
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#1C8BCA]" />
                Bedkot-3, Kanchanpur, Nepal
              </div>

            </div>

          </div>

          {/* RIGHT - MAP */}
          <div className="rounded-3xl overflow-hidden shadow-lg h-[600px] w-full">

            <iframe
              src="https://www.google.com/maps?q=Bedkot+Nagarpalika-3+Shamadaiji+Kanchanpur+Nepal&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>

          </div>

        </div>

      </div>
    </section>
  )
}