"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, MapPin, Calendar, Plane, Hotel, Camera, Utensils } from "lucide-react"

export default function TravelChat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, isLoading } = useChat({
    api: "/api/travel-chat",
  })

  const quickQuestions = [
    { text: "What's the best time to visit Japan?", icon: Calendar },
    { text: "Recommend budget hotels in Paris", icon: Hotel },
    { text: "Flight deals to Europe", icon: Plane },
    { text: "Local food to try in Thailand", icon: Utensils },
    { text: "Photography spots in Iceland", icon: Camera },
    { text: "Weekend getaway ideas", icon: MapPin },
  ]

  const handleQuickQuestion = (question: string) => {
    sendMessage({ text: question })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput("")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Assistant</h1>
        <p className="text-gray-600">Ask me anything about your travel plans!</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            AI Travel Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Welcome to your AI Travel Assistant!</h3>
                  <p className="text-gray-600 mb-6">
                    I can help you with travel planning, recommendations, and questions about destinations worldwide.
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question.text)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <question.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-xs">{question.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Badge variant="secondary" className="mb-2">
                        AI Assistant
                      </Badge>
                    )}
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )
                        default:
                          return null
                      }
                    })}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations, travel tips, or planning advice..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
