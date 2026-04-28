'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="py-6 px-8 md:px-16 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-black/5">
      <Link href="/" className="flex items-center gap-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-black to-neutral-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-black/10"
        >
          C
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight"
        >
          Campus.
        </motion.h1>
      </Link>
      
      <motion.nav 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex gap-8 text-sm font-semibold tracking-wide"
      >
        <Link 
          href="/" 
          className={`transition-all duration-300 ${pathname === '/' ? 'text-black' : 'text-black/40 hover:text-black'}`}
        >
          Discover
          {pathname === '/' && <motion.div layoutId="underline" className="h-[2px] w-full bg-black mt-1 rounded-full" />}
        </Link>
        <Link 
          href="/compare" 
          className={`transition-all duration-300 ${pathname === '/compare' ? 'text-black' : 'text-black/40 hover:text-black'}`}
        >
          Compare
          {pathname === '/compare' && <motion.div layoutId="underline" className="h-[2px] w-full bg-black mt-1 rounded-full" />}
        </Link>
        <Link 
          href="/predictor" 
          className={`transition-all duration-300 ${pathname === '/predictor' ? 'text-black' : 'text-black/40 hover:text-black'}`}
        >
          Predictor
          {pathname === '/predictor' && <motion.div layoutId="underline" className="h-[2px] w-full bg-black mt-1 rounded-full" />}
        </Link>
      </motion.nav>
    </header>
  )
}
