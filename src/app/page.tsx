'use client'

import { useState, useEffect } from 'react'
import { getColleges, getLocations } from '@/actions/college'
import { motion } from 'framer-motion'
import { Search, MapPin, TrendingUp, DollarSign, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CompareButton } from '@/components/CompareButton'

type College = {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  description: string | null
  placements: { year: number; percentage: number }[]
  courses: { id: string; name: string; duration: string }[]
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInitialData() {
      const locs = await getLocations()
      setLocations(['All', ...locs])
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    async function fetchSearch() {
      setLoading(true)
      const data = await getColleges(query, { location: selectedLocation })
      setColleges(data as any)
      setLoading(false)
    }
    
    const timeout = setTimeout(fetchSearch, 300)
    return () => clearTimeout(timeout)
  }, [query, selectedLocation])

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-hidden flex flex-col">
      {/* Animated Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />
      <motion.div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_transparent_20%,_#ffffff_100%)] pointer-events-none" />

      {/* Animated Top Line */}
      <motion.div 
        className="h-[1px] bg-black w-full fixed top-0 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />
      
      <div className="relative z-10 flex flex-col flex-grow">

        {/* Header */}
        <header className="py-8 px-8 md:px-24 flex items-center justify-between z-40">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter"
          >
            Discover.
          </motion.h1>
          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex gap-10 text-sm font-semibold tracking-wide uppercase"
          >
            <Link href="/" className="hover:underline underline-offset-8 decoration-2">Colleges</Link>
            <Link href="/compare" className="text-black/40 hover:text-black transition-colors">Compare</Link>
            <Link href="/predictor" className="text-black/40 hover:text-black transition-colors">Predictor</Link>
          </motion.nav>
        </header>

        <main className="max-w-screen-2xl mx-auto w-full px-8 md:px-24 py-16 md:py-32 flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="mb-24 max-w-4xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVars}
            >
              <div className="overflow-hidden mb-4">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-[0.9]">
                  Find your
                </motion.h2>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-[0.9] text-black/20">
                  next chapter.
                </motion.h2>
              </div>
              <motion.p 
                variants={itemVars}
                className="text-xl md:text-2xl text-black/60 font-medium max-w-2xl leading-relaxed"
              >
                Explore top engineering colleges in India. <br className="hidden md:block" />
                Filter by fees, location, and placement records.
              </motion.p>
            </motion.div>
          </section>

          {/* Search and Filter */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 mb-16 items-end"
          >
            <div className="relative flex-1 group w-full">
              <label className="text-xs uppercase font-bold tracking-wider text-black/50 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-black/20 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  placeholder="Type a college name..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-black/10 focus:border-black rounded-none focus:outline-none transition-all font-medium text-2xl md:text-3xl placeholder:text-black/20"
                />
              </div>
            </div>
            <div className="w-full md:w-72">
              <label className="text-xs uppercase font-bold tracking-wider text-black/50 mb-2 block">Location</label>
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-black rounded-none focus:outline-none transition-all font-medium text-xl md:text-2xl appearance-none cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc} className="text-base">{loc}</option>
                ))}
              </select>
            </div>
          </motion.section>

          {/* College Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              // Skeleton loaders
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-black/[0.02] animate-pulse rounded-none border border-black/5"></div>
              ))
            ) : colleges.length > 0 ? (
              colleges.map((college, index) => (
                <Link href={`/college/${college.id}`} key={college.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative border border-black/10 bg-white/50 backdrop-blur-sm p-8 hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 flex flex-col h-full"
                  >
                <div className="mb-6 pr-12">
                  <h3 className="text-2xl font-bold tracking-tight mb-3 leading-tight group-hover:text-black/70 transition-colors">
                    {college.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-black/50 font-semibold tracking-wide uppercase">
                    <MapPin className="w-4 h-4" />
                    {college.location}
                  </div>
                </div>
                <CompareButton collegeId={college.id} />
                    
                    <p className="text-base text-black/60 line-clamp-3 mb-8 flex-grow leading-relaxed">
                      {college.description}
                    </p>

                    <div className="flex flex-col gap-6 border-t border-black/10 pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-black/40 text-[10px] uppercase tracking-widest font-bold">Fees</span>
                          <div className="flex items-center gap-1 font-bold text-lg">
                            <DollarSign className="w-4 h-4" />
                            ₹{(college.fees / 100000).toFixed(1)}L
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-black/40 text-[10px] uppercase tracking-widest font-bold">Rating</span>
                          <div className="flex items-center justify-end gap-1 font-bold text-lg">
                            <Star className="w-4 h-4 fill-black text-black" />
                            {college.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-black/5 px-4 py-3">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <TrendingUp className="w-4 h-4" />
                          {college.placements[0]?.percentage}% Placed
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-24 text-center text-black/40 font-medium text-2xl tracking-tight">
                No colleges found matching your criteria.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
