import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingDetails } = await request.json()

    // Create a booking object
    const booking = {
      id: `booking_${Date.now()}`,
      tripId: bookingDetails.tripId,
      amount: bookingDetails.amount,
      currency: bookingDetails.currency,
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
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 })
  }
}
