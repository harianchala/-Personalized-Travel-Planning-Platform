// Mock Supabase client for demo purposes
export const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: async () => ({ data: [], error: null }),
      }),
      order: async () => ({ data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
}

// Database types
export interface Profile {
  id: string
  role: "user" | "admin"
  name?: string
  email?: string
  preferences?: Record<string, any>
  interests?: string[]
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  name: string
  country: string
  description?: string
  image_url?: string
  rating?: number
  price_range?: string
  best_time?: string
  highlights?: string[]
  category?: string
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  user_id: string
  destination_id?: string
  start_date?: string
  end_date?: string
  budget?: number
  status?: "planned" | "ongoing" | "completed" | "cancelled"
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
  destination?: Destination
}

export interface Booking {
  id: string
  trip_id: string
  booking_type: "hotel" | "flight" | "activity"
  details: Record<string, any>
  status: "confirmed" | "pending" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  description?: string
  image_url?: string
  rating?: number
  price?: number
  original_price?: number
  category?: string
  amenities?: string[]
  features?: string[]
  availability?: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  content: string
  read: boolean
  created_at: string
}

// Mock destinations data
const mockDestinations: Destination[] = [
  {
    id: "dest_1",
    name: "Meghalaya",
    country: "India",
    description: "A lush, hilly state known for its living root bridges, waterfalls, and rolling green landscapes.",
    image_url: "/placeholder.svg?height=300&width=400&text=Meghalaya",
    rating: 4.8,
    price_range: "$$$",
    best_time: "April-June, September-October",
    highlights: ["Living Root Bridges", "Cherrapunji", "Shillong", "Nohkalikai Falls"],
    category: "Nature",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest_2",
    name: "Tokyo",
    country: "Japan",
    description: "A bustling metropolis blending traditional culture with cutting-edge technology.",
    image_url: "/placeholder.svg?height=300&width=400&text=Tokyo",
    rating: 4.7,
    price_range: "$$$$",
    best_time: "March-May, September-November",
    highlights: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji Temple", "Tsukiji Fish Market"],
    category: "Urban",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest_3",
    name: "Ladakh",
    country: "India",
    description:
      "A high-altitude desert famous for its monasteries, mountain passes, and stunning Himalayan landscapes.",
    image_url: "/placeholder.svg?height=300&width=400&text=Ladakh",
    rating: 4.6,
    price_range: "$$",
    best_time: "May-September",
    highlights: ["Pangong Lake", "Leh Palace", "Magnetic Hill", "Nubra Valley"],
    category: "Adventure",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest_4",
    name: "Mizoram",
    country: "India",
    description: "A picturesque state with rolling hills, vibrant tribal culture, and beautiful lakes.",
    image_url: "/placeholder.svg?height=300&width=400&text=Mizoram",
    rating: 4.5,
    price_range: "$$",
    best_time: "October-March",
    highlights: ["Aizawl", "Vantawng Falls", "Reiek Tlang", "Palak Dil"],
    category: "Nature",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest_5",
    name: "Santorini",
    country: "Greece",
    description: "Stunning Greek island famous for its white-washed buildings, blue-domed churches, and sunsets.",
    image_url: "/placeholder.svg?height=300&width=400&text=Santorini",
    rating: 4.9,
    price_range: "$$$",
    best_time: "April-October",
    highlights: ["Oia Village", "Red Beach", "Akrotiri", "Fira Town"],
    category: "Beach",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest_6",
    name: "Dubai",
    country: "UAE",
    description: "Modern city known for luxury shopping, ultramodern architecture, and vibrant nightlife.",
    image_url: "/placeholder.svg?height=300&width=400&text=Dubai",
    rating: 4.4,
    price_range: "$$$$",
    best_time: "November-March",
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
    category: "Luxury",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock hotels data
const mockHotels: Hotel[] = [
  {
    id: "hotel_1",
    name: "Ri Kynjai – Serenity by the Lake",
    location: "Meghalaya, India",
    description: "Luxury lakeside resort offering stunning views and warm Khasi hospitality.",
    image_url: "/placeholder.svg?height=300&width=400&text=Ri+Kynjai",
    rating: 4.8,
    price: 220.0,
    original_price: 300.0,
    category: "Luxury",
    amenities: ["Spa", "Fine Dining", "Lake View", "Cultural Activities"],
    features: ["Umiam Lake View", "Traditional Architecture", "Nature Trails"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hotel_2",
    name: "Park Hyatt Tokyo",
    location: "Tokyo, Japan",
    description: "Sophisticated hotel in Shinjuku with panoramic city views.",
    image_url: "/placeholder.svg?height=300&width=400&text=Park+Hyatt+Tokyo",
    rating: 4.7,
    price: 650.0,
    original_price: 800.0,
    category: "Luxury",
    amenities: ["Spa", "Pool", "Business Center", "Fitness Center"],
    features: ["City Views", "Traditional Japanese Design", "Premium Location"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hotel_3",
    name: "The Grand Dragon Ladakh",
    location: "Ladakh, India",
    description: "Upscale hotel blending Ladakhi tradition with modern comfort, offering breathtaking mountain views.",
    image_url: "/placeholder.svg?height=300&width=400&text=Grand+Dragon+Ladakh",
    rating: 4.6,
    price: 180.0,
    original_price: 250.0,
    category: "Resort",
    amenities: ["Heating", "Restaurant", "Tour Desk", "Garden"],
    features: ["Mountain Views", "Traditional Decor", "Central Location"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hotel_4",
    name: "Hotel Regency",
    location: "Mizoram, India",
    description: "Comfortable hotel in Aizawl offering panoramic city views and modern amenities.",
    image_url: "/placeholder.svg?height=300&width=400&text=Hotel+Regency",
    rating: 4.5,
    price: 90.0,
    original_price: 130.0,
    category: "Boutique",
    amenities: ["Restaurant", "Free Wi-Fi", "Room Service", "Parking"],
    features: ["City Views", "Central Location", "Budget Friendly"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hotel_5",
    name: "Canaves Oia Hotel",
    location: "Santorini, Greece",
    description: "Boutique hotel with infinity pools and caldera views.",
    image_url: "/placeholder.svg?height=300&width=400&text=Canaves+Oia",
    rating: 4.9,
    price: 580.0,
    original_price: 720.0,
    category: "Boutique",
    amenities: ["Infinity Pool", "Spa", "Fine Dining", "Concierge"],
    features: ["Caldera View", "Sunset Views", "Traditional Architecture"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "hotel_6",
    name: "Burj Al Arab",
    location: "Dubai, UAE",
    description: "Iconic sail-shaped luxury hotel on its own island.",
    image_url: "/placeholder.svg?height=300&width=400&text=Burj+Al+Arab",
    rating: 4.8,
    price: 1200.0,
    original_price: 1500.0,
    category: "Luxury",
    amenities: ["Private Beach", "Helicopter Pad", "Butler Service", "Multiple Restaurants"],
    features: ["Iconic Architecture", "All-Suite Accommodation", "Ultra-Luxury"],
    availability: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Helper functions for mock data operations
export const getDestinations = async (): Promise<Destination[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDestinations
}

export const getHotels = async (): Promise<Hotel[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockHotels
}

export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: "trip_1",
      user_id: userId,
      destination_id: "dest_1",
      start_date: "2024-03-15",
      end_date: "2024-03-22",
      budget: 2000,
      status: "planned",
      preferences: { accommodation: "luxury", activities: ["nature", "culture"] },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      destination: mockDestinations[0],
    },
    {
      id: "trip_2",
      user_id: userId,
      destination_id: "dest_3",
      start_date: "2024-05-10",
      end_date: "2024-05-20",
      budget: 1500,
      status: "ongoing",
      preferences: { accommodation: "mid-range", activities: ["adventure", "photography"] },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      destination: mockDestinations[2],
    },
  ]
}

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    {
      id: "notif_1",
      user_id: userId,
      content: "Welcome to Traveloop! Start planning your first trip.",
      read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "notif_2",
      user_id: userId,
      content: "Your trip to Meghalaya is coming up in 2 weeks!",
      read: false,
      created_at: new Date().toISOString(),
    },
  ]
}

export const createTrip = async (trip: Omit<Trip, "id" | "created_at" | "updated_at">): Promise<Trip> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newTrip: Trip = {
    ...trip,
    id: `trip_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  return newTrip
}

export const updateTrip = async (id: string, updates: Partial<Trip>): Promise<Trip> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    id,
    user_id: "current_user",
    ...updates,
    updated_at: new Date().toISOString(),
  } as Trip
}

export const createNotification = async (
  notification: Omit<Notification, "id" | "created_at">,
): Promise<Notification> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    ...notification,
    id: `notif_${Date.now()}`,
    created_at: new Date().toISOString(),
  }
}

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  console.log(`Notification ${id} marked as read`)
}


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Anon Key is missing. Check your .env.local file.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

