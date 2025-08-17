"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Plus, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Trip {
  id: string
  destination_id?: string
  destination?: string
  country?: string
  start_date: string
  end_date: string
  budget: number
  status: "planned" | "ongoing" | "completed" | "cancelled"
  user_id?: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }
    getUser()
  }, [])

  // Fetch trips whenever user changes
  useEffect(() => {
    if (user) fetchTrips()
  }, [user])

  const fetchTrips = async () => {
    if (!user) return
    setIsLoading(true)
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: true })

    if (error) {
      toast({ title: "Error fetching trips", description: error.message, variant: "destructive" })
    } else {
      setTrips(data)
    }
    setIsLoading(false)
  }

  const addTrip = async () => {
    if (!user) return

    const newTrip = {
      destination: "New Destination",
      country: "Country",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      budget: 0,
      status: "planned" as const,
      user_id: user.id,
    }

    const { data, error } = await supabase
      .from("trips")
      .insert([newTrip])
      .select()

    if (error) {
      toast({ title: "Error adding trip", description: error.message, variant: "destructive" })
    } else {
      setTrips((prev) => [...prev, data[0]])
      toast({ title: "Trip Added", description: `Your trip was added successfully!` })
    }
  }

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id)
    if (error) toast({ title: "Error deleting trip", description: error.message, variant: "destructive" })
    else setTrips(trips.filter((t) => t.id !== id))
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      (trip.destination || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.country || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800"
      case "ongoing": return "bg-green-100 text-green-800"
      case "completed": return "bg-gray-100 text-gray-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Trip["status"]) => {
    switch (status) {
      case "planned": return "📋"
      case "ongoing": return "✅"
      case "completed": return "🎉"
      case "cancelled": return "❌"
      default: return "📋"
    }
  }

  if (isLoading) return <p className="text-center py-12">Loading trips...</p>

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={addTrip}>
          <Plus className="h-4 w-4 mr-2" /> Plan New Trip
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search trips by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{trip.destination}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {trip.country}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  <span className="mr-1">{getStatusIcon(trip.status)}</span>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Eye className="h-3 w-3 mr-1" /> View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 bg-transparent flex-1"
                  onClick={() => deleteTrip(trip.id)}
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧳</div>
          <h3 className="text-lg font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Start planning your first adventure!"}
          </p>
        </div>
      )}
    </div>
  )
}
