"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Users, Clock, CreditCard, Plane, Hotel, Camera, Edit, Share, Download } from "lucide-react"
import Link from "next/link"

export default function TripDetailsPage() {
  const params = useParams()
  const tripId = params.tripId as string

  // Mock trip data - in a real app, this would come from your database
  const tripData = {
    id: tripId,
    destination: "Tokyo, Japan",
    startDate: "2024-12-15",
    endDate: "2024-12-22",
    travelers: 2,
    status: "Planning",
    progress: 75,
    budget: 3500,
    spent: 2800,
    image: "/placeholder.svg?height=300&width=600",
    itinerary: [
      {
        day: 1,
        date: "2024-12-15",
        title: "Arrival & Shibuya Exploration",
        activities: [
          { time: "14:00", activity: "Arrive at Narita Airport", type: "transport" },
          { time: "16:00", activity: "Check-in at Hotel Shibuya", type: "accommodation" },
          { time: "18:00", activity: "Shibuya Crossing & Hachiko Statue", type: "sightseeing" },
          { time: "20:00", activity: "Dinner at Izakaya", type: "dining" },
        ],
      },
      {
        day: 2,
        date: "2024-12-16",
        title: "Traditional Tokyo",
        activities: [
          { time: "09:00", activity: "Visit Senso-ji Temple", type: "sightseeing" },
          { time: "11:00", activity: "Explore Asakusa District", type: "sightseeing" },
          { time: "13:00", activity: "Traditional Sushi Lunch", type: "dining" },
          { time: "15:00", activity: "Tokyo National Museum", type: "culture" },
        ],
      },
    ],
    bookings: [
      { type: "Flight", status: "Confirmed", amount: 1600, reference: "FL123456" },
      { type: "Hotel", status: "Confirmed", amount: 1050, reference: "HT789012" },
      { type: "Activities", status: "Pending", amount: 150, reference: "AC345678" },
    ],
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "transport":
        return Plane
      case "accommodation":
        return Hotel
      case "sightseeing":
      case "culture":
        return Camera
      default:
        return MapPin
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripData.destination}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{tripData.travelers} travelers</span>
            </div>
            <Badge variant={tripData.status === "Confirmed" ? "default" : "secondary"}>{tripData.status}</Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Trip
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Trip Image */}
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={tripData.image || "/placeholder.svg"}
          alt={tripData.destination}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Progress and Budget */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Planning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Trip Planning</span>
                <span>{tripData.progress}%</span>
              </div>
              <Progress value={tripData.progress} className="h-2" />
              <div className="text-sm text-gray-600">Almost ready! Complete your bookings to finalize the trip.</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-semibold">${tripData.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Spent</span>
                <span>${tripData.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Remaining</span>
                <span className="font-semibold">${(tripData.budget - tripData.spent).toLocaleString()}</span>
              </div>
              <Progress value={(tripData.spent / tripData.budget) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="space-y-6">
          {tripData.itinerary.map((day) => (
            <Card key={day.day}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Day {day.day} - {day.title}
                  </span>
                  <Badge variant="outline">{new Date(day.date).toLocaleDateString()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type)
                    return (
                      <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.activity}</h4>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                          </div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid gap-4">
            {tripData.bookings.map((booking, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.type}</h3>
                      <p className="text-sm text-gray-600">Reference: {booking.reference}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${booking.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
              <CardDescription>Finalize your trip by completing the remaining bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link href={`/dashboard/booking/${tripId}`}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Booking - ${(tripData.budget - tripData.spent).toLocaleString()}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Documents</CardTitle>
              <CardDescription>Important documents and information for your trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Flight Confirmation</h4>
                  <p className="text-sm text-gray-600 mt-1">Booking reference: FL123456</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Hotel Voucher</h4>
                  <p className="text-sm text-gray-600 mt-1">Booking reference: HT789012</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Travel Insurance</h4>
                  <p className="text-sm text-gray-600 mt-1">Policy number: INS456789</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
