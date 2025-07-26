import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import connectDB from './configs/mongodb.js';
import imageRouter from './routes/imageRoutes.js';
import { clerkMiddleware } from '@clerk/express'


// App Config

const PORT = process.env.PORT || 4000
const app = express();
await connectDB()
app.use(cors())
app.use(clerkMiddleware())
app.use(express.json());

// API routes
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.get('/', (req,res) => res.send("API Working"))

app.listen(PORT, () => console.log('Server running on port ' + PORT));
