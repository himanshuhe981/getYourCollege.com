'use server'

import { College, Course, Placement, Cutoff, Review } from '@prisma/client'

export type CollegeWithBasicRelations = College & {
  courses: Course[]
  placements: Placement[]
}

export type FullCollege = College & {
  courses: Course[]
  placements: Placement[]
  cutoffs: Cutoff[]
  reviews: Review[]
}

function getBackendUrl() {
  const url = process.env.BACKEND_URL || 'http://localhost:5000'
  return url
}

export async function getColleges(
  query?: string, 
  filters?: { location?: string, fees?: string },
  page: number = 1,
  limit: number = 12
): Promise<CollegeWithBasicRelations[]> {
  const params = new URLSearchParams()
  if (query) params.append('q', query)
  if (filters?.location && filters.location !== 'All') params.append('location', filters.location)
  if (filters?.fees && filters.fees !== 'All') params.append('fees', filters.fees)
  params.append('page', page.toString())
  params.append('limit', limit.toString())

  try {
    const res = await fetch(`${getBackendUrl()}/api/colleges?${params.toString()}`, {
      cache: 'no-store'
    })
    const json = await res.json()
    if (json.success) return json.data
    return []
  } catch (error) {
    console.error('Error fetching colleges:', error)
    return []
  }
}

export async function getLocations(): Promise<string[]> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/locations`, {
      cache: 'no-store'
    })
    const json = await res.json()
    if (json.success) return json.data
    return []
  } catch (error) {
    console.error('Error fetching locations:', error)
    return []
  }
}

export async function getCollegeById(id: string): Promise<FullCollege | null> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/colleges/${id}`, {
      cache: 'no-store'
    })
    const json = await res.json()
    if (json.success) return json.data
    return null
  } catch (error) {
    console.error('Error fetching college by id:', error)
    return null
  }
}

export async function getCollegesByIds(ids: string[]): Promise<FullCollege[]> {
  if (!ids || ids.length === 0) return []
  
  try {
    // Since we don't have a specific bulk endpoint, we fetch them individually
    // The compare feature usually only has 2-3 colleges anyway
    const promises = ids.map(id => getCollegeById(id))
    const results = await Promise.all(promises)
    return results.filter((c): c is FullCollege => c !== null)
  } catch (error) {
    console.error('Error fetching colleges by ids:', error)
    return []
  }
}

export async function predictColleges(exam: string, rank: number): Promise<CollegeWithBasicRelations[]> {
  const params = new URLSearchParams()
  params.append('exam', exam)
  params.append('rank', rank.toString())

  try {
    const res = await fetch(`${getBackendUrl()}/api/predict?${params.toString()}`, {
      cache: 'no-store'
    })
    const json = await res.json()
    if (json.success) return json.data
    return []
  } catch (error) {
    console.error('Error predicting colleges:', error)
    return []
  }
}

export async function searchCollegesByName(query: string): Promise<{ id: string; name: string; location: string }[]> {
  if (!query || query.trim().length === 0) return []
  
  const params = new URLSearchParams()
  params.append('q', query)

  try {
    const res = await fetch(`${getBackendUrl()}/api/colleges/search?${params.toString()}`, {
      cache: 'no-store'
    })
    const json = await res.json()
    if (json.success) return json.data
    return []
  } catch (error) {
    console.error('Error searching colleges:', error)
    return []
  }
}
