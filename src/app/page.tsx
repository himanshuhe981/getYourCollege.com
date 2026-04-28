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

const formatRupee = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedFees, setSelectedFees] = useState('All')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const feeOptions = ['All', 'Below 5L', '5L - 10L', 'Above 10L']

  useEffect(() => {
    async function loadInitialData() {
      const locs = await getLocations()
      setLocations(['All', ...locs])
    }
    loadInitialData()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    setColleges([])
    setHasMore(true)
  }, [query, selectedLocation, selectedFees])

  useEffect(() => {
    async function fetchSearch() {
      setLoading(true)
      const data = await getColleges(query, { location: selectedLocation, fees: selectedFees }, page, 12)
      
      if (data.length < 12) {
        setHasMore(false)
      }

      if (page === 1) {
        setColleges(data as any)
      } else {
        setColleges(prev => [...prev, ...data as any])
      }
      setLoading(false)
    }
    
    const timeout = setTimeout(fetchSearch, 300)
    return () => clearTimeout(timeout)
  }, [query, selectedLocation, selectedFees, page])

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
        <main className="max-w-screen-2xl mx-auto w-full px-8 md:px-24 py-16 md:py-32 flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="mb-24 max-w-4xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVars}
            >
              <div className="mb-4">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-none">
                  Find your
                </motion.h2>
              </div>
              <div className="mb-8">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-none text-black/20">
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

          {/* Search and Filters */}
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
            <div className="w-full md:w-64">
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
            <div className="w-full md:w-48">
              <label className="text-xs uppercase font-bold tracking-wider text-black/50 mb-2 block">Fees</label>
              <select 
                value={selectedFees}
                onChange={(e) => setSelectedFees(e.target.value)}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-black rounded-none focus:outline-none transition-all font-medium text-xl md:text-2xl appearance-none cursor-pointer"
              >
                {feeOptions.map(opt => (
                  <option key={opt} value={opt} className="text-base">{opt}</option>
                ))}
              </select>
            </div>
          </motion.section>

          {/* College Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {loading && page === 1 ? (
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
                    transition={{ delay: 0.1 * (index % 12) }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative border border-black/10 bg-white/50 backdrop-blur-sm p-8 hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 flex flex-col h-full rounded-none"
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
                            {formatRupee(college.fees)}
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

          {/* Load More Button */}
          {hasMore && colleges.length > 0 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
                className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Colleges'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
