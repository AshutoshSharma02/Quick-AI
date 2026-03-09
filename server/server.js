import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()
await connectCloudinary()

// Middleware order is important
app.use(cors())
app.options('*', cors())
// Bypass auth for CORS preflight on API routes
app.use('/api', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json())

// Clerk middleware must be before routes
app.use(clerkMiddleware())

// Root route for health check
app.get('/', (req, res)=>{
    res.send('Server is Live!')
}) 

// API routes - route-specific auth is applied within routers
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)


// Catch-all route for 404


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})
