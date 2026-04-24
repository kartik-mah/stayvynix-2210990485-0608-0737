import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
  });
};

export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ 
        message: "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file" 
      });
    }

    const { amount, listingId } = req.body;
    const numericAmount = Number(amount);
    const amountInPaise = Math.round(numericAmount * 100);

    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        listingId,
        guestId: req.userId,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: `Order creation failed: ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ 
        message: "Razorpay is not configured" 
      });
    }

    const {
      orderId,
      paymentId,
      signature,
      listingId,
      checkIn,
      checkOut,
      totalRent,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const finalOrderId = orderId || razorpay_order_id;
    const finalPaymentId = paymentId || razorpay_payment_id;
    const finalSignature = signature || razorpay_signature;

    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }
    if (!listingId || !checkIn || !checkOut || !totalRent) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    // Verify signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${finalOrderId}|${finalPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== finalSignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Create booking after successful payment
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.isBooked) {
      return res.status(400).json({ message: "Listing is already booked" });
    }

    const booking = await Booking.create({
      checkIn,
      checkOut,
      totalRent,
      host: listing.host,
      guest: req.userId,
      listing: listingId,
      paymentId: finalPaymentId,
      orderId: finalOrderId,
      paymentStatus: "completed",
    });

    listing.guest = req.userId;
    listing.isBooked = true;
    await listing.save();

    return res.status(201).json({
      message: "Payment successful and booking created",
      booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: `Verification error: ${error}` });
  }
};
