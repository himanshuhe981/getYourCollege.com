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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-8 md:px-20 mt-14">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        {/* Hero */}
        <div className="mb-14">
          <div className="flex items-center gap-2 text-xs text-black/40 font-bold tracking-widest uppercase mb-5">
            <MapPin className="w-3.5 h-3.5" />
            {college.location}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6 text-black">
            {college.name}
          </h1>
          <p className="text-xl text-black/55 font-medium max-w-3xl leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-black/10 mb-16">
          <div className="border-r border-black/10 p-7 flex flex-col gap-2">
            <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Annual Fees</span>
            <div className="font-bold text-xl text-black">{formatRupee(college.fees)}</div>
          </div>
          <div className="border-r border-black/10 p-7 flex flex-col gap-2">
            <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Rating</span>
            <div className="flex items-center gap-2 font-bold text-xl text-black">
              <Star className="w-5 h-5 fill-black text-black" />
              {college.rating} / 5.0
            </div>
          </div>
          <div className="border-r border-black/10 p-7 flex flex-col gap-2">
            <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Top Placement</span>
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              {college.placements[0]?.percentage}%
            </div>
          </div>
          <div className="relative">
            <CompareButton collegeId={college.id} fullWidth />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* Main */}
          <div className="md:col-span-2 space-y-14">

            {/* Courses */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2 text-black">
                <BookOpen className="w-6 h-6" />
                Courses Offered
              </h2>
              <div className="grid gap-3">
                {college.courses.map(course => (
                  <div key={course.id} className="border border-black/10 p-5 flex justify-between items-center hover:border-black transition-colors">
                    <span className="font-bold text-black">{course.name}</span>
                    <span className="text-black/50 text-sm font-medium bg-black/[0.04] px-3 py-1">{course.duration}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Placements */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2 text-black">
                <GraduationCap className="w-6 h-6" />
                Placement Record
              </h2>
              <div className="border border-black/10 p-8">
                <div className="flex flex-col gap-6">
                  {college.placements.map(p => (
                    <div key={p.id} className="flex items-center gap-6">
                      <div className="w-14 text-black/40 font-bold text-sm">{p.year}</div>
                      <div className="flex-grow bg-black/[0.05] h-3 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-black transition-all" style={{ width: `${p.percentage}%` }} />
                      </div>
                      <div className="w-14 text-right font-bold text-sm text-black">{p.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews */}
            {college.reviews && college.reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2 text-black">
                  <MessageSquare className="w-6 h-6" />
                  Student Reviews
                </h2>
                <div className="grid gap-4">
                  {college.reviews.map(review => (
                    <div key={review.id} className="border border-black/10 p-6 hover:border-black/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-bold text-sm">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-black">{review.authorName}</div>
                            <div className="text-xs text-black/40 font-medium">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.round(review.rating) ? 'fill-black text-black' : 'text-black/15'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-black/60 leading-relaxed font-medium">{review.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-black/10 p-7">
              <h3 className="font-bold text-lg mb-5 tracking-tight text-black">Exam Cutoffs</h3>
              <div className="space-y-4">
                {college.cutoffs.map(c => (
                  <div key={c.id} className="flex justify-between items-center border-b border-black/[0.06] pb-4 last:border-0 last:pb-0">
                    <span className="font-bold text-sm text-black">{c.exam}</span>
                    <span className="text-xs font-bold text-black/60 bg-black/[0.04] px-3 py-1">
                      Rank ≤ {c.maxRank.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-black/10 p-7 bg-black text-white">
              <h3 className="font-bold text-lg mb-3">Compare This College</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">See how it stacks up against other colleges side by side.</p>
              <Link href="/compare" className="block w-full text-center bg-white text-black py-3 font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-colors">
                Go to Compare →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
