import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { sendSuccess, sendError } from '../lib/response'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/colleges
// Query: q, location, fees, page, limit
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q        = req.query.q        as string | undefined
    const location = req.query.location as string | undefined
    const fees     = req.query.fees     as string | undefined
    const page  = Math.max(1,  parseInt((req.query.page  as string) ?? '1',  10) || 1)
    const limit = Math.min(50, parseInt((req.query.limit as string) ?? '12', 10) || 12)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {}

    if (q && q.trim()) {
      where.name = { contains: q.trim(), mode: 'insensitive' }
    }

    if (location && location !== 'All') {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (fees && fees !== 'All') {
      if (fees === 'Below 5L')  where.fees = { lt: 500000 }
      if (fees === '5L - 10L')  where.fees = { gte: 500000, lte: 1000000 }
      if (fees === 'Above 10L') where.fees = { gt: 1000000 }
    }

    const [total, colleges] = await prisma.$transaction([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        include: {
          courses: true,
          placements: { orderBy: { year: 'desc' }, take: 1 },
        },
        orderBy: { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    sendSuccess(res, colleges, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/colleges/search   ← must be declared BEFORE /:id
// Query: q (required), limit
// ─────────────────────────────────────────────────────────────────────────────
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q     = req.query.q as string | undefined
    const limit = Math.min(20, parseInt((req.query.limit as string) ?? '5', 10) || 5)

    if (!q || q.trim().length === 0) {
      sendError(res, 'Query parameter "q" is required', 400)
      return
    }

    const results = await prisma.college.findMany({
      where: { name: { contains: q.trim(), mode: 'insensitive' } },
      select: { id: true, name: true, location: true },
      orderBy: { rating: 'desc' },
      take: limit,
    })

    sendSuccess(res, results)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/colleges/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' } },
        cutoffs: true,
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!college) {
      sendError(res, `College with ID "${id}" not found`, 404)
      return
    }

    sendSuccess(res, college)
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/colleges/:id/reviews
// Body: { authorName: string, rating: number, content: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:id/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { authorName, rating, content } = req.body as Record<string, unknown>

    // 1. College must exist
    const collegeExists = await prisma.college.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!collegeExists) {
      sendError(res, `College with ID "${id}" not found`, 404)
      return
    }

    // 2. Validate authorName
    if (!authorName || typeof authorName !== 'string' || authorName.trim().length === 0) {
      sendError(res, '"authorName" is required and must be a non-empty string', 400)
      return
    }
    if (authorName.trim().length > 100) {
      sendError(res, '"authorName" must not exceed 100 characters', 400)
      return
    }

    // 3. Validate rating
    const parsedRating = Number(rating)
    if (rating === undefined || rating === null || isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      sendError(res, '"rating" must be a number between 0 and 5', 400)
      return
    }

    // 4. Validate content
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      sendError(res, '"content" is required and must be at least 10 characters', 400)
      return
    }
    if (content.trim().length > 2000) {
      sendError(res, '"content" must not exceed 2000 characters', 400)
      return
    }

    const review = await prisma.review.create({
      data: {
        authorName: authorName.trim(),
        rating: Math.round(parsedRating * 10) / 10,
        content: content.trim(),
        collegeId: id,
      },
    })

    sendSuccess(res, review, undefined, 201)
  } catch (err) {
    next(err)
  }
})

export default router
