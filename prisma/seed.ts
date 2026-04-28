import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal']
const prefixes = ['Institute of Technology', 'Engineering College', 'University of Technology', 'Technical Institute', 'Academy of Engineering']
const types = ['National', 'State', 'Global', 'Advanced', 'Modern', 'Pioneer']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'West Bengal', 'Rajasthan', 'Gujarat', 'Gujarat', 'Uttar Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Madhya Pradesh']

type CollegeData = {
  name: string
  location: string
  fees: number
  rating: number
  description: string
  courses: string[]
  placements: number[]
  cutoffs: { exam: string; rank: number }[]
  reviews: { authorName: string; rating: number; content: string }[]
}

function generateColleges(): CollegeData[] {
  const colleges: CollegeData[] = [
    {
      name: 'Indian Institute of Technology (IIT) Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 250000,
      rating: 4.9,
      description: 'Globally recognized as a leader in engineering education and research, featuring state-of-the-art facilities.',
      courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
      placements: [98.5, 97.0],
      cutoffs: [{ exam: 'JEE Advanced', rank: 67 }],
      reviews: [
        { authorName: 'Arjun K.', rating: 5.0, content: 'World-class faculty and research opportunities. Placement record speaks for itself.' },
        { authorName: 'Sneha R.', rating: 4.8, content: 'Intense but rewarding. The alumni network is unmatched.' }
      ]
    },
    {
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      fees: 550000,
      rating: 4.8,
      description: 'Premier private technical institute with a strong entrepreneurial culture and zero-attendance policy.',
      courses: ['Computer Science', 'Electronics', 'Chemical Engineering'],
      placements: [95.0, 94.5],
      cutoffs: [{ exam: 'BITSAT', rank: 350 }, { exam: 'JEE Main', rank: 5000 }],
      reviews: [
        { authorName: 'Rahul M.', rating: 4.9, content: 'The freedom to structure your own schedule is something you will not get elsewhere.' },
        { authorName: 'Divya S.', rating: 4.7, content: 'Great campus culture and strong placements in product companies.' }
      ]
    },
    {
      name: 'IIT Delhi',
      location: 'New Delhi, Delhi',
      fees: 240000,
      rating: 4.9,
      description: 'A globally renowned research and engineering institution located in the heart of India\'s capital.',
      courses: ['Computer Science', 'Mathematics & Computing', 'Civil Engineering'],
      placements: [97.5, 96.0],
      cutoffs: [{ exam: 'JEE Advanced', rank: 110 }],
      reviews: [
        { authorName: 'Priya T.', rating: 5.0, content: 'Exceptional professors and a research culture that pushes you to think beyond textbooks.' },
        { authorName: 'Karan B.', rating: 4.8, content: 'Being in Delhi gives you access to a lot of internship and networking opportunities.' }
      ]
    },
    {
      name: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      fees: 350000,
      rating: 4.3,
      description: 'Known for its diverse student body, international collaborations, and flexible credit system.',
      courses: ['Information Technology', 'Biotechnology', 'Computer Science'],
      placements: [85.0, 82.0],
      cutoffs: [{ exam: 'VITEEE', rank: 20000 }],
      reviews: [
        { authorName: 'Aisha P.', rating: 4.3, content: 'Good infrastructure and plenty of clubs. Placements have improved year on year.' },
        { authorName: 'Rohit V.', rating: 4.2, content: 'Flexible curriculum is a big plus. Faculty quality varies by department.' }
      ]
    }
  ]

  const exams = ['JEE Main', 'WBJEE', 'MET', 'VITEEE', 'BITSAT', 'MHT CET', 'KCET', 'COMEDK']

  for (let i = colleges.length; i < 55; i++) {
    const cityIdx = Math.floor(Math.random() * cities.length)
    const city = cities[cityIdx]
    const state = states[cityIdx]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    
    // Generate realistic variance
    const isPremium = Math.random() > 0.8
    const fees = isPremium ? (Math.floor(Math.random() * 4 + 2) * 100000) : (Math.floor(Math.random() * 8 + 1) * 25000)
    const rating = (Math.random() * 1.5 + 3.0 + (isPremium ? 0.5 : 0)).toFixed(1)
    const placement = Math.floor(Math.random() * 30 + 60 + (isPremium ? 10 : 0))
    const exam = exams[Math.floor(Math.random() * exams.length)]
    const rank = Math.floor(Math.random() * 50000 + (isPremium ? 1000 : 10000))

    colleges.push({
      name: `${city} ${type} ${prefix}`,
      location: `${city}, ${state}`,
      fees: fees,
      rating: parseFloat(rating),
      description: `A reputed institution in ${city} offering comprehensive engineering programs with a focus on practical skills and industry exposure.`,
      courses: ['Computer Science', 'Electronics & Communication', 'Mechanical Engineering'].slice(0, Math.floor(Math.random() * 2 + 1)),
      placements: [Math.min(placement, 99)],
      cutoffs: [{ exam: exam, rank: rank }],
      reviews: [
        { authorName: 'Aarav M.', rating: parseFloat(rating), content: 'Great faculty and placement support. Highly recommended for CSE.' },
        { authorName: 'Priya S.', rating: parseFloat(rating) - 0.5, content: 'Campus life is amazing, but the curriculum could be updated to modern standards.' },
        { authorName: 'Rohan D.', rating: parseFloat(rating) + 0.2 > 5 ? 5 : parseFloat(rating) + 0.2, content: 'Excellent infrastructure. The labs are well-equipped.' }
      ]
    })
  }

  return colleges
}

async function main() {
  console.log('Starting seeding...')

  await prisma.review.deleteMany()
  await prisma.cutoff.deleteMany()
  await prisma.placement.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  const collegesData = generateColleges()

  for (const col of collegesData) {
    await prisma.college.create({
      data: {
        name: col.name,
        location: col.location,
        fees: col.fees,
        rating: col.rating,
        description: col.description,
        courses: {
          create: col.courses.map(c => ({ name: `B.Tech in ${c}`, duration: '4 Years' }))
        },
        placements: {
          create: col.placements.map((p, i) => ({ year: 2023 - i, percentage: p }))
        },
        cutoffs: {
          create: col.cutoffs.map(c => ({ exam: c.exam, maxRank: c.rank }))
        },
        reviews: {
          create: col.reviews ? col.reviews.map(r => ({ authorName: r.authorName, rating: r.rating, content: r.content })) : []
        }
      }
    })
  }

  console.log('Seeding finished with', collegesData.length, 'colleges.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
