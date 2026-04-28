'use client'

import { useState } from 'react'
import { predictColleges } from '@/actions/college'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Target, MapPin, TrendingUp, ChevronRight } from 'lucide-react'
import { CompareButton } from '@/components/CompareButton'

const formatRupee = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main')
  const [rank, setRank] = useState('')
  const [predicted, setPredicted] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rank || isNaN(Number(rank))) return
    setLoading(true)
    setHasSearched(true)
    setPredicted(await predictColleges(exam, Number(rank)))
    setLoading(false)
  }

  const exams = ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'MET', 'WBJEE']

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-8 md:px-20 mt-14">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-black/10 p-8">
              <h1 className="text-4xl font-bold tracking-tighter leading-none mb-5 text-black">
                Predictor.
              </h1>
              <p className="text-black/50 font-medium mb-8 leading-relaxed text-sm">
                Enter your exam and rank to find colleges where your rank falls within the historical cutoff.
              </p>

              <form onSubmit={handlePredict} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-2 block">Select Exam</label>
                  <select
                    value={exam}
                    onChange={e => setExam(e.target.value)}
                    className="w-full px-4 py-3.5 bg-black/[0.03] border border-black/10 focus:outline-none focus:ring-1 focus:ring-black transition-all font-semibold text-black appearance-none cursor-pointer"
                  >
                    {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-2 block">Your Rank / Score</label>
                  <input
                    type="number"
                    value={rank}
                    onChange={e => setRank(e.target.value)}
                    placeholder="e.g. 5000"
                    required
                    className="w-full px-4 py-3.5 bg-black/[0.03] border border-black/10 focus:outline-none focus:ring-1 focus:ring-black transition-all font-semibold text-lg text-black placeholder:text-black/25"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !rank}
                  className="w-full bg-black text-white font-bold text-sm py-4 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors disabled:opacity-40"
                >
                  {loading ? 'Analysing…' : 'Predict My Colleges'}
                  {!loading && <Target className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="h-full flex items-center justify-center min-h-[400px] border border-black/10 border-dashed text-center p-12">
                <div>
                  <Target className="w-12 h-12 mx-auto mb-5 text-black/15" />
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Awaiting Input</h2>
                  <p className="text-black/50 font-medium max-w-sm mx-auto">Fill in your exam and rank on the left to get personalised college recommendations.</p>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-36 bg-black/[0.03] animate-pulse border border-black/5" />
                ))}
              </div>
            ) : predicted.length === 0 ? (
              <div className="flex items-center justify-center min-h-[300px] border border-red-200 bg-red-50/40 text-center p-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-red-600">No matches found</h2>
                  <p className="text-red-600/60 font-medium max-w-md mx-auto">No colleges matched this rank. Try a different exam or a higher rank number.</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6">
                  Found {predicted.length} possible college{predicted.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-4">
                  <AnimatePresence>
                    {predicted.map((college, index) => (
                      <motion.div
                        key={college.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.07 * index }}
                        className="group relative border border-black/10 bg-white p-6 hover:border-black transition-colors"
                      >
                        <CompareButton collegeId={college.id} />
                        <div className="pr-16 mb-4">
                          <h3 className="text-xl font-bold tracking-tight leading-snug mb-2 text-black">
                            {college.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-black/50 font-semibold uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />{college.location}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/[0.06]">
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-black/35 mb-1">Fees</div>
                            <div className="font-bold text-sm text-black">{formatRupee(college.fees)}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-black/35 mb-1">Placement</div>
                            <div className="font-bold text-sm text-emerald-600 flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />{college.placements[0]?.percentage}%
                            </div>
                          </div>
                          <div className="flex items-end justify-end">
                            <Link href={`/college/${college.id}`} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black flex items-center gap-1 transition-colors">
                              Details <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
