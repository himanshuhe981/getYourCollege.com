import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  console.log('Starting seeding...')

  // Clear existing data
  await prisma.cutoff.deleteMany()
  await prisma.placement.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  // College 1
  const iitb = await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology (IIT) Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 250000,
      rating: 4.9,
      description: 'IIT Bombay is a public technical and research university located in Powai, Mumbai. It is globally recognized as a leader in the field of engineering education and research.',
      courses: {
        create: [
          { name: 'B.Tech in Computer Science', duration: '4 Years' },
          { name: 'B.Tech in Mechanical Engineering', duration: '4 Years' },
        ],
      },
      placements: {
        create: [
          { year: 2023, percentage: 98.5 },
          { year: 2022, percentage: 97.0 },
        ],
      },
      cutoffs: {
        create: [
          { exam: 'JEE Advanced', maxRank: 67 },
        ],
      },
    },
  })

  // College 2
  const bits = await prisma.college.create({
    data: {
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      fees: 550000,
      rating: 4.7,
      description: 'Birla Institute of Technology & Science, Pilani (BITS Pilani) is an all-India Institute for higher education and is considered one of the premier private technical institutes in India.',
      courses: {
        create: [
          { name: 'B.E. in Computer Science', duration: '4 Years' },
          { name: 'B.E. in Electronics & Instrumentation', duration: '4 Years' },
        ],
      },
      placements: {
        create: [
          { year: 2023, percentage: 95.0 },
          { year: 2022, percentage: 94.5 },
        ],
      },
      cutoffs: {
        create: [
          { exam: 'BITSAT', maxRank: 350 }, // Score instead of rank roughly, or rank. Let's assume Rank.
          { exam: 'JEE Main', maxRank: 5000 },
        ],
      },
    },
  })

  // College 3
  const nitT = await prisma.college.create({
    data: {
      name: 'National Institute of Technology (NIT) Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      fees: 180000,
      rating: 4.8,
      description: 'NIT Trichy is one of the premier engineering institutes of India, known for its strong academics and excellent placement records.',
      courses: {
        create: [
          { name: 'B.Tech in Computer Science', duration: '4 Years' },
          { name: 'B.Tech in Civil Engineering', duration: '4 Years' },
        ],
      },
      placements: {
        create: [
          { year: 2023, percentage: 92.0 },
          { year: 2022, percentage: 90.0 },
        ],
      },
      cutoffs: {
        create: [
          { exam: 'JEE Main', maxRank: 1500 },
        ],
      },
    },
  })
  
  // College 4
  const vit = await prisma.college.create({
    data: {
      name: 'Vellore Institute of Technology (VIT)',
      location: 'Vellore, Tamil Nadu',
      fees: 350000,
      rating: 4.3,
      description: 'VIT is a private research deemed university known for its extensive campus and high intake of students with a diverse range of programs.',
      courses: {
        create: [
          { name: 'B.Tech in Computer Science', duration: '4 Years' },
          { name: 'B.Tech in Information Technology', duration: '4 Years' },
        ],
      },
      placements: {
        create: [
          { year: 2023, percentage: 85.0 },
          { year: 2022, percentage: 82.0 },
        ],
      },
      cutoffs: {
        create: [
          { exam: 'VITEEE', maxRank: 20000 },
          { exam: 'JEE Main', maxRank: 40000 },
        ],
      },
    },
  })

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
