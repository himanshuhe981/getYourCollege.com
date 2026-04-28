'use client'

import { useEffect, useState } from 'react'
import { useCompareStore } from '@/store/compare'
import { getCollegesByIds } from '@/actions/college'
import Link from 'next/link'
import { ArrowLeft, X, Check, MapPin, DollarSign, Star, TrendingUp } from 'lucide-react'

export default function ComparePage() {
  const { selectedCollegeIds, removeCollege, clear } = useCompareStore()
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadColleges() {
      if (selectedCollegeIds.length === 0) {
        setColleges([])
        setLoading(false)
        return
      }
      setLoading(true)
      const data = await getCollegesByIds(selectedCollegeIds)
      setColleges(data)
      setLoading(false)
    }
    loadColleges()
  }, [selectedCollegeIds])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-6 md:px-16 mt-12 md:mt-16">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          {colleges.length > 0 && (
            <button 
              onClick={() => clear()}
              className="text-xs uppercase font-bold tracking-widest text-slate-500 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-white"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6 text-slate-900">
            Compare.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            Evaluate your top choices side-by-side to make the best decision.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-black/40 font-bold uppercase tracking-widest animate-pulse">
            Loading Comparison...
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-24 border border-black/10 border-dashed">
            <h2 className="text-2xl font-bold tracking-tight mb-4">No colleges selected</h2>
            <p className="text-black/60 mb-8 font-medium">Go back to the discover page and select up to 3 colleges to compare.</p>
            <Link href="/" className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors">
              Find Colleges
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-8">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-6 border-b border-black/10 text-left align-bottom w-1/4">
                    <span className="text-xs uppercase font-bold tracking-widest text-black/40">Features</span>
                  </th>
                  {colleges.map(c => (
                    <th key={c.id} className="p-6 border-b border-black/10 text-left relative w-1/4">
                      <button 
                        onClick={() => removeCollege(c.id)}
                        className="absolute top-6 right-6 p-2 text-black/40 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-2xl font-bold tracking-tight mb-2 pr-8 leading-tight">{c.name}</h3>
                      <Link href={`/college/${c.id}`} className="text-sm font-bold uppercase tracking-wider text-black/50 hover:text-black underline underline-offset-4">
                        View Full Details
                      </Link>
                    </th>
                  ))}
                  {/* Fill empty slots up to 3 */}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-6 border-b border-black/10 border-dashed text-center w-1/4">
                      <div className="w-12 h-12 rounded-full border-2 border-black/10 border-dashed flex items-center justify-center mx-auto mb-4">
                        <span className="text-black/20 font-bold">+</span>
                      </div>
                      <span className="text-xs uppercase font-bold tracking-widest text-black/30">Add College</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Location row */}
                <tr>
                  <td className="p-6 border-b border-black/5 text-sm font-bold uppercase tracking-widest text-black/60">Location</td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 border-b border-black/5 border-l border-black/5 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black/50" />
                        {c.location}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={`empty-loc-${i}`} className="p-6 border-b border-black/5 border-l border-black/5 border-dashed"></td>
                  ))}
                </tr>

                {/* Fees row */}
                <tr>
                  <td className="p-6 border-b border-black/5 text-sm font-bold uppercase tracking-widest text-black/60">Annual Fees</td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 border-b border-black/5 border-l border-black/5 font-bold text-lg">
                      ₹{(c.fees / 100000).toFixed(1)} Lakhs
                    </td>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={`empty-fee-${i}`} className="p-6 border-b border-black/5 border-l border-black/5 border-dashed"></td>
                  ))}
                </tr>

                {/* Rating row */}
                <tr>
                  <td className="p-6 border-b border-black/5 text-sm font-bold uppercase tracking-widest text-black/60">Rating</td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 border-b border-black/5 border-l border-black/5 font-bold text-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-black" />
                        {c.rating} / 5.0
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={`empty-rat-${i}`} className="p-6 border-b border-black/5 border-l border-black/5 border-dashed"></td>
                  ))}
                </tr>

                {/* Placement row */}
                <tr>
                  <td className="p-6 border-b border-black/5 text-sm font-bold uppercase tracking-widest text-black/60">Placement %</td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 border-b border-black/5 border-l border-black/5 font-bold text-lg text-emerald-600">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {c.placements[0]?.percentage}%
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={`empty-pla-${i}`} className="p-6 border-b border-black/5 border-l border-black/5 border-dashed"></td>
                  ))}
                </tr>

                {/* Top Courses row */}
                <tr>
                  <td className="p-6 border-b border-black/5 text-sm font-bold uppercase tracking-widest text-black/60 align-top">Top Courses</td>
                  {colleges.map(c => (
                    <td key={c.id} className="p-6 border-b border-black/5 border-l border-black/5 align-top">
                      <ul className="space-y-3">
                        {c.courses.slice(0, 3).map((course: any) => (
                          <li key={course.id} className="flex items-start gap-2 font-medium">
                            <Check className="w-4 h-4 text-black/40 mt-1 flex-shrink-0" />
                            <span className="leading-tight">{course.name}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <td key={`empty-cor-${i}`} className="p-6 border-b border-black/5 border-l border-black/5 border-dashed"></td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
