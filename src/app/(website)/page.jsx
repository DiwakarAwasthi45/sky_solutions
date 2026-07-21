"use client";
import Link from "next/link";
import { ArrowRight,  Star,
    CheckCircle2, ImageIcon,  MapPin, Phone, Mail, Send
 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollReveal from "@/components/ScrollReveal";

 function page() {
   const [facilities, setFacilities] = useState([]);
      const [testimonials, setTestimonials] = useState([]);
            const [gallery, setGallery] = useState([]);
              const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);
  
 
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
      console.error(error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };
  
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
        console.error(error);
        toast.error("Failed to load facilities");
      } finally {
        setLoading(true);
      }
    };

     const fetchTestimonials = async () => {
      try {
        setLoading(true);
  
        const { data } = await axios.get("/api/testimonials");
  
        if (data.success) {
          setTestimonials(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(true);
      }
    };

      const fetchGallery = async () => {
      try {
        setLoading(true);
  
        const { data } = await axios.get("/api/gallery");
  
        if (data.success) {
          setGallery(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load gallery");
      } finally {
        setLoading(true);
      }
    };

  useEffect(() => {
    fetchFacilities()
    fetchTestimonials()
    fetchGallery()
    fetchServices()
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.from(".hero-badge", {
    opacity: 1,
    y: -30,
    duration: 0.7,
  })

    .from(
      ".hero-title",
      {
        opacity: 1,
        y: 70,
        duration: 1,
      },
      "-=0.3"
    )

    .from(
      ".hero-desc",
      {
        opacity: 1,
        y: 40,
        duration: 0.8,
      },
      "-=0.5"
    )

    .from(
      ".hero-buttons a",
      {
        opacity: 1,
        y: 30,
        stagger: 0.2,
        duration: 0.6,
      },
      "-=0.4"
    )

    .from(
      ".stat-card",
      {
        opacity: 1,
        scale: 0.8,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
      },
      "-=0.3"
    )

    .from(
      ".hero-image",
      {
        opacity: 1,
        x: 100,
        duration: 1,
      },
      "-=1"
    )

    .from(
      ".floating-card",
      {
        opacity: 1,
        y: 40,
        scale: 0.8,
        duration: 0.6,
      },
      "-=0.5"
    );

  // Floating glow animation
  gsap.to(".glow-left", {
    x: 40,
    y: -30,
    repeat: -1,
    yoyo: true,
    duration: 6,
    ease: "sine.inOut",
  });

  gsap.to(".glow-right", {
    x: -40,
    y: 30,
    repeat: -1,
    yoyo: true,
    duration: 8,
    ease: "sine.inOut",
  });

  // Floating card animation
  gsap.to(".floating-card", {
    y: -12,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: "power1.inOut",
  });

  // Image zoom animation
  gsap.to(".hero-image img", {
    scale: 1.05,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "none",
  });
}, []);

  return (
    <>

    <section className="relative overflow-hidden h-screen">

      {/* 🎥 BACKGROUND VIDEO */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* 🌑 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ✨ GLOW EFFECTS */}
      <div className="absolute -left-20  glow-left top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 glow-right h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex items-center">

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT CONTENT */}
          <div>

            {/* BADGE */}
            <span className=" hero-badge inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
               Welcome to Sky Solutions Institute
            </span>

            {/* TITLE */}
            <h1 className=" hero-title mt-6 text-4xl md:text-6xl font-black text-white leading-tight">
              Learn IT Skills
              <span className="block text-yellow-300">
                Build Your Future
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className=" hero-desc mt-6 text-lg text-gray-200 leading-8 max-w-xl">
              Join our professional IT training institute and gain hands-on
              experience in computer courses, web development, design,
              networking, and more.
            </p>


            {/* BUTTONS */}
            <div className=" hero-buttons a mt-10 flex flex-wrap gap-4">

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 transition"
              >
                Explore Courses
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Contact Us
              </Link>

            </div>

            
            {/* 📊 STATS */}
            <div className="stat-card mt-16 grid grid-cols-2 sm:grid-cols-4 gap-7">

              <ScrollReveal className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <h3 className="text-2xl font-black text-white">
                  <AnimatedCounter from={0} to={1000} suffix="+" />
                </h3>
                <p className="text-xs text-gray-200 mt-1">Students</p>
              </ScrollReveal>

              <ScrollReveal className="bg-white/10 backdrop-blur rounded-xl p-4 text-center" delay={0.1}>
                <h3 className="text-2xl font-black text-white">
                  <AnimatedCounter from={0} to={9} suffix="+" />
                </h3>
                <p className="text-xs text-gray-200 mt-1">Courses</p>
              </ScrollReveal>

              <ScrollReveal className="bg-white/10 backdrop-blur rounded-xl p-4 text-center" delay={0.2}>
                <h3 className="text-2xl font-black text-white">
                  <AnimatedCounter from={0} to={95} suffix="%" />
                </h3>
                <p className="text-xs text-gray-200 mt-1">Success</p>
              </ScrollReveal>

            </div>

          </div>

          {/* RIGHT CONTENT */}
          <div className="relative hidden lg:block ">

            <div className=" hero-image rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="student.jpg"
                alt="students learning IT"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* FLOATING CARD */}
            <div className=" floating-card absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
              <p className="text-sm font-semibold text-gray-900">
                🎓 1000+ Students Trained
              </p>
              <p className="text-xs text-gray-500">
                Join successful learners
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>

<section className="py-24 bg-gradient-to-b from-sky-50 via-white to-white">
  <div className="max-w-7xl mx-auto px-6">
    {/* Heading */}
    <div className="text-center mb-16">
      <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
        Our Services
      </span>

      <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
        Professional
        <span className="text-[#1C8BCA]"> IT Services</span>
      </h2>

      <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
        We provide reliable computer hardware, software, networking, and IT
        support services for homes, businesses, schools, and organizations.
      </p>
    </div>

    {/* Service Cards */}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service._id}
          className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
        >
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <span className="absolute top-4 left-4 rounded-full bg-[#1C8BCA] px-4 py-2 text-xs font-semibold text-white">
              IT Service
            </span>
          </div>

          {/* Content */}
          <div className="p-7">
            <h3 className="text-2xl font-bold text-gray-900 transition group-hover:text-[#1C8BCA]">
              {service.title}
            </h3>

            <p className="mt-4 text-gray-600 leading-7">
              {service.description}
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1C8BCA] px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Learn More
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom CTA */}
    <div className="mt-16 text-center">
      <Link
        href="/services"
        className="inline-flex items-center gap-3 rounded-full border-2 border-[#1C8BCA] px-8 py-4 font-semibold text-[#1C8BCA] transition hover:bg-[#1C8BCA] hover:text-white"
      >
        View All Services
        <ArrowRight size={20} />
      </Link>
    </div>
  </div>
</section>

 <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80"
              alt="About Us"
              className="rounded-3xl shadow-2xl w-full h-[550px] object-cover"
            />

            <div className="absolute -bottom-8 -right-8 bg-[#1C8BCA] text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-4xl font-bold">
                <AnimatedCounter from={0} to={10} suffix="+" />
              </h3>
              <p className="mt-2">Years of Experience</p>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
              About Us
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Building Skills,
              <span className="text-[#1C8BCA]"> Empowering Careers</span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              We are a professional IT Training Institute dedicated to helping
              students, job seekers, and professionals gain practical knowledge
              in computer technology. Our mission is to provide quality
              education, industry-oriented training, and reliable IT solutions
              under one roof.
            </p>

            <p className="mt-4 text-lg text-gray-600 leading-8">
              With experienced instructors, modern computer labs, and hands-on
              learning, we prepare our students for successful careers in the
              digital world.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                "Experienced Trainers",
                "Practical Hands-on Learning",
                "Modern Computer Lab",
                "Job-Oriented Courses",
                "Affordable Fees",
                "Certificate After Completion",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#1C8BCA]" size={22} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1C8BCA] px-7 py-4 text-white font-semibold hover:bg-sky-700 transition"
              >
                Learn More
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1C8BCA] px-7 py-4 text-[#1C8BCA] font-semibold hover:bg-[#1C8BCA] hover:text-white transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

     <section className="py-24 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
            <ImageIcon size={16} />
            Gallery
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
            Explore Our
            <span className="text-[#1C8BCA]"> Learning Environment</span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Take a glimpse of our classrooms, computer labs, practical
            training sessions, workshops, and student activities.
          </p>
        </div>

        {/* Images */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-3xl shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-10 p-6 text-white transition duration-500 group-hover:translate-y-0">
                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-16 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full bg-[#1C8BCA] px-8 py-4 font-semibold text-white transition hover:bg-sky-700"
          >
            View Full Gallery
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>

  <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
            Our Facilities
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
            Everything You Need for
            <span className="text-[#1C8BCA]"> Quality Learning</span>
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600">
            We provide a modern learning environment equipped with advanced
            technology, experienced instructors, and student-friendly facilities
            to help you achieve your career goals.
          </p>
        </div>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
  {facilities.map((facility) => (
    <div
      key={facility._id}
      className="group rounded-3xl bg-white overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="h-40 overflow-hidden">
        <img
          src={facility.image}
          alt={facility.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
          {facility.title}
        </h3>

        <p className="mt-3 text-gray-600 leading-7 text-sm">
          {facility.description}
        </p>
      </div>
    </div>
  ))}
</div>
        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#1C8BCA] px-8 py-4 font-semibold text-white transition hover:bg-sky-700"
          >
            Visit Our Institute
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>

      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
            What Our
            <span className="text-[#1C8BCA]"> Students Say</span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Real feedback from our students who successfully completed training
            and started their IT careers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="group rounded-3xl bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.course}</p>
                </div>
              </div>

              {/* Message */}
              <p className="mt-5 text-gray-600 text-sm leading-7">
                "{item.message}"
              </p>

              {/* Rating */}
              <div className="mt-5 flex gap-1 text-amber-500">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    


    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-[#1C8BCA]">
            Contact Us
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
            Get In
            <span className="text-[#1C8BCA]"> Touch</span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Have questions about our courses or services? We’re here to help you
            start your IT journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT: Contact Info */}
          <div className="space-y-6">

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <MapPin className="text-[#1C8BCA]" />
              <div>
                <h3 className="font-bold text-gray-900">Address</h3>
                <p className="text-gray-600 mt-1">
                Bedkot Nagarpalika-3, Shamadaiji, Kanchanpur
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <Phone className="text-[#1C8BCA]" />
              <div>
                <h3 className="font-bold text-gray-900">Phone</h3>
                <p className="text-gray-600 mt-1">+977-98XXXXXXXX</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <Mail className="text-[#1C8BCA]" />
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-600 mt-1">info@skysolutions.com</p>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
  src="https://www.google.com/maps?q=Bedkot+Nagarpalika-3+Shamadaiji+Kanchanpur+Nepal&output=embed"
  className="w-full h-72 border-0"
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
></iframe>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send Message
            </h3>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#1C8BCA] outline-none"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#1C8BCA] outline-none"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#1C8BCA] outline-none"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#1C8BCA] outline-none"
              ></textarea>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#1C8BCA] text-white font-semibold py-4 rounded-xl hover:bg-sky-700 transition"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  
</>
  );
}

export default page