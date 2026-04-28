'use server'

import { prisma } from '@/lib/prisma'

export async function getColleges(
  query?: string, 
  filters?: { location?: string, fees?: string },
  page: number = 1,
  limit: number = 12
) {
  const where: any = {}
  
  if (query) {
    where.name = { contains: query, mode: 'insensitive' }
  }
  
  if (filters?.location && filters.location !== 'All') {
    where.location = { contains: filters.location, mode: 'insensitive' }
  }

  if (filters?.fees && filters.fees !== 'All') {
    if (filters.fees === 'Below 5L') where.fees = { lt: 500000 }
    if (filters.fees === '5L - 10L') where.fees = { gte: 500000, lte: 1000000 }
    if (filters.fees === 'Above 10L') where.fees = { gt: 1000000 }
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
    orderBy: { rating: 'desc' },
    skip: (page - 1) * limit,
    take: limit
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

export async function getCollegesByIds(ids: string[]) {
  return await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      courses: true,
      placements: {
        orderBy: { year: 'desc' }
      },
      cutoffs: true
    }
  })
}

export async function predictColleges(exam: string, rank: number) {
  // Find cutoffs where the user's rank is less than or equal to the maxRank (meaning they qualify)
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      exam: { equals: exam, mode: 'insensitive' },
      maxRank: { gte: rank }
    },
    include: {
      college: {
        include: {
          courses: true,
          placements: { orderBy: { year: 'desc' }, take: 1 }
        }
      }
    },
    orderBy: { maxRank: 'asc' } // show closest matches first
  })

  // Extract colleges from cutoffs and remove duplicates
  const collegeMap = new Map()
  for (const c of cutoffs) {
    if (!collegeMap.has(c.collegeId)) {
      collegeMap.set(c.collegeId, c.college)
    }
  }

  return Array.from(collegeMap.values())
}
