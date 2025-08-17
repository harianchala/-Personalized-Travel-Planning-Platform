import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, bookingDetails } = await request.json()

    // Retrieve the payment intent to verify it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      // Here you would typically save the booking to your database
      const booking = {
        id: `booking_${Date.now()}`,
        paymentIntentId,
        tripId: bookingDetails.tripId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "confirmed",
        bookingDetails,
        createdAt: new Date().toISOString(),
      }

      // In a real app, you'd save this to your database
      console.log("Booking confirmed:", booking)

      return NextResponse.json({
        success: true,
        booking,
        message: "Booking confirmed successfully!",
      })
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 })
  }
}
