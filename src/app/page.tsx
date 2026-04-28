'use client'

import { useState, useEffect, useRef } from 'react'
import { getColleges, getLocations } from '@/actions/college'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, TrendingUp, DollarSign, Star, ArrowRight, ChevronDown } from 'lucide-react'
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  }

  return (
    <div className="relative min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white font-sans flex flex-col items-center">
      
      {/* Soft Organic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-slate-200 to-slate-100 rounded-[40%] blur-3xl -top-64 -left-64 opacity-50"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-slate-200 to-transparent rounded-[30%] blur-3xl bottom-0 -right-32 opacity-40"
        />
      </div>

      <div className="relative z-10 flex flex-col flex-grow w-full">
        <main className="max-w-[1400px] mx-auto w-full px-6 md:px-16 py-16 md:py-28 flex-grow flex flex-col">
          
          {/* Hero Section */}
          <section className="mb-20 max-w-4xl">
            <motion.div initial="hidden" animate="show" variants={containerVars}>
              <div className="mb-4 pt-4">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-medium tracking-tight leading-none text-slate-900">
                  Find your
                </motion.h2>
              </div>
              <div className="mb-8">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[7rem] font-medium tracking-tight leading-none text-slate-300">
                  next chapter.
                </motion.h2>
              </div>
              <motion.p variants={itemVars} className="text-xl md:text-2xl text-slate-500 font-normal max-w-2xl leading-relaxed">
                Explore top engineering colleges in India. <br className="hidden md:block" />
                Filter by fees, location, and placement records.
              </motion.p>
            </motion.div>
          </section>

          {/* Search and Filter */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 mb-16 items-center w-full bg-white/60 backdrop-blur-2xl border border-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50"
          >
            <div className="relative flex-1 group w-full pl-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2 w-6 h-6 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Type a college name..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none transition-all font-medium text-xl md:text-2xl placeholder:text-slate-300 text-slate-800"
                />
              </div>
            </div>
            <div className="w-full md:w-64 h-[2px] md:h-12 md:w-[2px] bg-slate-200 flex-shrink-0" />
            
            <div className="relative w-full md:w-72" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-6 py-3 flex items-center justify-between text-left focus:outline-none bg-transparent hover:bg-slate-50/50 rounded-2xl transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-0.5">Location</span>
                  <span className="font-medium text-lg text-slate-800 truncate pr-4">{selectedLocation}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[110%] right-0 w-full bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-2 z-50 max-h-64 overflow-y-auto"
                  >
                    {locations.map(loc => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-slate-700 hover:bg-slate-100 ${selectedLocation === loc ? 'bg-slate-100 text-slate-900 font-bold' : ''}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* College Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-white/40 animate-pulse rounded-[2rem] border border-white"></div>
              ))
            ) : colleges.length > 0 ? (
              colleges.map((college, index) => (
                <Link href={`/college/${college.id}`} key={college.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative border border-white bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="mb-6 pr-12">
                      <h3 className="text-2xl font-bold tracking-tight mb-3 leading-tight group-hover:text-slate-600 transition-colors">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium tracking-wide">
                        <MapPin className="w-4 h-4" />
                        {college.location}
                      </div>
                    </div>
                    <CompareButton collegeId={college.id} />
                    
                    <p className="text-base text-slate-600 line-clamp-3 mb-8 flex-grow leading-relaxed font-medium">
                      {college.description}
                    </p>

                    <div className="flex flex-col gap-6 pt-6 relative">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      
                      <div className="flex justify-between items-center px-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Annual Fees</span>
                          <div className="flex items-center gap-0.5 font-bold text-lg text-slate-800">
                            <DollarSign className="w-4 h-4" />
                            {(college.fees / 100000).toFixed(1)}L
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Rating</span>
                          <div className="flex items-center justify-end gap-1 font-bold text-lg text-slate-800">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {college.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl px-5 py-3.5 transition-transform group-hover:scale-[1.02]">
                        <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          {college.placements[0]?.percentage}% Placed
                        </div>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-24 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">No colleges found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search query or location filter.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
