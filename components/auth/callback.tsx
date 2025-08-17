"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error retrieving session:", error)
        router.push("/auth/login")
      } else {
        // session is valid, redirect to dashboard
        router.push("/dashboard")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Verifying your email, please wait...</p>
    </div>
  )
}
