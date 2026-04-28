import { getCollegeById } from '@/actions/college'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, DollarSign, Star, TrendingUp, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react'
import { CompareButton } from '@/components/CompareButton'

const formatRupee = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

// Using Next.js Server Components for the details page
export default async function CollegePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const college = await getCollegeById(id)

  if (!college) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
      <main className="max-w-screen-xl mx-auto px-8 md:px-24 mt-16 md:mt-24">
        {/* Header Section */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8 border border-black/10 px-4 py-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
          <div className="flex items-center gap-2 text-sm text-black/50 font-bold tracking-widest uppercase mb-6">
            <MapPin className="w-4 h-4" />
            {college.location}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8 text-black">
            {college.name}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-medium max-w-3xl leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <div className="border border-black/10 p-6 flex flex-col gap-2 rounded-none">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Average Fees</span>
            <div className="flex items-center gap-2 font-bold text-2xl text-black">
              {formatRupee(college.fees)}
            </div>
          </div>
          <div className="border border-black/10 p-6 flex flex-col gap-2 rounded-none">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Rating</span>
            <div className="flex items-center gap-2 font-bold text-2xl text-black">
              <Star className="w-5 h-5 fill-black text-black" />
              {college.rating} / 5.0
            </div>
          </div>
          <div className="border border-black/10 p-6 flex flex-col gap-2 rounded-none">
            <span className="text-black/40 text-xs uppercase tracking-widest font-bold">Highest Placement</span>
            <div className="flex items-center gap-2 font-bold text-2xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              {college.placements[0]?.percentage}%
            </div>
          </div>
          <div className="border border-black/10 flex flex-col justify-center rounded-none relative">
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
                  <div key={course.id} className="border border-black/10 p-6 flex justify-between items-center group hover:border-black transition-colors rounded-none">
                    <span className="font-bold text-lg">{course.name}</span>
                    <span className="text-black/50 font-medium text-sm bg-black/5 px-3 py-1">{course.duration}</span>
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
              <div className="border border-black/10 p-8 rounded-none">
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
            <div className="border border-black/10 p-8 bg-black/5 rounded-none">
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
            
            <div className="border border-black/10 p-8 rounded-none">
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
