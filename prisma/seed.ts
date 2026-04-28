import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  console.log('Starting seeding...')

  await prisma.cutoff.deleteMany()
  await prisma.placement.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  const collegesData = [
    {
      name: 'Indian Institute of Technology (IIT) Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 250000,
      rating: 4.9,
      description: 'Globally recognized as a leader in engineering education and research, featuring state-of-the-art facilities.',
      courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
      placements: [98.5, 97.0],
      cutoffs: [{ exam: 'JEE Advanced', rank: 67 }]
    },
    {
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      fees: 550000,
      rating: 4.8,
      description: 'Premier private technical institute with a strong entrepreneurial culture and zero-attendance policy.',
      courses: ['Computer Science', 'Electronics', 'Chemical Engineering'],
      placements: [95.0, 94.5],
      cutoffs: [{ exam: 'BITSAT', rank: 350 }, { exam: 'JEE Main', rank: 5000 }]
    },
    {
      name: 'IIT Delhi',
      location: 'New Delhi, Delhi',
      fees: 240000,
      rating: 4.9,
      description: 'A globally renowned research and engineering institution located in the heart of India\'s capital.',
      courses: ['Computer Science', 'Mathematics & Computing', 'Civil Engineering'],
      placements: [97.5, 96.0],
      cutoffs: [{ exam: 'JEE Advanced', rank: 110 }]
    },
    {
      name: 'NIT Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      fees: 180000,
      rating: 4.8,
      description: 'One of the top NITs in India, famous for its cultural festivals and outstanding academic excellence.',
      courses: ['Computer Science', 'Production Engineering', 'Architecture'],
      placements: [92.0, 90.0],
      cutoffs: [{ exam: 'JEE Main', rank: 1500 }]
    },
    {
      name: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      fees: 350000,
      rating: 4.3,
      description: 'Known for its diverse student body, international collaborations, and flexible credit system.',
      courses: ['Information Technology', 'Biotechnology', 'Computer Science'],
      placements: [85.0, 82.0],
      cutoffs: [{ exam: 'VITEEE', rank: 20000 }]
    },
    {
      name: 'IIT Madras',
      location: 'Chennai, Tamil Nadu',
      fees: 250000,
      rating: 4.9,
      description: 'Ranked #1 engineering college in India consistently, nestled in a beautiful forested campus.',
      courses: ['Aerospace Engineering', 'Computer Science', 'Naval Architecture'],
      placements: [96.5, 95.0],
      cutoffs: [{ exam: 'JEE Advanced', rank: 160 }]
    },
    {
      name: 'Delhi Technological University (DTU)',
      location: 'New Delhi, Delhi',
      fees: 200000,
      rating: 4.5,
      description: 'A highly sought-after public university known for strong industry ties and stellar software placements.',
      courses: ['Software Engineering', 'Computer Science', 'Electronics'],
      placements: [90.0, 88.0],
      cutoffs: [{ exam: 'JEE Main', rank: 4500 }]
    },
    {
      name: 'IIIT Hyderabad',
      location: 'Hyderabad, Telangana',
      fees: 400000,
      rating: 4.7,
      description: 'A pioneer in IT research in India, offering some of the highest coding standards and packages.',
      courses: ['Computer Science', 'Electronics and Communication'],
      placements: [99.0, 98.0],
      cutoffs: [{ exam: 'JEE Main', rank: 900 }]
    },
    {
      name: 'Manipal Institute of Technology',
      location: 'Manipal, Karnataka',
      fees: 450000,
      rating: 4.2,
      description: 'Vibrant campus life with modern infrastructure and extensive global alumni network.',
      courses: ['Computer & Communication', 'Mechatronics', 'Aeronautical'],
      placements: [80.0, 75.0],
      cutoffs: [{ exam: 'MET', rank: 5000 }]
    },
    {
      name: 'Jadavpur University',
      location: 'Kolkata, West Bengal',
      fees: 25000,
      rating: 4.6,
      description: 'Extremely affordable public university offering exceptional ROI and high-quality research output.',
      courses: ['Computer Science', 'Information Technology', 'Printing Engineering'],
      placements: [93.0, 91.0],
      cutoffs: [{ exam: 'WBJEE', rank: 100 }]
    }
  ]

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
        }
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
