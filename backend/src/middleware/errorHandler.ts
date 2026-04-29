import type { ErrorRequestHandler } from 'express'
import { sendError } from '../lib/response'

/**
 * Global Express error handler.
 * Must have exactly 4 parameters — Express identifies this as an error handler
 * via the function signature (err, req, res, next).
 *
 * Catches any error thrown inside route handlers via next(err) or unhandled
 * async rejections forwarded through express-async-errors / manual next(err).
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred'
  const status: number =
    typeof (err as { status?: number }).status === 'number'
      ? (err as { status: number }).status
      : 500

  console.error(`[Global Error Handler] ${status} —`, message)
  sendError(res, message, status)
}
