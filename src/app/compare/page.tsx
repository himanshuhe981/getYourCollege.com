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

function CollegeSearch({ onAdd, excludeIds }: { onAdd: (id: string) => void; excludeIds: string[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); setOpen(false); return }
      setBusy(true)
      const data = await searchCollegesByName(query)
      setResults((data as SearchResult[]).filter(c => !excludeIds.includes(c.id)))
      setOpen(true)
      setBusy(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query, excludeIds])

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 border border-black/10 px-4 py-2.5 bg-white focus-within:border-black transition-colors">
        <Search className="w-4 h-4 text-black/30 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search a college to add…"
          className="bg-transparent text-sm font-medium text-black focus:outline-none w-full placeholder:text-black/30"
        />
        {busy && <span className="text-[10px] text-black/30 font-semibold">…</span>}
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 bg-white border border-black/10 shadow-xl z-50 mt-px"
          >
            {results.map(r => (
              <button key={r.id} onClick={() => { onAdd(r.id); setQuery(''); setOpen(false) }}
                className="w-full text-left px-4 py-3 hover:bg-black hover:text-white transition-colors group"
              >
                <div className="font-bold text-sm leading-tight">{r.name}</div>
                <div className="text-xs text-black/50 group-hover:text-white/60 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{r.location}
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {open && !busy && results.length === 0 && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 bg-white border border-black/10 shadow-lg z-50 mt-px px-4 py-4 text-sm text-black/50 font-medium"
          >
            No colleges found for "{query}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ComparePage() {
  const { selectedCollegeIds, addCollege, removeCollege, clear } = useCompareStore()
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (selectedCollegeIds.length === 0) { setColleges([]); setLoading(false); return }
      setLoading(true)
      setColleges(await getCollegesByIds(selectedCollegeIds))
      setLoading(false)
    }
    load()
  }, [selectedCollegeIds])

  const canAddMore = selectedCollegeIds.length < 3

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-8 md:px-20 mt-14">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-14">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          {colleges.length > 0 && (
            <button onClick={clear} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-red-500 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-4 text-black">
            Compare.
          </h1>
          <p className="text-xl text-black/50 font-medium max-w-2xl leading-relaxed">
            Evaluate your top choices side-by-side to make the best decision.
          </p>
        </div>

        {/* Add College row — always visible when < 3 selected */}
        {canAddMore && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10 border border-black/10 px-6 py-4 bg-black/[0.015]"
          >
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black/50 flex-shrink-0">
              <Plus className="w-4 h-4" />
              Add College
            </div>
            <div className="w-px h-6 bg-black/10 flex-shrink-0" />
            <CollegeSearch onAdd={addCollege} excludeIds={selectedCollegeIds} />
            <span className="text-xs text-black/30 font-medium flex-shrink-0">{selectedCollegeIds.length}/3 selected</span>
          </motion.div>
        )}

        {loading ? (
          <div className="py-24 text-center text-black/30 font-bold uppercase tracking-widest text-sm animate-pulse">
            Loading…
          </div>
        ) : colleges.length === 0 ? (
          <div className="py-24 border border-black/10 border-dashed text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-3">No colleges selected yet</h2>
            <p className="text-black/50 font-medium mb-8 max-w-sm mx-auto">
              Use the search bar above to add up to 3 colleges, or browse from the listing page.
            </p>
            <Link href="/" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-6 border-b border-black/10 text-left w-1/4 align-bottom">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Feature</span>
                  </th>
                  {colleges.map(c => (
                    <th key={c.id} className="p-6 border-b border-black/10 text-left w-1/4 align-top relative">
                      <button onClick={() => removeCollege(c.id)}
                        className="absolute top-4 right-4 p-1.5 text-black/30 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Remove">
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-bold tracking-tight leading-snug pr-8 mb-2 text-black">{c.name}</h3>
                      <Link href={`/college/${c.id}`} className="text-xs font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors">
                        View Details →
                      </Link>
                    </th>
                  ))}
                  {/* Empty filler columns */}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <th key={`filler-${i}`} className="p-6 border-b border-black/10 w-1/4 align-middle">
                      <span className="text-xs font-medium text-black/20">—</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: 'Location',
                    render: (c: any) => (
                      <div className="flex items-center gap-2 text-sm font-medium text-black">
                        <MapPin className="w-4 h-4 text-black/40" />{c.location}
                      </div>
                    ),
                  },
                  {
                    label: 'Annual Fees',
                    render: (c: any) => <span className="font-bold text-base text-black">{formatRupee(c.fees)}</span>,
                  },
                  {
                    label: 'Rating',
                    render: (c: any) => (
                      <div className="flex items-center gap-2 font-bold text-base text-black">
                        <Star className="w-4 h-4 fill-black" />{c.rating} / 5.0
                      </div>
                    ),
                  },
                  {
                    label: 'Placement %',
                    render: (c: any) => (
                      <div className="flex items-center gap-2 font-bold text-base text-emerald-600">
                        <TrendingUp className="w-4 h-4" />{c.placements[0]?.percentage}%
                      </div>
                    ),
                  },
                  {
                    label: 'Top Courses',
                    render: (c: any) => (
                      <ul className="space-y-2">
                        {c.courses.slice(0, 3).map((course: any) => (
                          <li key={course.id} className="flex items-start gap-2 text-sm font-medium text-black">
                            <Check className="w-4 h-4 text-black/40 mt-0.5 flex-shrink-0" />{course.name}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ].map(({ label, render }) => (
                  <tr key={label} className="hover:bg-black/[0.015] transition-colors">
                    <td className="p-6 border-b border-black/[0.06] text-[10px] font-bold uppercase tracking-widest text-black/40 align-top">
                      {label}
                    </td>
                    {colleges.map(c => (
                      <td key={c.id} className="p-6 border-b border-black/[0.06] border-l border-black/[0.06] align-top">
                        {render(c)}
                      </td>
                    ))}
                    {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                      <td key={`empty-${label}-${i}`} className="p-6 border-b border-black/[0.06] border-l border-dashed border-black/[0.06]" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
