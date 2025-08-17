"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface AuthUser {
  id: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.error("Get session error:", error)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }
    getSession()

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    setUser(data.user)
    return {}
  }

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    setUser(data.user)
    return {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
