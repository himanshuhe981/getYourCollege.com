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
      <header className="py-6 px-8 md:px-16 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-slate-200/50 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold font-[family-name:var(--font-caveat)] text-indigo-600 tracking-tight"
          >
            getYourCollege.com
          </motion.h1>
        </Link>
        
        {/* Desktop Nav */}
        <motion.nav 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-8 text-sm font-semibold tracking-wide"
        >
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}>
            Colleges
          </Link>
          <Link href="/compare" className={`transition-colors ${pathname === '/compare' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}>
            Compare
          </Link>
          <Link href="/predictor" className={`transition-colors ${pathname === '/predictor' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}>
            Predictor
          </Link>
        </motion.nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-700 hover:text-indigo-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-28 px-10 flex flex-col gap-8 md:hidden border-t border-slate-100"
          >
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className={`text-5xl font-bold tracking-tight font-[family-name:var(--font-caveat)] ${pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Colleges
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/compare" className={`text-5xl font-bold tracking-tight font-[family-name:var(--font-caveat)] ${pathname === '/compare' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Compare
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/predictor" className={`text-5xl font-bold tracking-tight font-[family-name:var(--font-caveat)] ${pathname === '/predictor' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Predictor
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
