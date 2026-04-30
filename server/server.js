import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import userRouter from './routes/userRoutes.js'
import connectCloudinary from './configs/cloudinary.js'
import { allowedOrigins } from './configs/deployment.js'

const app = express()

await connectCloudinary()

/*
  CORS configuration (deployment-safe):

  - Local development: `NODE_ENV !== 'production'` — allow all origins for convenience.
  - Production: enforce origins listed in environment variables
    `FRONTEND_URL` and `FRONTEND_PRODUCTION_URL` (see `server/.env` examples).

  Debug fallback: when no origins are configured the server will allow requests
  to aid preview/deployment workflows. For stricter production enforcement,
  populate the env vars with your exact frontend origins.
*/
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true)

      // Development: allow all origins to simplify local dev and preview flows
      if (process.env.NODE_ENV !== 'production') return callback(null, true)

      // Production: enforce configured allowed origins when provided
      if (!allowedOrigins || allowedOrigins.length === 0) return callback(null, true)

      if (allowedOrigins.includes(origin)) return callback(null, true)

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

/*
  Stricter production example (uncomment to enforce only configured origins):

  const strictAllowed = [process.env.FRONTEND_URL, process.env.FRONTEND_PRODUCTION_URL].filter(Boolean)
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (strictAllowed.includes(origin)) return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }))

*/

app.use(express.json())

app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Server is Live!')
})

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})