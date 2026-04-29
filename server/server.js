import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import userRouter from './routes/userRoutes.js'
import connectCloudinary from './configs/cloudinary.js'

const app = express()

await connectCloudinary()

app.use(cors({
  origin: 'http://localhost:5173',
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

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})