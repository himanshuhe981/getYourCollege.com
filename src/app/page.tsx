'use client'

import { useState, useEffect, useRef } from 'react'
import { getColleges, getLocations } from '@/actions/college'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, TrendingUp, Star, ArrowRight, ChevronDown } from 'lucide-react'
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

const formatRupee = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedFees, setSelectedFees] = useState('All')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [locOpen, setLocOpen] = useState(false)
  const [feeOpen, setFeeOpen] = useState(false)
  const locRef = useRef<HTMLDivElement>(null)
  const feeRef = useRef<HTMLDivElement>(null)

  const feeOptions = ['All', 'Below 5L', '5L - 10L', 'Above 10L']

  useEffect(() => {
    getLocations().then(locs => setLocations(['All', ...locs]))
  }, [])

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false)
      if (feeRef.current && !feeRef.current.contains(e.target as Node)) setFeeOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
    setColleges([])
    setHasMore(true)
  }, [query, selectedLocation, selectedFees])

  useEffect(() => {
    let active = true
    const timeout = setTimeout(async () => {
      setLoading(true)
      const data = await getColleges(query, { location: selectedLocation, fees: selectedFees }, page, 12)
      if (!active) return
      if (data.length < 12) setHasMore(false)
      setColleges(prev => {
        if (page === 1) return data as unknown as College[]
        const ids = new Set(prev.map(c => c.id))
        return [...prev, ...(data as unknown as College[]).filter((c: College) => !ids.has(c.id))]
      })
      setLoading(false)
    }, 300)
    return () => { active = false; clearTimeout(timeout) }
  }, [query, selectedLocation, selectedFees, page])

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">

      {/* Animated grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '72px 72px' }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,0,0,0.04),transparent)] z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 pt-16 pb-32">

        {/* Hero — full-width, animated */}
        <section className="mb-20 pt-8">
          <div className="overflow-hidden mb-2 pb-4">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] font-bold tracking-tighter leading-none text-black"
            >
              Find your
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] font-bold font-[family-name:var(--font-caveat)] leading-none text-black/20"
            >
              next chapter.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-lg md:text-xl text-black/50 font-medium max-w-lg leading-relaxed"
          >
            Explore top engineering colleges in India.
            Filter by fees, location, and placement records.
          </motion.p>
        </section>

        {/* Search + Filters — z-20 so dropdowns clear the cards */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 flex flex-col md:flex-row gap-0 mb-20 border border-black/10 bg-white"
        >
          {/* Search */}
          <div className="relative flex-1 flex items-center gap-3 px-6 py-5 group border-b md:border-b-0 md:border-r border-black/10">
            <Search className="w-5 h-5 text-black/30 group-focus-within:text-black transition-colors flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by college name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-medium text-lg placeholder:text-black/25 text-black"
            />
          </div>

          {/* Location dropdown */}
          <div ref={locRef} className="relative w-full md:w-64 border-b md:border-b-0 md:border-r border-black/10">
            <button
              onClick={() => { setLocOpen(v => !v); setFeeOpen(false) }}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
            >
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-0.5">Location</div>
                <div className="font-semibold text-black truncate max-w-[150px]">{selectedLocation}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-black/40 transition-transform flex-shrink-0 ${locOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {locOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full left-0 w-full md:w-72 bg-white border border-black/10 shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  {locations.map(loc => (
                    <button key={loc} onClick={() => { setSelectedLocation(loc); setLocOpen(false) }}
                      className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-black/[0.03] transition-colors ${selectedLocation === loc ? 'bg-black text-white font-bold' : 'text-black'}`}>
                      {loc}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fees dropdown */}
          <div ref={feeRef} className="relative w-full md:w-52">
            <button
              onClick={() => { setFeeOpen(v => !v); setLocOpen(false) }}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
            >
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-0.5">Fees</div>
                <div className="font-semibold text-black">{selectedFees}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-black/40 transition-transform flex-shrink-0 ${feeOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {feeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full right-0 w-full bg-white border border-black/10 shadow-xl z-50"
                >
                  {feeOptions.map(opt => (
                    <button key={opt} onClick={() => { setSelectedFees(opt); setFeeOpen(false) }}
                      className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-black/[0.03] transition-colors ${selectedFees === opt ? 'bg-black text-white font-bold' : 'text-black'}`}>
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* College Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading && page === 1 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-black/[0.025] animate-pulse border border-black/5" />
            ))
          ) : colleges.length > 0 ? (
            colleges.map((college, index) => (
              <Link href={`/college/${college.id}`} key={college.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (index % 12) }}
                  whileHover={{ y: -6 }}
                  className="group relative border border-black/10 bg-white p-7 hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 flex flex-col h-full"
                >
                  <CompareButton collegeId={college.id} />

                  <div className="mb-5 pr-10">
                    <h3 className="text-xl font-bold tracking-tight mb-2 leading-snug text-black group-hover:text-black/70 transition-colors">
                      {college.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-black/50 font-semibold uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      {college.location}
                    </div>
                  </div>

                  <p className="text-sm text-black/55 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {college.description}
                  </p>

                  <div className="border-t border-black/[0.06] pt-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-1">Fees</div>
                        <div className="font-bold text-base text-black">{formatRupee(college.fees)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-1">Rating</div>
                        <div className="flex items-center justify-end gap-1 font-bold text-base">
                          <Star className="w-4 h-4 fill-black text-black" />
                          {college.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/[0.03] px-4 py-3 group-hover:bg-black group-hover:text-white transition-all duration-300">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <TrendingUp className="w-4 h-4" />
                        {college.placements[0]?.percentage}% Placed
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-28 text-center">
              <div className="w-20 h-20 border border-black/10 flex items-center justify-center mx-auto mb-6">
                <Search className="w-9 h-9 text-black/20" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">No colleges found</h3>
              <p className="text-black/50 font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        {hasMore && colleges.length > 0 && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="border border-black/10 bg-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-40"
            >
              {loading ? 'Loading…' : 'Load More Colleges'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
