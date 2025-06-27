"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Scan, NetworkIcon } from "lucide-react"

interface ScanFormProps {
  onStartScan: (target: string, ports: string) => void
  isScanning: boolean
}

export function ScanForm({ onStartScan, isScanning }: ScanFormProps) {
  const [target, setTarget] = useState("192.168.1.0/24")
  const [ports, setPorts] = useState("21,22,23,80,443,445,3389")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStartScan(target, ports)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="target" className="text-gray-300">
            Target IP Range
          </Label>
          <div className="relative">
            <NetworkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="target"
              placeholder="192.168.1.0/24"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="pl-10 bg-black/50 border-gray-800 focus:border-cyan-500 focus:ring-cyan-500/20 text-white"
              required
              disabled={isScanning}
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter an IP address, range (192.168.1.1-10), or CIDR notation (192.168.1.0/24)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ports" className="text-gray-300">
            Ports to Scan
          </Label>
          <Input
            id="ports"
            placeholder="21,22,23,80,443,445,3389"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            className="bg-black/50 border-gray-800 focus:border-cyan-500 focus:ring-cyan-500/20 text-white"
            disabled={isScanning}
          />
          <p className="text-xs text-gray-500">Comma-separated list of ports (e.g., 22,80,443)</p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isScanning}
        className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 border-0"
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="mr-2 h-4 w-4" />
            Start Scan
          </>
        )}
      </Button>
    </form>
  )
}
