import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

// Initialize Express
const app = express()

// CORS Configuration — allow frontend origin (localhost:5173 for dev)
app.use(cors({
  origin: 'https://lms-full-stack-server-steel.vercel.app/', // or use '*' for any origin in dev, but this is more secure
  credentials: true
}))

// Connect to database and Cloudinary
await connectDB()
await connectCloudinary()

// Parse JSON and apply middlewares
app.use(express.json())          // To parse JSON bodies
app.use(clerkMiddleware())       // Clerk middleware for authentication

// Routes
app.get('/', (req, res) => res.send("API Working"))

// Webhooks
app.post('/clerk', express.json(), clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// API Routes
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})
