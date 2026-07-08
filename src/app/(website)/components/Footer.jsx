'use client'
import Image from 'next/image'
import { Phone, Mail, MapPin, MessageCircle, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

const courseLinks = [
  'Basic Computer', 'Graphic Design', 'Digital Marketing',
  'Web Development', 'Computer Repair', 'Networking',
  'Tally Prime', 'CCTV & Security', 'AI & Programming',
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 circuit-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-b border-white/8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <a href="/" className="flex items-center gap-3">
                          <Image
                            src="/sky.jpg"
                            alt="Logo"
                            width={150}
                            height={100}
                            className=" object-cover"
                          />
                        </a>
            </div>
            <p className="text-[#8a9bb5] text-sm leading-relaxed mb-5">
              Nepal's trusted computer institute and IT solution provider. Building futures through modern technology education.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+9779867868324" className="flex items-center gap-2.5 text-[#8a9bb5] hover:text-white text-sm transition-colors duration-200 group">
                <Phone size={14} className="text-[#1E6FFF] group-hover:scale-110 transition-transform duration-200" />
                +977-9867868324
              </a>
              <a href="tel:+919711934610" className="flex items-center gap-2.5 text-[#8a9bb5] hover:text-white text-sm transition-colors duration-200 group">
                <Phone size={14} className="text-[#1E6FFF] group-hover:scale-110 transition-transform duration-200" />
                +91-9711934610 (Delhi)
              </a>
              <a href="mailto:Skysolutions1987@gmail.com" className="flex items-center gap-2.5 text-[#8A9BB5] hover:text-white text-sm transition-colors duration-200 group">
                <Mail size={14} className="text-[#1E6FFF] group-hover:scale-110 transition-transform duration-200" />
                Skysolutions1987@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-[#8A9BB5] hover:text-white text-sm">
                <MapPin size={14} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                Bedkot Nagarpalika-3, Shamadaiji, Kanchanpur
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-white uppercase text-sm tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-[#8A9BB5] hover:text-white text-sm transition-colors duration-200 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#1E6FFF] flex-shrink-0 group-hover:bg-[#00C8F8] transition-colors duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display font-bold text-white uppercase text-sm tracking-widest mb-5">Our Courses</h4>
            <ul className="space-y-2.5">
              {courseLinks.map(c => (
                <li key={c}>
                  <Link
                    href='/courses'
                    className="flex items-center gap-2 text-[#8A9BB5] hover:text-white text-sm transition-colors duration-200 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#00C8F8] flex-shrink-0 group-hover:bg-[#1E6FFF] transition-colors duration-200" />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="font-display font-bold text-white uppercase text-sm tracking-widest mb-5">Stay Connected</h4>
            <p className="text-[#8A9BB5] text-sm leading-relaxed mb-5 hover:text-white">
              Follow us on Facebook for latest news, batch announcements, and student success stories.
            </p>

            {/* Social */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/30 text-white text-sm font-semibold hover:bg-[#1877F2]/30 transition-colors duration-200 mb-6"
            >
              <MessageCircle size={18} className="text-[#1877F2]" />
              Sky Solutions Computer Institute
            </a>

            {/* Batch info */}
            <div className="p-4 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/25">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse" />
                <span className="text-[#FFB800] text-xs font-bold uppercase tracking-wider">Admissions Open</span>
              </div>
              <div className="text-white text-sm font-medium">New Batch: 2083/04/01</div>
              <Link href="/enrollment" className="text-[#00C8F8] text-xs font-semibold hover:underline">
                Register now →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[#8A9BB5] text-sm text-center sm:text-left">
            <span className="text-white/50">© {new Date().getFullYear()}  Sky Solutions PVT. LTD.</span>
            <span className="mx-2 text-white/20">·</span>
            All rights reserved.
            <span className="mx-2 text-white/20">·</span>
            <span className="text-[#00C8F8] font-medium">सीप सिकौँ, भविष्य बनाऔँ</span>
          </div>

          {/* Partners row */}
          <div className="flex items-center gap-4">
            <span className="text-[#8A9BB5] text-xs">Authorized:</span>
            {['Acer', 'HP', 'Microtek'].map(b => (
              <span key={b} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-semibold">
                {b}
              </span>
            ))}
          </div>

          {/* Scroll to top */}
          <button
            onClick={scrollTop}
            className="flex items-center gap-1.5 text-[#8A9BB5] hover:text-white text-xs transition-colors duration-200 group"
            aria-label="Scroll to top"
          >
            Back to top
            <ArrowUpCircle size={16} className="group-hover:text-[#00C8F8] transition-colors duration-200" />
          </button>
        </div>
      </div>
    </footer>
  )
}
