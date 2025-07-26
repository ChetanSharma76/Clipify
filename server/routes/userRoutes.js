import express from 'express';
import { userCredits, paymentRazorpay, verifyRazorpay } from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js'; 
import { clerkMiddleware } from '@clerk/express';

const userRouter = express.Router();

userRouter.get('/credits', clerkMiddleware(), userCredits);
userRouter.post('/pay-razor', clerkMiddleware(), paymentRazorpay);
userRouter.post('/verify-razor', clerkMiddleware(), verifyRazorpay);

export default userRouter;
