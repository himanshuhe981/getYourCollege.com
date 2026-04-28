import { getCollegeById } from '@/actions/college'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, TrendingUp, ArrowLeft, BookOpen, GraduationCap, MessageSquare } from 'lucide-react'
import { CompareButton } from '@/components/CompareButton'

const formatRupee = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export default async function CollegePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const college = await getCollegeById(id)

  if (!college) notFound()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-6 md:px-16 mt-12">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-10 bg-white/80 border border-white shadow-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold tracking-widest uppercase mb-4">
            <MapPin className="w-3 h-3" />
            {college.location}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6 text-slate-800">
            {college.name}
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-6 flex flex-col gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Annual Fees</span>
            <div className="font-bold text-xl text-slate-800">{formatRupee(college.fees)}</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-6 flex flex-col gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Rating</span>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              {college.rating} / 5.0
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-6 flex flex-col gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Top Placement</span>
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              {college.placements[0]?.percentage}%
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] overflow-hidden relative">
            <CompareButton collegeId={college.id} fullWidth={true} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-14">

            {/* Courses */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3 text-slate-800">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                Courses Offered
              </h2>
              <div className="grid gap-3">
                {college.courses.map(course => (
                  <div key={course.id} className="bg-white/70 border border-white shadow-sm rounded-2xl p-5 flex justify-between items-center hover:shadow-md hover:border-indigo-100 transition-all">
                    <span className="font-bold text-slate-800">{course.name}</span>
                    <span className="text-slate-500 font-medium text-sm bg-slate-100 px-3 py-1 rounded-full">{course.duration}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Placements */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3 text-slate-800">
                <GraduationCap className="w-6 h-6 text-indigo-500" />
                Placement Record
              </h2>
              <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-8">
                <div className="flex flex-col gap-6">
                  {college.placements.map(p => (
                    <div key={p.id} className="flex items-center gap-6">
                      <div className="w-16 text-slate-400 font-bold text-sm">{p.year}</div>
                      <div className="flex-grow bg-slate-100 h-3 rounded-full relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
                          style={{ width: `${p.percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right font-bold text-slate-700">{p.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews */}
            {college.reviews && college.reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3 text-slate-800">
                  <MessageSquare className="w-6 h-6 text-indigo-500" />
                  Student Reviews
                </h2>
                <div className="grid gap-4">
                  {college.reviews.map(review => (
                    <div key={review.id} className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{review.authorName}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-sm text-amber-700">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-[1.5rem] p-7">
              <h3 className="font-bold text-lg mb-5 text-slate-800">Exam Cutoffs</h3>
              <div className="space-y-4">
                {college.cutoffs.map(c => (
                  <div key={c.id} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-700">{c.exam}</span>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Rank ≤ {c.maxRank.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-[1.5rem] p-7">
              <h3 className="font-bold text-lg mb-3">Compare This College</h3>
              <p className="text-indigo-200 text-sm mb-6 leading-relaxed">See how it stacks up against other colleges side-by-side.</p>
              <Link href="/compare" className="block w-full text-center bg-white text-indigo-700 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Go to Compare →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
