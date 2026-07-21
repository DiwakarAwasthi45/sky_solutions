'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import {
  Award,
  Users,
  Laptop,
  GraduationCap,
  ArrowRight,
  Target,
  Eye,
} from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import ScrollReveal from '@/components/ScrollReveal'

export default function AboutPage() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.5,
      })
        .from(
          '.hero-title',
          {
            y: 50,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.2'
        )
        .from(
          '.hero-text',
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.45'
        )
        .from(
          '.hero-btn',
          {
            y: 18,
            opacity: 0,
            duration: 0.55,
          },
          '-=0.35'
        )
        .from(
          '.hero-image',
          {
            x: 60,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.8'
        )
        .from(
          '.stat-card',
          {
            y: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 0.55,
          },
          '-=0.45'
        )

      gsap.to('.hero-image', {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      })

      gsap.to('.blob1', {
        x: 35,
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 6,
        ease: 'sine.inOut',
      })

      gsap.to('.blob2', {
        x: -25,
        y: -25,
        repeat: -1,
        yoyo: true,
        duration: 7,
        ease: 'sine.inOut',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20 lg:py-28"
    >
      <div className="blob1 absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="blob2 absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="hero-badge inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
              About Sky Solutions
            </div>

            <h1 className="hero-title mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              Empowering Students With
              <span className="block text-yellow-300">Modern IT Education</span>
            </h1>

            <p className="hero-text mt-7 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
              Sky Solutions Computer Institute is dedicated to providing practical computer education,
              industry-focused training, and career guidance that helps students build successful futures in technology.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button className="hero-btn inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-semibold text-[#146A9A] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                Explore Courses
                <ArrowRight size={20} />
              </button>

              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-md">
                <p className="text-sm text-blue-100">Trusted by students</p>
                <p className="text-lg font-bold">Since 10+ years</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="hero-image overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl ring-1 ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80"
                alt="Sky Solutions"
                width={700}
                height={700}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-4xl font-black text-[#146A9A]">
                <AnimatedCounter from={0} to={10} suffix="+" />
              </h2>
              <p className="mt-1 text-sm text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ScrollReveal className="stat-card rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-xl backdrop-blur">
            <Users className="mx-auto text-[#146A9A]" size={40} />
            <h3 className="mt-4 text-4xl font-black text-gray-900">
              <AnimatedCounter from={0} to={3000} suffix="+" />
            </h3>
            <p className="mt-2 text-gray-600">Students Trained</p>
          </ScrollReveal>

          <ScrollReveal className="stat-card rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-xl backdrop-blur" delay={0.1}>
            <GraduationCap className="mx-auto text-[#146A9A]" size={40} />
            <h3 className="mt-4 text-4xl font-black text-gray-900">
              <AnimatedCounter from={0} to={25} suffix="+" />
            </h3>
            <p className="mt-2 text-gray-600">Professional Courses</p>
          </ScrollReveal>

          <ScrollReveal className="stat-card rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-xl backdrop-blur" delay={0.2}>
            <Laptop className="mx-auto text-[#146A9A]" size={40} />
            <h3 className="mt-4 text-4xl font-black text-gray-900">
              <AnimatedCounter from={0} to={100} suffix="%" />
            </h3>
            <p className="mt-2 text-gray-600">Practical Learning</p>
          </ScrollReveal>

          <ScrollReveal className="stat-card rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-xl backdrop-blur" delay={0.3}>
            <Award className="mx-auto text-[#146A9A]" size={40} />
            <h3 className="mt-4 text-4xl font-black text-gray-900">
              <AnimatedCounter from={0} to={98} suffix="%" />
            </h3>
            <p className="mt-2 text-gray-600">Student Satisfaction</p>
          </ScrollReveal>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
              Our Purpose
            </span>
            <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl md:text-5xl">
              Mission & Vision
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-blue-100 sm:text-lg">
              We are committed to delivering high-quality computer education that prepares students for today's competitive digital world.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="mission-card group rounded-3xl border border-white/10 bg-white p-10 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#146A9A]/10">
                <Target size={42} className="text-[#146A9A]" />
              </div>

              <h3 className="text-3xl font-black text-gray-900">Our Mission</h3>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our mission is to provide affordable, practical, and industry-oriented computer education
                that empowers students with technical knowledge, professional confidence, and career-ready skills.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Industry-focused practical training',
                  'Experienced and dedicated instructors',
                  'Modern computer laboratories',
                  'Career counseling and job guidance',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#146A9A]" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="vision-card group rounded-3xl border border-white/10 bg-white p-10 shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-400/20">
                <Eye size={42} className="text-yellow-500" />
              </div>

              <h3 className="text-3xl font-black text-gray-900">Our Vision</h3>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our vision is to become one of Nepal's leading computer training institutes by inspiring innovation,
                nurturing future technology professionals, and producing skilled graduates who contribute to the digital economy.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Become a trusted IT education center',
                  'Develop globally competitive professionals',
                  'Promote innovation and entrepreneurship',
                  'Support lifelong learning and digital transformation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}