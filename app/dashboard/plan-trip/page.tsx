"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Users, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PlanTrip() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    travelers: 1,
    budget: [2000],
    interests: [] as string[],
    travelStyle: "",
    accommodation: "",
    transportation: "",
    specialRequests: "",
  })

  const interests = [
    "Adventure",
    "Culture",
    "Food",
    "History",
    "Nature",
    "Nightlife",
    "Photography",
    "Relaxation",
    "Shopping",
    "Sports",
    "Art",
    "Music",
  ]

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Itinerary Generated!",
      description: "Your personalized travel plan is ready.",
    })

    setIsGenerating(false)
    router.push("/dashboard/trips/new")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Plan Your Perfect Trip
        </h1>
        <p className="text-muted-foreground">Let AI create a personalized itinerary just for you</p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: i <= step ? 1 : 0.8 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  i <= step
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i}
              </motion.div>
              {i < 4 && (
                <div
                  className={cn(
                    "w-16 h-1 mx-2 transition-all",
                    i < step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Destination</span>
          <span>Dates & Budget</span>
          <span>Preferences</span>
          <span>Review</span>
        </div>
      </motion.div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            {step === 1 && (
              <>
                <MapPin className="w-5 h-5 mr-2" />
                Where do you want to go?
              </>
            )}
            {step === 2 && (
              <>
                <CalendarIcon className="w-5 h-5 mr-2" />
                When and how much?
              </>
            )}
            {step === 3 && (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                What do you love?
              </>
            )}
            {step === 4 && (
              <>
                <Users className="w-5 h-5 mr-2" />
                Review your trip
              </>
            )}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us your dream destination"}
            {step === 2 && "Set your travel dates and budget"}
            {step === 3 && "Share your interests and travel style"}
            {step === 4 && "Review and let AI plan your perfect trip"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Destination */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Tokyo, Japan or Europe"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  className="mt-2 h-12"
                />
              </div>

              <div>
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Select
                  value={formData.travelers.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, travelers: Number.parseInt(value) }))}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Step 2: Dates & Budget */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2 h-12",
                          !formData.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2 h-12",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Budget Range</Label>
                <div className="mt-6 space-y-4">
                  <div className="px-2">
                    <Slider
                      value={formData.budget}
                      onValueChange={(value) => {
                        console.log("Budget changed:", value)
                        setFormData((prev) => ({ ...prev, budget: value }))
                      }}
                      max={10000}
                      min={500}
                      step={250}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">$500</span>
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                      ${formData.budget[0].toLocaleString()}
                    </div>
                    <span className="text-muted-foreground">$10,000+</span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">Drag the slider to adjust your budget</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <Label>What interests you?</Label>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="travelStyle">Travel Style</Label>
                <Select
                  value={formData.travelStyle}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="backpacker">Backpacker</SelectItem>
                    <SelectItem value="family">Family-friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accommodation">Preferred Accommodation</Label>
                <Select
                  value={formData.accommodation}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, accommodation: value }))}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="airbnb">Airbnb/Vacation Rental</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="boutique">Boutique Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any dietary restrictions, accessibility needs, or special occasions?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Trip Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Destination:</strong> {formData.destination}
                    </div>
                    <div>
                      <strong>Travelers:</strong> {formData.travelers}
                    </div>
                    <div>
                      <strong>Dates:</strong>{" "}
                      {formData.startDate && formData.endDate
                        ? `${format(formData.startDate, "MMM d")} - ${format(formData.endDate, "MMM d, yyyy")}`
                        : "Not selected"}
                    </div>
                    <div>
                      <strong>Budget:</strong> ${formData.budget[0].toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Preferences</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Travel Style:</strong> {formData.travelStyle || "Not selected"}
                    </div>
                    <div>
                      <strong>Accommodation:</strong> {formData.accommodation || "Not selected"}
                    </div>
                    <div>
                      <strong>Interests:</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {formData.specialRequests && (
                <div>
                  <h3 className="font-semibold mb-2">Special Requests</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{formData.specialRequests}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Our AI will analyze your preferences and real-time data</li>
                  <li>• We'll create a personalized itinerary with recommendations</li>
                  <li>• You'll receive your plan within 2-3 minutes</li>
                  <li>• You can customize and adjust the itinerary as needed</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create My Trip
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
