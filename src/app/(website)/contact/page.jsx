'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
    alert('Message sent successfully!')
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900">
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

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#1C8BCA]"
                required
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#1C8BCA] text-white py-4 rounded-xl font-semibold hover:bg-sky-700 transition"
              >
                <Send size={18} />
                Send Message
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
                info@skysolutions.com
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#1C8BCA]" />
                Bedkot-3, Kanchanpur, Nepal
              </div>

            </div>

          </div>

          {/* RIGHT - MAP */}
          <div className="rounded-3xl overflow-hidden shadow-lg h-150 w-210">

              <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0500000000003!2d80.1789!3d28.9652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a1b1f3b3b3b3b3%3A0xabc123456789!2sMahendranagar%2C%20Kanchanpur!5e0!3m2!1sen!2snp!4v0000000000000"
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