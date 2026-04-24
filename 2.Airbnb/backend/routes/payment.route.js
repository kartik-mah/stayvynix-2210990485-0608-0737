import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", isAuth, createOrder);

// Verify payment and create booking
router.post("/verify-payment", isAuth, verifyPayment);

export default router;
