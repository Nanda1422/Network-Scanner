"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Laptop, Server, ChevronDown, ChevronUp, Wifi, Globe, Shield, AlertTriangle } from "lucide-react"

interface DeviceGridProps {
  devices: any[]
  results: any[]
  isScanning: boolean
}

export function DeviceGrid({ devices, results, isScanning }: DeviceGridProps) {
  const [openDevices, setOpenDevices] = useState<string[]>([])

  const toggleDevice = (ip: string) => {
    setOpenDevices((prev) => (prev.includes(ip) ? prev.filter((d) => d !== ip) : [...prev, ip]))
  }

  const getPortResult = (ip: string) => {
    return results.find((result) => result.ip === ip)
  }

  const getServiceColor = (service: string) => {
    const serviceMap: Record<string, string> = {
      ssh: "bg-green-500/20 text-green-400 border-green-500/30",
      http: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      https: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      ftp: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      telnet: "bg-red-500/20 text-red-400 border-red-500/30",
      smb: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      rdp: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    }

    return serviceMap[service.toLowerCase()] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const getRiskLevel = (service: string) => {
    const riskMap: Record<string, { level: string; icon: JSX.Element }> = {
      telnet: { level: "High", icon: <AlertTriangle className="h-4 w-4 text-red-400" /> },
      ftp: { level: "Medium", icon: <Shield className="h-4 w-4 text-yellow-400" /> },
      smb: { level: "Medium", icon: <Shield className="h-4 w-4 text-yellow-400" /> },
      http: { level: "Low", icon: <Shield className="h-4 w-4 text-green-400" /> },
      https: { level: "Low", icon: <Shield className="h-4 w-4 text-green-400" /> },
      ssh: { level: "Low", icon: <Shield className="h-4 w-4 text-green-400" /> },
    }

    return riskMap[service.toLowerCase()] || { level: "Unknown", icon: <Shield className="h-4 w-4 text-gray-400" /> }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => {
        const portResult = getPortResult(device.ip)
        const isOpen = openDevices.includes(device.ip)
        const hasPortResults = portResult && portResult.open_ports && portResult.open_ports.length > 0

        return (
          <Collapsible
            key={device.ip}
            open={isOpen}
            onOpenChange={() => toggleDevice(device.ip)}
            className={`bg-black/40 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${
              isOpen ? "shadow-lg shadow-cyan-500/10" : ""
            }`}
          >
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {device.hostname ? (
                      <Globe className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <Laptop className="h-5 w-5 text-gray-400" />
                    )}
                    <CardTitle className="text-lg font-medium">{device.hostname || "Unknown Device"}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPortResults && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        {portResult.open_ports.length} Ports
                      </Badge>
                    )}
                    {isScanning && !hasPortResults && (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
                        Scanning
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="bg-black/30 rounded p-2 border border-gray-800">
                    <div className="text-gray-500">IP Address</div>
                    <div className="font-mono">{device.ip}</div>
                  </div>
                  <div className="bg-black/30 rounded p-2 border border-gray-800">
                    <div className="text-gray-500">MAC Address</div>
                    <div className="font-mono text-xs">{device.mac}</div>
                  </div>
                </div>

                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-800 bg-black/30 hover:bg-black/50 text-gray-400 hover:text-white"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show Details
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-3 space-y-3">
                  {hasPortResults ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Open Ports</h4>
                      <div className="grid gap-2">
                        {portResult.open_ports.map((port: any) => (
                          <div
                            key={port.port}
                            className="flex items-center justify-between bg-black/30 p-2 rounded border border-gray-800"
                          >
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-gray-400" />
                              <span className="font-mono">{port.port}</span>
                              <Badge className={`text-xs ${getServiceColor(port.service)}`}>{port.service}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              {getRiskLevel(port.service).icon}
                              <span>{getRiskLevel(port.service).level} Risk</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-gray-500">
                      {isScanning ? (
                        <div className="flex items-center justify-center gap-2">
                          <Wifi className="h-4 w-4 animate-pulse" />
                          <span>Scanning ports...</span>
                        </div>
                      ) : (
                        <span>No open ports found</span>
                      )}
                    </div>
                  )}
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  )
}
