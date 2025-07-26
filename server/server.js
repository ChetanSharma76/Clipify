// --- server.js ---
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import connectDB from './configs/mongodb.js';
import imageRouter from './routes/imageRoutes.js';
import { clerkWebhooks } from './controllers/UserController.js'; // Import the controller directly

// App Config
const PORT = process.env.PORT || 4000;
const app = express();

// --- Middleware Configuration ---
const corsOptions = {
  origin: ['http://localhost:5173', 'https://clipify-frontend.vercel.app'], // Add your frontend origins
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight requests

app.post(
  '/api/user/webhooks',
  express.raw({ type: 'application/json' }), // Use Express's built-in raw body parser
  clerkWebhooks
);

app.use(express.json());


// The webhook route is already defined above, so the userRouter doesn't need it.
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get('/', (req, res) => res.send("API Working"));

// Connect to DB and Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
}

startServer();
