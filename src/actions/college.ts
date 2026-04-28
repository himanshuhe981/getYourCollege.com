'use server'

import { prisma } from '@/lib/prisma'

export async function getColleges(query?: string, filters?: { location?: string }) {
  const where: any = {}
  
  if (query) {
    where.name = { contains: query, mode: 'insensitive' }
  }
  
  if (filters?.location && filters.location !== 'All') {
    where.location = { contains: filters.location, mode: 'insensitive' }
  }

  const colleges = await prisma.college.findMany({
    where,
    include: {
      courses: true,
      placements: {
        orderBy: { year: 'desc' },
        take: 1
      }
    },
    orderBy: { rating: 'desc' }
  })
  
  return colleges
}

export async function getLocations() {
  const locations = await prisma.college.findMany({
    select: { location: true },
    distinct: ['location']
  })
  return locations.map(l => l.location)
}

export async function getCollegeById(id: string) {
  return await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      placements: {
        orderBy: { year: 'desc' }
      },
      cutoffs: true
    }
  })
}
