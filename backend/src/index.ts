import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'
import collegesRouter from './routes/colleges'
import predictRouter from './routes/predict'
import locationsRouter from './routes/locations'

const app = express()
const PORT = parseInt(process.env.PORT ?? '5000', 10)

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Whitelist: localhost dev + the deployed Vercel frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps, server-side fetches)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: Origin "${origin}" is not allowed`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ─────────────────────────────────────────────────────────────
// Railway and Render use this to verify the service is alive
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/colleges',  collegesRouter)
app.use('/api/predict',   predictRouter)
app.use('/api/locations', locationsRouter)

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404,
  })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be registered AFTER all routes
app.use(errorHandler)

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Backend running at http://localhost:${PORT}`)
  console.log(`    GET  /health`)
  console.log(`    GET  /api/colleges`)
  console.log(`    GET  /api/colleges/search?q=IIT`)
  console.log(`    GET  /api/colleges/:id`)
  console.log(`    POST /api/colleges/:id/reviews`)
  console.log(`    GET  /api/predict?exam=JEE+Advanced&rank=500`)
  console.log(`    GET  /api/locations`)
})
