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
  
  const [locDropdownOpen, setLocDropdownOpen] = useState(false)
  const [feeDropdownOpen, setFeeDropdownOpen] = useState(false)
  const locRef = useRef<HTMLDivElement>(null)
  const feeRef = useRef<HTMLDivElement>(null)

  const feeOptions = ['All', 'Below 5L', '5L - 10L', 'Above 10L']

  useEffect(() => {
    async function loadInitialData() {
      const locs = await getLocations()
      setLocations(['All', ...locs])
    }
    loadInitialData()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locRef.current && !locRef.current.contains(event.target as Node)) setLocDropdownOpen(false)
      if (feeRef.current && !feeRef.current.contains(event.target as Node)) setFeeDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    setColleges([])
    setHasMore(true)
  }, [query, selectedLocation, selectedFees])

  useEffect(() => {
    let isMounted = true
    async function fetchSearch() {
      setLoading(true)
      const data = await getColleges(query, { location: selectedLocation, fees: selectedFees }, page, 12)
      
      if (!isMounted) return

      if (data.length < 12) {
        setHasMore(false)
      }

      setColleges(prev => {
        if (page === 1) return data as any
        // Bug Fix: Prevent duplicate keys from strict mode double-invocations
        const existingIds = new Set(prev.map(c => c.id))
        const uniqueNew = (data as any).filter((c: College) => !existingIds.has(c.id))
        return [...prev, ...uniqueNew]
      })
      setLoading(false)
    }
    
    const timeout = setTimeout(fetchSearch, 300)
    return () => {
      isMounted = false
      clearTimeout(timeout)
    }
  }, [query, selectedLocation, selectedFees, page])

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="relative min-h-screen text-slate-900 selection:bg-indigo-500 selection:text-white font-sans flex flex-col overflow-hidden">
      
      {/* Animated SVG Line Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M0,50 Q25,25 50,50 T100,50" 
            stroke="black" strokeWidth="0.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M0,70 Q25,95 50,70 T100,70" 
            stroke="black" strokeWidth="0.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          <motion.path 
            d="M0,30 Q25,5 50,30 T100,30" 
            stroke="black" strokeWidth="0.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, y: [0, -15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <main className="max-w-[1400px] mx-auto w-full px-6 md:px-16 py-16 flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="mb-20 max-w-4xl pt-8">
            <motion.div initial="hidden" animate="show" variants={containerVars}>
              <div className="mb-2">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[6.5rem] font-bold tracking-tight leading-none text-slate-800">
                  Find your
                </motion.h2>
              </div>
              <div className="mb-8">
                <motion.h2 variants={itemVars} className="text-6xl md:text-[6.5rem] font-bold font-[family-name:var(--font-caveat)] text-indigo-500 leading-none">
                  next chapter.
                </motion.h2>
              </div>
              <motion.p variants={itemVars} className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                Explore top engineering colleges in India. <br className="hidden md:block" />
                Filter by fees, location, and placement records.
              </motion.p>
            </motion.div>
          </section>

          {/* Search and Filters (Curved UI) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 mb-16 items-center w-full bg-white/70 backdrop-blur-2xl p-3 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white"
          >
            <div className="relative flex-1 group w-full pl-4 py-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Type a college name..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none transition-all font-medium text-xl text-slate-800 placeholder:text-slate-400"
              />
            </div>
            
            <div className="w-full md:w-[2px] h-[2px] md:h-12 bg-slate-200/60 flex-shrink-0" />
            
            {/* Custom Location Dropdown */}
            <div className="relative w-full md:w-64" ref={locRef}>
              <button 
                onClick={() => { setLocDropdownOpen(!locDropdownOpen); setFeeDropdownOpen(false) }}
                className="w-full px-6 py-3 flex items-center justify-between bg-transparent hover:bg-slate-100/50 rounded-3xl transition-colors"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Location</span>
                  <span className="font-semibold text-slate-700 truncate">{selectedLocation}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${locDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {locDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[110%] right-0 w-full bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-2 z-50 max-h-64 overflow-y-auto custom-scrollbar"
                  >
                    {locations.map(loc => (
                      <button key={loc} onClick={() => { setSelectedLocation(loc); setLocDropdownOpen(false) }}
                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all font-medium text-sm hover:bg-indigo-50 ${selectedLocation === loc ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'}`}>
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full md:w-[2px] h-[2px] md:h-12 bg-slate-200/60 flex-shrink-0" />

            {/* Custom Fees Dropdown */}
            <div className="relative w-full md:w-56" ref={feeRef}>
              <button 
                onClick={() => { setFeeDropdownOpen(!feeDropdownOpen); setLocDropdownOpen(false) }}
                className="w-full px-6 py-3 flex items-center justify-between bg-transparent hover:bg-slate-100/50 rounded-3xl transition-colors"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Fees</span>
                  <span className="font-semibold text-slate-700 truncate">{selectedFees}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${feeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {feeDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[110%] right-0 w-full bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-2 z-50 overflow-hidden"
                  >
                    {feeOptions.map(opt => (
                      <button key={opt} onClick={() => { setSelectedFees(opt); setFeeDropdownOpen(false) }}
                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all font-medium text-sm hover:bg-indigo-50 ${selectedFees === opt ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'}`}>
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* College Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {loading && page === 1 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 bg-white/50 animate-pulse rounded-[2rem] border border-white/50"></div>
              ))
            ) : colleges.length > 0 ? (
              colleges.map((college, index) => (
                <Link href={`/college/${college.id}`} key={college.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * (index % 12) }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="group relative border border-white bg-white/60 backdrop-blur-lg p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="mb-6 pr-12">
                      <h3 className="text-2xl font-bold tracking-tight mb-3 leading-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <MapPin className="w-4 h-4" />
                        {college.location}
                      </div>
                    </div>
                    <CompareButton collegeId={college.id} />
                    
                    <p className="text-base text-slate-600 line-clamp-3 mb-8 flex-grow leading-relaxed">
                      {college.description}
                    </p>

                    <div className="flex flex-col gap-6 pt-6 relative border-t border-slate-200/60">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Fees</span>
                          <div className="flex items-center gap-1 font-bold text-lg text-slate-800">
                            {formatRupee(college.fees)}
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
                      <div className="flex items-center justify-between bg-indigo-50/50 text-indigo-700 rounded-2xl px-5 py-4 transition-transform group-hover:bg-indigo-100">
                        <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                          <TrendingUp className="w-4 h-4" />
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
                <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 border border-white">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-700 mb-2">No colleges found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search criteria.</p>
              </div>
            )}
          </section>

          {/* Load More Button */}
          {hasMore && colleges.length > 0 && (
            <div className="flex justify-center mt-4 mb-16">
              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
                className="bg-white/80 backdrop-blur-md border border-white shadow-md text-slate-700 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-indigo-600 hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50"
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
