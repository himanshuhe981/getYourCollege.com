import type { Response } from 'express'

// ─── Response Shapes ─────────────────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export type ApiError = {
  success: false
  error: string
  statusCode: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Send a typed success response.
 * Shape: { success: true, data: T, meta?: {...} }
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  status = 200
): void {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  }
  res.status(status).json(body)
}

/**
 * Send a typed error response.
 * Shape: { success: false, error: string, statusCode: number }
 */
export function sendError(res: Response, message: string, status = 500): void {
  const body: ApiError = { success: false, error: message, statusCode: status }
  res.status(status).json(body)
}
