import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import userRouter from './routes/userRoutes.js'
import connectCloudinary from './configs/cloudinary.js'

const app = express()

await connectCloudinary()

// ✅ FIXED CORS (IMPORTANT)
const allowedOrigins = [
  'http://localhost:5173',
  'https://quick-ai-chi-eight.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

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