"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthUser {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user storage for demo purposes
const USERS_KEY = "traveloop_users"
const CURRENT_USER_KEY = "traveloop_current_user"

interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY)
        if (currentUser) {
          const userData = JSON.parse(currentUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const users = getStoredUsers()
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        return { error: "Invalid email or password" }
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }

      setUser(authUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser))

      return {}
    } catch (error) {
      console.error("Login error:", error)
      return { error: "An unexpected error occurred during login" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const users = getStoredUsers()

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return { error: "User with this email already exists" }
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      saveStoredUsers(users)

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }

      setUser(authUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser))

      return {}
    } catch (error) {
      console.error("Registration error:", error)
      return { error: "An unexpected error occurred during registration" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
