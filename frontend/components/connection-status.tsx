"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/scan/status", {
          method: "GET",
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        if (response.ok) {
          setStatus("connected")
        } else {
          setStatus("disconnected")
        }
      } catch (error) {
        setStatus("disconnected")
      }
    }

    // Check immediately
    checkConnection()

    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: "Backend Connected",
          className: "bg-green-500/20 text-green-400 border-green-500/30",
        }
      case "disconnected":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          text: "Backend Disconnected",
          className: "bg-red-500/20 text-red-400 border-red-500/30",
        }
      case "checking":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: "Checking Connection",
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge className={`flex items-center gap-2 ${config.className}`}>
      {config.icon}
      {config.text}
    </Badge>
  )
}
