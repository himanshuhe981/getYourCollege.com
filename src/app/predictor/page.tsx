'use client'

import { useState } from 'react'
import { predictColleges } from '@/actions/college'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, MapPin, TrendingUp, DollarSign, Star, ChevronRight } from 'lucide-react'
import { CompareButton } from '@/components/CompareButton'

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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Top Navigation */}
      <header className="border-b border-black/10 py-6 px-8 md:px-24 sticky top-0 bg-white/80 backdrop-blur-md z-40 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-black/60 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>
      </header>

      <main className="max-w-screen-xl mx-auto px-8 md:px-24 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 border border-black/10 p-8 bg-black/5">
              <h1 className="text-4xl font-bold tracking-tighter leading-[0.9] mb-4">
                Predictor.
              </h1>
              <p className="text-black/60 font-medium mb-8 leading-relaxed">
                Enter your expected exam rank to see which colleges you might qualify for based on past cutoffs.
              </p>

              <form onSubmit={handlePredict} className="space-y-6">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-black/50 mb-2 block">Select Exam</label>
                  <select 
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black transition-all font-medium appearance-none"
                  >
                    {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-black/50 mb-2 block">Your Rank / Score</label>
                  <input 
                    type="number" 
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. 5000"
                    required
                    className="w-full px-4 py-4 bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-black transition-all font-medium text-lg"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !rank}
                  className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Analyzing Data...' : 'Predict Colleges'}
                  {!loading && <Target className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="h-full flex items-center justify-center min-h-[400px] border border-black/10 border-dashed text-center p-12">
                <div>
                  <Target className="w-12 h-12 mx-auto mb-4 text-black/20" />
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Awaiting Input</h2>
                  <p className="text-black/60 font-medium max-w-md mx-auto">Fill out the predictor form on the left to see your personalized college recommendations.</p>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-black/5 animate-pulse border border-black/10"></div>
                ))}
              </div>
            ) : predicted.length === 0 ? (
              <div className="h-full flex items-center justify-center min-h-[400px] border border-black/10 border-dashed text-center p-12 bg-red-50/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-red-600">No matches found</h2>
                  <p className="text-red-900/60 font-medium max-w-md mx-auto">Based on the historical cutoffs, it seems difficult to secure a seat with this rank. Try selecting another exam or improving the rank.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight mb-6">Found {predicted.length} possible colleges</h2>
                {predicted.map((college, index) => (
                  <motion.div 
                    key={college.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-black/10 bg-white p-6 hover:border-black transition-colors relative group"
                  >
                    <CompareButton collegeId={college.id} />
                    <div className="pr-16 mb-4">
                      <h3 className="text-2xl font-bold tracking-tight leading-tight mb-2">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-black/50 font-semibold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" />
                        {college.location}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-6 border-t border-black/5 pt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-black/40 text-[10px] uppercase tracking-widest font-bold">Fees</span>
                        <div className="font-bold text-base flex items-center">
                          <DollarSign className="w-4 h-4 -ml-1" />
                          {(college.fees / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-black/40 text-[10px] uppercase tracking-widest font-bold">Placement</span>
                        <div className="font-bold text-base text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {college.placements[0]?.percentage}%
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex items-end justify-end">
                        <Link href={`/college/${college.id}`} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
