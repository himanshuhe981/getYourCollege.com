'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="py-5 px-8 md:px-20 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-black/[0.06]">
        <Link href="/" className="flex items-center">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold font-[family-name:var(--font-caveat)] text-black tracking-tight"
          >
            getYourCollege.com
          </motion.h1>
        </Link>

        {/* Desktop Nav */}
        <motion.nav
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-10 text-sm font-semibold tracking-wide"
        >
          {[
            { href: '/', label: 'Colleges' },
            { href: '/compare', label: 'Compare' },
            { href: '/predictor', label: 'Predictor' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative pb-0.5 transition-colors ${pathname === href ? 'text-black' : 'text-black/40 hover:text-black'}`}
            >
              {label}
              {pathname === href && (
                <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
              )}
            </Link>
          ))}
        </motion.nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-10 flex flex-col gap-10 md:hidden"
          >
            {[
              { href: '/', label: 'Colleges' },
              { href: '/compare', label: 'Compare' },
              { href: '/predictor', label: 'Predictor' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                onClick={() => setMobileMenuOpen(false)}
                href={href}
                className={`text-5xl font-bold font-[family-name:var(--font-caveat)] transition-colors ${pathname === href ? 'text-black' : 'text-black/30'}`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
