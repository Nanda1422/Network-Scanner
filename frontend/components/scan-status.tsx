"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Radar, Wifi, Server, CheckCircle, AlertCircle } from "lucide-react"

interface ScanStatusProps {
  scan: {
    status: string
    progress: number
    devices: any[]
    results: any[]
  }
}

export function ScanStatus({ scan }: ScanStatusProps) {
  const getStatusText = () => {
    switch (scan.status) {
      case "discovering":
        return "Discovering devices on network"
      case "port_scanning":
        return "Scanning ports on discovered devices"
      case "completed":
        return "Scan completed successfully"
      case "error":
        return "Scan failed with an error"
      default:
        return "Preparing scan"
    }
  }

  const getStatusIcon = () => {
    switch (scan.status) {
      case "discovering":
        return <Radar className="h-5 w-5 text-cyan-400 animate-pulse" />
      case "port_scanning":
        return <Server className="h-5 w-5 text-green-400 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Wifi className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <Badge
          variant="outline"
          className={`
            ${scan.status === "completed" ? "border-green-500 text-green-400" : ""}
            ${scan.status === "error" ? "border-red-500 text-red-400" : ""}
            ${scan.status === "discovering" ? "border-cyan-500 text-cyan-400" : ""}
            ${scan.status === "port_scanning" ? "border-green-500 text-green-400" : ""}
          `}
        >
          {scan.devices.length} Devices Found
        </Badge>
      </div>

      <Progress
        value={scan.progress}
        className="h-2 bg-gray-800"
        indicatorClassName={`
          ${scan.status === "completed" ? "bg-green-500" : ""}
          ${scan.status === "error" ? "bg-red-500" : ""}
          ${scan.status === "discovering" ? "bg-cyan-500" : ""}
          ${scan.status === "port_scanning" ? "bg-gradient-to-r from-cyan-500 to-green-500" : ""}
        `}
      />

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="bg-black/30 rounded-md p-2 border border-gray-800">
          <div className="text-gray-400">Phase</div>
          <div className="font-medium capitalize">{scan.status}</div>
        </div>
        <div className="bg-black/30 rounded-md p-2 border border-gray-800">
          <div className="text-gray-400">Progress</div>
          <div className="font-medium">{scan.progress}%</div>
        </div>
        <div className="bg-black/30 rounded-md p-2 border border-gray-800">
          <div className="text-gray-400">Open Ports</div>
          <div className="font-medium">
            {scan.results.reduce((acc, device) => acc + (device.open_ports?.length || 0), 0)}
          </div>
        </div>
      </div>
    </div>
  )
}
