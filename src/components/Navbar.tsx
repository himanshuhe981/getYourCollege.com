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
      <header className="py-6 px-8 md:px-24 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-black/10">
        <Link href="/" className="flex items-center gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter text-black"
          >
            Discover.
          </motion.h1>
        </Link>
        
        {/* Desktop Nav */}
        <motion.nav 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-10 text-sm font-bold tracking-wide uppercase"
        >
          <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-black underline underline-offset-8 decoration-2' : 'text-black/40 hover:text-black'}`}>
            Colleges
          </Link>
          <Link href="/compare" className={`transition-colors ${pathname === '/compare' ? 'text-black underline underline-offset-8 decoration-2' : 'text-black/40 hover:text-black'}`}>
            Compare
          </Link>
          <Link href="/predictor" className={`transition-colors ${pathname === '/predictor' ? 'text-black underline underline-offset-8 decoration-2' : 'text-black/40 hover:text-black'}`}>
            Predictor
          </Link>
        </motion.nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-black"
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
            className="fixed inset-0 z-40 bg-white pt-24 px-8 flex flex-col gap-8 md:hidden"
          >
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className={`text-4xl font-bold tracking-tighter ${pathname === '/' ? 'text-black' : 'text-black/40'}`}>
              Colleges
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/compare" className={`text-4xl font-bold tracking-tighter ${pathname === '/compare' ? 'text-black' : 'text-black/40'}`}>
              Compare
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/predictor" className={`text-4xl font-bold tracking-tighter ${pathname === '/predictor' ? 'text-black' : 'text-black/40'}`}>
              Predictor
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
