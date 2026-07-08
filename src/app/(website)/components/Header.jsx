'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Services', href: '/services' },
  { name: 'Upcoming Classes', href: '/upcoming' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Change header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/90 backdrop-blur-md shadow-md'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" onClick={() => setIsOpen(false)}>
          <Image
            src="/sky.jpg"
            alt="Sky Solutions"
            width={200}
            height={100}
            priority
            className="object-cover"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative font-medium text-gray-700 transition hover:text-[#1877AE] group"
            >
              {item.name}

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1877AE] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="rounded-lg border border-[#1877AE] px-6 py-2 font-semibold text-[#1877AE] transition hover:bg-[#1877AE] hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/enrollment"
            className="rounded-lg bg-[#1877AE] px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#0F5E8C]"
          >
            Enroll Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
        >
          {isOpen ? (
            <X className="text-[#1877AE]" size={30} />
          ) : (
            <Menu className="text-[#1877AE]" size={30} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="border-t bg-white">
          {/* Scrollable Menu */}
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto px-6 py-5 space-y-2 no-scrollbar">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-3 text-gray-700 font-medium transition hover:bg-[#1877AE]/10 hover:text-[#1877AE]"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg border border-[#1877AE] py-3 text-center font-semibold text-[#1877AE] transition hover:bg-[#1877AE] hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/enrollment"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg bg-[#1877AE] py-3 text-center font-semibold text-white transition hover:bg-[#0F5E8C]"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}