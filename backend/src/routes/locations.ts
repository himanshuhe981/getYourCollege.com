import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { sendSuccess } from '../lib/response'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/locations
// Returns all distinct college locations, sorted alphabetically.
// Used to populate filter dropdowns on the frontend.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.college.findMany({
      select: { location: true },
      distinct: ['location'],
      orderBy: { location: 'asc' },
    })

    sendSuccess(res, rows.map((r) => r.location))
  } catch (err) {
    next(err)
  }
})

export default router
