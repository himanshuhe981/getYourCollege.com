import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { sendSuccess, sendError } from '../lib/response'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/predict
// Query: exam (required), rank (required positive integer)
//
// Returns colleges whose cutoff for the given exam has maxRank >= the
// candidate's rank (i.e. the candidate qualifies). Sorted by most
// competitive cutoff first, deduplicated by college.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exam      = req.query.exam as string | undefined
    const rankParam = req.query.rank as string | undefined

    if (!exam || exam.trim().length === 0) {
      sendError(res, 'Query parameter "exam" is required', 400)
      return
    }

    if (!rankParam) {
      sendError(res, 'Query parameter "rank" is required', 400)
      return
    }

    const rank = parseInt(rankParam, 10)
    if (isNaN(rank) || rank < 1) {
      sendError(res, '"rank" must be a positive integer', 400)
      return
    }

    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam: { equals: exam.trim(), mode: 'insensitive' },
        maxRank: { gte: rank },
      },
      include: {
        college: {
          include: {
            placements: { orderBy: { year: 'desc' }, take: 1 },
            courses: true,
          },
        },
      },
      orderBy: { maxRank: 'asc' }, // most selective first
    })

    // Deduplicate: a college can have multiple cutoff rows
    const seen = new Set<string>()
    const colleges = cutoffs
      .map((c) => c.college)
      .filter((col) => {
        if (seen.has(col.id)) return false
        seen.add(col.id)
        return true
      })

    sendSuccess(res, colleges, {
      exam: exam.trim(),
      rank,
      count: colleges.length,
    })
  } catch (err) {
    next(err)
  }
})

export default router
