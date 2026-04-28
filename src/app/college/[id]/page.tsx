import { getCollegeById } from '@/actions/college'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, DollarSign, Star, TrendingUp, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react'
import { CompareButton } from '@/components/CompareButton'

// Using Next.js Server Components for the details page
export default async function CollegePage({ params }: { params: { id: string } }) {
  const college = await getCollegeById(params.id)

  if (!college) {
    notFound()
  }

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
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-sm text-black/50 font-bold tracking-widest uppercase mb-6">
            <MapPin className="w-4 h-4" />
            {college.location}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
            {college.name}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-medium max-w-3xl leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <div className="border border-black/10 p-6 flex flex-col gap-2">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Average Fees</span>
            <div className="flex items-center gap-2 font-bold text-2xl">
              <DollarSign className="w-5 h-5" />
              ₹{(college.fees / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="border border-black/10 p-6 flex flex-col gap-2">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Rating</span>
            <div className="flex items-center gap-2 font-bold text-2xl">
              <Star className="w-5 h-5 fill-black" />
              {college.rating} / 5.0
            </div>
          </div>
          <div className="border border-black/10 p-6 flex flex-col gap-2">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Highest Placement</span>
            <div className="flex items-center gap-2 font-bold text-2xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              {college.placements[0]?.percentage}%
            </div>
          </div>
          <div className="border border-black/10 flex flex-col justify-center">
            <CompareButton collegeId={college.id} fullWidth={true} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-16">
            {/* Courses Section */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                Courses Offered
              </h2>
              <div className="grid gap-4">
                {college.courses.map(course => (
                  <div key={course.id} className="border border-black/10 p-6 flex justify-between items-center group hover:border-black transition-colors">
                    <span className="font-bold text-lg">{course.name}</span>
                    <span className="text-black/50 font-medium text-sm bg-black/5 px-3 py-1 rounded-full">{course.duration}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Placement Trends */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                Placement Record
              </h2>
              <div className="border border-black/10 p-8">
                <div className="flex flex-col gap-6">
                  {college.placements.map(p => (
                    <div key={p.id} className="flex items-center gap-6">
                      <div className="w-16 text-black/40 font-bold">{p.year}</div>
                      <div className="flex-grow bg-black/5 h-4 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-black"
                          style={{ width: `${p.percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right font-bold">{p.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="border border-black/10 p-8 bg-black/5">
              <h3 className="font-bold text-xl mb-6 tracking-tight">Exam Cutoffs</h3>
              <div className="space-y-4">
                {college.cutoffs.map(c => (
                  <div key={c.id} className="flex justify-between items-center border-b border-black/10 pb-4 last:border-0 last:pb-0">
                    <span className="font-bold">{c.exam}</span>
                    <span className="text-sm font-medium text-black/60">Rank: {c.maxRank}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border border-black/10 p-8">
              <h3 className="font-bold text-xl mb-4 tracking-tight">Need help deciding?</h3>
              <p className="text-black/60 mb-6 font-medium">Add this college to your comparison list to see how it stacks up against others.</p>
              <Link href="/compare" className="block w-full text-center bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors">
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
