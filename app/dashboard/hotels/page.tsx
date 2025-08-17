"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hotel, Search, Star, MapPin, Wifi, Car, Coffee, Dumbbell, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface HotelData {
  id: number
  name: string
  location: string
  description: string
  image: string
  rating: number
  price: number
  originalPrice?: number
  category: string
  amenities: string[]
  features: string[]
  availability: boolean
}

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const categories = [
    { value: "all", label: "All Hotels" },
    { value: "luxury", label: "Luxury" },
    { value: "boutique", label: "Boutique" },
    { value: "business", label: "Business" },
    { value: "resort", label: "Resort" },
    { value: "budget", label: "Budget" },
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "budget", label: "Under $100" },
    { value: "mid", label: "$100 - $300" },
    { value: "luxury", label: "$300+" },
  ]

  const mockHotels: HotelData[] = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Paris, France",
      description: "Luxury hotel in the heart of Paris with stunning city views",
      image: "/grandpalace.svg?height=200&width=300&text=Grand+Palace",
      rating: 4.8,
      price: 450,
      originalPrice: 520,
      category: "luxury",
      amenities: ["WiFi", "Parking", "Restaurant", "Gym", "Spa"],
      features: ["City View", "24/7 Service", "Concierge"],
      availability: true,
    },
    {
      id: 2,
      name: "Sakura Boutique Inn",
      location: "Tokyo, Japan",
      description: "Traditional Japanese hospitality meets modern comfort",
      image: "/Sakura Boutique Inn.svg?height=200&width=300&text=Sakura+Inn",
      rating: 4.6,
      price: 280,
      category: "boutique",
      amenities: ["WiFi", "Restaurant", "Garden"],
      features: ["Traditional Design", "Tea Ceremony", "Zen Garden"],
      availability: true,
    },
    {
      id: 3,
      name: "Ocean Breeze Resort",
      location: "Bali, Indonesia",
      description: "Beachfront resort with infinity pool and spa services",
      image: "/Ocean Breeze Resort.svg?height=200&width=300&text=Ocean+Breeze",
      rating: 4.7,
      price: 180,
      originalPrice: 220,
      category: "resort",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access"],
      features: ["Ocean View", "Infinity Pool", "Private Beach"],
      availability: true,
    },
    {
      id: 4,
      name: "Business Central Hotel",
      location: "New York, USA",
      description: "Modern business hotel in Manhattan's financial district",
      image: "/Business Central Hotel.svg?height=200&width=300&text=Business+Central",
      rating: 4.4,
      price: 320,
      category: "business",
      amenities: ["WiFi", "Gym", "Business Center", "Restaurant"],
      features: ["Meeting Rooms", "Express Check-in", "City Center"],
      availability: true,
    },
    {
      id: 5,
      name: "Cozy Backpacker Lodge",
      location: "Bangkok, Thailand",
      description: "Budget-friendly accommodation with great location",
      image: "/Cozy Backpacker Lodge.svg?height=200&width=300&text=Backpacker+Lodge",
      rating: 4.2,
      price: 45,
      category: "budget",
      amenities: ["WiFi", "Common Area", "Kitchen"],
      features: ["Shared Kitchen", "Social Area", "City Center"],
      availability: true,
    },
    {
      id: 6,
      name: "Alpine Mountain Lodge",
      location: "Swiss Alps, Switzerland",
      description: "Cozy mountain retreat with breathtaking alpine views",
      image: "/Alpine Mountain Lodge.svg?height=200&width=300&text=Alpine+Lodge",
      rating: 4.9,
      price: 380,
      category: "luxury",
      amenities: ["WiFi", "Restaurant", "Spa", "Ski Storage"],
      features: ["Mountain View", "Fireplace", "Ski-in/Ski-out"],
      availability: false,
    },
  ]

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHotels(mockHotels)
      setLoading(false)
    }

    loadHotels()
  }, [])

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || hotel.category === selectedCategory

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "budget" && hotel.price < 100) ||
      (priceRange === "mid" && hotel.price >= 100 && hotel.price <= 300) ||
      (priceRange === "luxury" && hotel.price > 300)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return Wifi
      case "parking":
        return Car
      case "restaurant":
        return Coffee
      case "gym":
        return Dumbbell
      default:
        return Hotel
    }
  }

  const handleBookHotel = (hotel: HotelData) => {
    if (!hotel.availability) {
      toast({
        title: "Hotel Unavailable",
        description: "This hotel is currently not available for booking.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking Initiated",
      description: `Starting booking process for ${hotel.name}`,
    })

    // Here you would typically navigate to booking page or open booking modal
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Find Hotels
          </h1>
          <p className="text-muted-foreground">Loading amazing accommodations...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Find Hotels
        </h1>
        <p className="text-muted-foreground">Discover perfect accommodations for your stay</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[150px] h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-[150px] h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hotels Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel, index) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${!hotel.availability ? "opacity-75" : ""}`}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {hotel.originalPrice && (
                    <Badge variant="destructive" className="bg-red-500">
                      Save ${hotel.originalPrice - hotel.price}
                    </Badge>
                  )}
                  {!hotel.availability && (
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/50 text-white">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{hotel.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {hotel.location}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>{hotel.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">${hotel.price}</span>
                        {hotel.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${hotel.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">per night</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {hotel.category}
                    </Badge>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 4).map((amenity, idx) => {
                        const AmenityIcon = getAmenityIcon(amenity)
                        return (
                          <div key={idx} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded">
                            <AmenityIcon className="w-3 h-3" />
                            <span>{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {hotel.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleBookHotel(hotel)}
                      disabled={!hotel.availability}
                    >
                      {hotel.availability ? "Book Now" : "Unavailable"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </motion.div>
      )}
    </div>
  )
}
