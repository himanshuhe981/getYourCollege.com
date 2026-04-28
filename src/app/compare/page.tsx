'use client'

import { useEffect, useState, useRef } from 'react'
import { useCompareStore } from '@/store/compare'
import { getCollegesByIds, searchCollegesByName } from '@/actions/college'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Check, MapPin, Star, TrendingUp, Search, Plus } from 'lucide-react'

const formatRupee = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

type SearchResult = { id: string; name: string; location: string }

function AddCollegeSlot({ slotIndex }: { slotIndex: number }) {
  const { addCollege, selectedCollegeIds } = useCompareStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); setShowDropdown(false); return }
      setIsSearching(true)
      const data = await searchCollegesByName(query)
      // Filter out already selected colleges
      setResults((data as SearchResult[]).filter(c => !selectedCollegeIds.includes(c.id)))
      setShowDropdown(true)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, selectedCollegeIds])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <th className="p-6 border-b border-slate-200/60 align-top w-1/4">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-indigo-200 flex items-center justify-center mb-3 bg-indigo-50">
          <Plus className="w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-sm font-bold text-slate-500 mb-4">Add a college</p>
      </div>
      <div className="relative" ref={ref}>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search college..."
            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none w-full placeholder:text-slate-400"
          />
        </div>
        <AnimatePresence>
          {showDropdown && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white/95 backdrop-blur-xl border border-white shadow-xl rounded-2xl p-2 z-50"
            >
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { addCollege(r.id); setQuery(''); setShowDropdown(false) }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  <div className="font-bold text-slate-800 text-sm leading-tight">{r.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {r.location}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
          {showDropdown && !isSearching && results.length === 0 && query.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 shadow-lg rounded-2xl p-4 z-50 text-center text-sm text-slate-500"
            >
              No colleges found
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </th>
  )
}

export default function ComparePage() {
  const { selectedCollegeIds, removeCollege, clear } = useCompareStore()
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadColleges() {
      if (selectedCollegeIds.length === 0) { setColleges([]); setLoading(false); return }
      setLoading(true)
      const data = await getCollegesByIds(selectedCollegeIds)
      setColleges(data)
      setLoading(false)
    }
    loadColleges()
  }, [selectedCollegeIds])

  const emptySlots = 3 - colleges.length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-6 md:px-16 mt-12">

        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-white/80 border border-white shadow-sm px-4 py-2 rounded-full">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          {colleges.length > 0 && (
            <button onClick={clear} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors bg-white/80 border border-white shadow-sm px-4 py-2 rounded-full">
              Clear All
            </button>
          )}
        </div>

        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-4 text-slate-800">
            Compare.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Evaluate your top choices side-by-side to make the best decision.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading…</div>
        ) : colleges.length === 0 && emptySlots === 3 ? (
          /* Empty state — still show 3 search slots */
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-6 border-b border-slate-200/60 text-left w-1/4">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Add up to 3 colleges</span>
                    </th>
                    {[0, 1, 2].map(i => <AddCollegeSlot key={i} slotIndex={i} />)}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto pb-4">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="p-6 border-b border-slate-200/60 text-left w-1/4">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Features</span>
                    </th>
                    {colleges.map(c => (
                      <th key={c.id} className="p-6 border-b border-slate-200/60 text-left relative w-1/4">
                        <button onClick={() => removeCollege(c.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                          <X className="w-4 h-4" />
                        </button>
                        <h3 className="text-lg font-bold tracking-tight text-slate-800 pr-8 leading-snug mb-2">{c.name}</h3>
                        <Link href={`/college/${c.id}`} className="text-xs font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-700">
                          View Details →
                        </Link>
                      </th>
                    ))}
                    {/* Empty search slots */}
                    {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                      <AddCollegeSlot key={`slot-${i}`} slotIndex={i} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Location', render: (c: any) => <div className="flex items-center gap-2 text-slate-700"><MapPin className="w-4 h-4 text-slate-400" />{c.location}</div> },
                    { label: 'Annual Fees', render: (c: any) => <span className="font-bold text-slate-800">{formatRupee(c.fees)}</span> },
                    { label: 'Rating', render: (c: any) => <div className="flex items-center gap-2 font-bold text-slate-800"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{c.rating} / 5.0</div> },
                    { label: 'Placement %', render: (c: any) => <div className="flex items-center gap-2 font-bold text-emerald-600"><TrendingUp className="w-4 h-4" />{c.placements[0]?.percentage}%</div> },
                    { label: 'Top Courses', render: (c: any) => (
                      <ul className="space-y-2">
                        {c.courses.slice(0, 3).map((course: any) => (
                          <li key={course.id} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                            <Check className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  ].map(({ label, render }) => (
                    <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 border-b border-slate-100 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</td>
                      {colleges.map(c => (
                        <td key={c.id} className="p-6 border-b border-slate-100 border-l border-slate-100">{render(c)}</td>
                      ))}
                      {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                        <td key={`empty-${label}-${i}`} className="p-6 border-b border-slate-100 border-l border-slate-100 border-dashed" />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
