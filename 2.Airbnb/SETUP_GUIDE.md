# Airbnb Clone - Payment Gateway & Location Setup Guide

## Implementation Completed ✅

### Backend Changes:
1. **Created Payment Controller** (`backend/controllers/payment.controller.js`)
   - `createOrder`: Creates Razorpay payment order
   - `verifyPayment`: Verifies payment signature and creates booking

2. **Created Payment Routes** (`backend/routes/payment.route.js`)
   - POST `/api/payment/create-order` - Creates order
   - POST `/api/payment/verify-payment` - Verifies and creates booking

3. **Updated Booking Model** 
   - Added `paymentId`, `orderId`, `paymentStatus` fields

4. **Updated Listing Model**
   - Added `latitude`, `longitude` fields for location storage

5. **Updated Listing Controller**
   - Modified `addListing` to accept and save latitude/longitude

6. **Updated Backend Index.js**
   - Added payment route: `app.use("/api/payment", paymentRouter)`

### Frontend Changes:
1. **Created Payment Component** (`frontend/src/Component/PaymentCheckout.jsx`)
   - Handles Razorpay payment integration
   - Verifies payment and creates booking

2. **Created Location Map Component** (`frontend/src/Component/LocationMap.jsx`)
   - Displays interactive map using Leaflet
   - Shows property location with marker

3. **Updated HTML** (`frontend/index.html`)
   - Added Razorpay script
   - Added Leaflet (OpenStreetMap) for maps

---

## Setup Instructions

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install razorpay
```

#### Step 2: Update `.env` file
Add these credentials (get from Razorpay Dashboard):
```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
PORT=6000
```

#### Step 3: Get Razorpay Credentials
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up/Login
3. Navigate to Settings → API Keys
4. Copy Key ID and Secret
5. Paste in `.env` file

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Create/Update `.env.local` file
```env
VITE_RAZORPAY_KEY_ID=your_key_id_here
VITE_API_BASE_URL=http://localhost:6000
```

#### Step 3: Update Vite Config (if needed)
Make sure `vite.config.js` has:
```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
```

---

## Usage Examples

### 1. Using Payment Component
```jsx
import PaymentCheckout from './Component/PaymentCheckout'

function BookingPage() {
  const handlePaymentSuccess = (booking) => {
    console.log('Booking created:', booking)
    // Redirect to success page
  }

  return (
    <PaymentCheckout 
      listingId="listing_id_here"
      checkIn="2024-04-25"
      checkOut="2024-04-27"
      totalRent={5000}
      onSuccess={handlePaymentSuccess}
    />
  )
}
```

### 2. Using Location Map Component
```jsx
import LocationMap from './Component/LocationMap'

function ListingDetails() {
  return (
    <LocationMap 
      latitude={28.7041}
      longitude={77.1025}
      title="Beautiful Villa"
      landmark="Near Central Park"
      city="New Delhi"
    />
  )
}
```

### 3. Creating Listing with Location

**Frontend (MyListing.jsx):**
```jsx
const formData = {
  title: "Cozy Apartment",
  description: "...",
  rent: 5000,
  city: "Delhi",
  landMark: "Near Metro",
  category: "apartment",
  latitude: 28.7041,  // Add these
  longitude: 77.1025  // Add these
}
```

**To Get Coordinates:**
- Use [Google Maps](https://maps.google.com) - right-click → copy coordinates
- Or [Geocoding API](https://nominatim.openstreetmap.org/) for location-based lookup

---

## API Endpoints

### Payment Routes
```
POST /api/payment/create-order
Headers: Authorization: Bearer {token}
Body: {
  amount: number,
  listingId: string,
  checkIn: date,
  checkOut: date
}

POST /api/payment/verify-payment
Headers: Authorization: Bearer {token}
Body: {
  orderId: string,
  paymentId: string,
  signature: string,
  listingId: string,
  checkIn: date,
  checkOut: date,
  totalRent: number
}
```

---

## Testing Payment Integration

### 1. Razorpay Test Cards
Use these for testing:
- **Success**: `4111111111111111` (Visa)
- **Card Exp**: Any future date
- **CVV**: Any 3 digits

### 2. Test Payment Flow
1. Go to booking page
2. Click "Pay" button
3. Enter test card details
4. Click Pay
5. Check if booking is created in database

---

## Troubleshooting

### Payment Not Working
- ✅ Check Razorpay keys in `.env`
- ✅ Verify key is from TEST mode (not LIVE)
- ✅ Check CORS in backend allows frontend URL

### Map Not Showing
- ✅ Ensure latitude/longitude are numbers
- ✅ Coordinates must be within valid range (-90 to 90, -180 to 180)
- ✅ Check browser console for errors

### Authentication Error
- ✅ Verify token is being passed in headers
- ✅ Check if user is logged in

---

## Next Steps (Optional Enhancements)

1. **Add Geolocation Auto-Detection**
   ```javascript
   navigator.geolocation.getCurrentPosition((position) => {
     setLatitude(position.coords.latitude)
     setLongitude(position.coords.longitude)
   })
   ```

2. **Add Address to Coordinates Conversion**
   ```javascript
   // Use Nominatim API
   fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
   ```

3. **Show Multiple Properties on Map**
   - Update map component to accept array of listings

4. **Add Payment History**
   - Create page showing all past payments

5. **Add Refund System**
   - Implement cancellation with refund logic

---

## File Summary

**Backend Files Modified:**
- ✅ `controllers/payment.controller.js` - NEW
- ✅ `routes/payment.route.js` - NEW
- ✅ `model/booking.model.js` - UPDATED
- ✅ `model/listing.model.js` - UPDATED
- ✅ `controllers/listing.controller.js` - UPDATED
- ✅ `index.js` - UPDATED

**Frontend Files Modified:**
- ✅ `Component/PaymentCheckout.jsx` - NEW
- ✅ `Component/LocationMap.jsx` - NEW
- ✅ `index.html` - UPDATED

---

Need help with integration? Let me know! 🚀
