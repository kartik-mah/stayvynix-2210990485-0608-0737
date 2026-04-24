import React, { useContext, useState } from "react";
import axios from "axios";
import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";

function PaymentCheckout({ listingId, checkIn, checkOut, totalRent, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create order
      const orderResponse = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { amount: totalRent, listingId, checkIn, checkOut },
        { withCredentials: true }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await axios.post(
              `${serverUrl}/api/payment/verify-payment`,
              {
                orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                listingId,
                checkIn,
                checkOut,
                totalRent,
              },
              { withCredentials: true }
            );

            if (verifyResponse.status === 201) {
              onSuccess(verifyResponse.data.booking);
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert(error?.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          email: userData?.email || "customer@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout script is not loaded.");
      }

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error?.response?.data?.message || "Error creating payment order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay ₹${totalRent}`}
    </button>
  );
}

export default PaymentCheckout;
