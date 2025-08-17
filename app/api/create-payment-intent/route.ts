import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", tripId, bookingDetails } = await request.json()

    // Simulate payment intent creation (no Stripe)
    const paymentIntent = {
      id: `fake_pi_${Date.now()}`,
      amount,
      currency,
      tripId,
      bookingDetails,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      paymentIntent,
      message: "Payment intent simulated successfully (no Stripe used).",
    })
  } catch (error) {
    console.error("Error simulating payment intent:", error)
    return NextResponse.json({ error: "Failed to simulate payment intent" }, { status: 500 })
  }
}
