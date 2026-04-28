'use client'

import { useState } from 'react'
import { predictColleges } from '@/actions/college'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Target, MapPin, TrendingUp, Star, ChevronRight } from 'lucide-react'
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
    const results = await predictColleges(exam, Number(rank))
    setPredicted(results)
    setLoading(false)
  }

  const exams = ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'MET', 'WBJEE']

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-6 md:px-16 mt-12">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-white/80 border border-white shadow-sm px-4 py-2 rounded-full mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[2rem] p-8">
              <h1 className="text-4xl font-bold tracking-tight leading-none mb-4 text-slate-800">
                Predictor.
              </h1>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
                Enter your exam rank to find colleges where your rank falls within the historical cutoff.
              </p>

              <form onSubmit={handlePredict} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 block">Select Exam</label>
                  <div className="relative">
                    <select
                      value={exam}
                      onChange={e => setExam(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all font-semibold text-slate-700 appearance-none cursor-pointer"
                    >
                      {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 block">Your Rank / Score</label>
                  <input
                    type="number"
                    value={rank}
                    onChange={e => setRank(e.target.value)}
                    placeholder="e.g. 5000"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all font-semibold text-lg text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !rank}
                  className="w-full bg-indigo-600 text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? 'Analyzing…' : 'Predict My Colleges'}
                  {!loading && <Target className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="h-full flex items-center justify-center min-h-[400px] bg-white/50 border border-white shadow-sm rounded-[2rem] text-center p-12">
                <div>
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                    <Target className="w-10 h-10 text-indigo-300" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-700">Awaiting Input</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Fill in your exam and rank on the left to get personalized college recommendations.</p>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 bg-white/50 animate-pulse rounded-[1.5rem] border border-white"></div>
                ))}
              </div>
            ) : predicted.length === 0 ? (
              <div className="h-full flex items-center justify-center min-h-[300px] bg-red-50/50 border border-red-100 rounded-[2rem] text-center p-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-red-600">No matches found</h2>
                  <p className="text-red-700/60 font-medium max-w-md mx-auto">No colleges matched this rank. Try a different exam or a higher rank number.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
                  Found <span className="text-indigo-600">{predicted.length}</span> possible colleges
                </p>
                <AnimatePresence>
                  {predicted.map((college, index) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.07 * index }}
                      className="group bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-6 hover:shadow-md hover:border-indigo-100 transition-all relative"
                    >
                      <CompareButton collegeId={college.id} />
                      <div className="pr-16 mb-4">
                        <h3 className="text-xl font-bold tracking-tight leading-tight mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <MapPin className="w-4 h-4" />
                          {college.location}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Fees</div>
                          <div className="font-bold text-slate-800">{formatRupee(college.fees)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Placement</div>
                          <div className="font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {college.placements[0]?.percentage}%
                          </div>
                        </div>
                        <div className="flex items-end justify-end">
                          <Link href={`/college/${college.id}`} className="text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                            Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
