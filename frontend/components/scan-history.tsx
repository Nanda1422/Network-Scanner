"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, Calendar, NetworkIcon, Server } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ScanHistoryProps {
  history: any[]
}

export function ScanHistory({ history }: ScanHistoryProps) {
  const [expandedScans, setExpandedScans] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleScan = (index: number) => {
    setExpandedScans((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "Unknown"
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const filteredHistory = history
    .filter((scan) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()

      return (
        (scan.target && scan.target.toLowerCase().includes(searchLower)) ||
        (scan.devices &&
          scan.devices.some(
            (device: any) =>
              device.ip.toLowerCase().includes(searchLower) ||
              (device.hostname && device.hostname.toLowerCase().includes(searchLower)),
          ))
      )
    })
    .reverse() // Show newest first

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Input
          placeholder="Search by IP, hostname, or target range..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/50 border-gray-800 focus:border-cyan-500 focus:ring-cyan-500/20 text-white"
        />
      </div>

      <div className="rounded-md border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-black/50">
            <TableRow className="hover:bg-black/30 border-gray-800">
              <TableHead className="text-gray-400">Date/Time</TableHead>
              <TableHead className="text-gray-400">Target</TableHead>
              <TableHead className="text-gray-400">Devices</TableHead>
              <TableHead className="text-gray-400">Open Ports</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  {searchTerm ? "No matching scan results found" : "No scan history available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((scan, index) => {
                const isExpanded = expandedScans.includes(index)
                const totalOpenPorts =
                  scan.results?.reduce((acc: number, device: any) => acc + (device.open_ports?.length || 0), 0) || 0

                return (
                  <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleScan(index)}>
                    <TableRow className={`hover:bg-black/30 border-gray-800 ${isExpanded ? "bg-black/20" : ""}`}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(scan.timestamp || new Date().toISOString())}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{scan.target || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                          {scan.devices?.length || 0} Devices
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          {totalOpenPorts} Ports
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            ${scan.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                            ${scan.status === "error" ? "bg-red-500/20 text-red-400 border-red-500/30" : ""}
                            ${scan.status !== "completed" && scan.status !== "error" ? "bg-gray-500/20 text-gray-400 border-gray-500/30" : ""}
                          `}
                        >
                          {scan.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>

                    <CollapsibleContent>
                      <TableRow className="hover:bg-black/30 border-0">
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-black/30 p-4 border-t border-gray-800">
                            <div className="grid gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                  <NetworkIcon className="h-4 w-4 text-cyan-400" />
                                  Discovered Devices
                                </h4>
                                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                  {scan.devices?.map((device: any, i: number) => (
                                    <div key={i} className="bg-black/30 p-2 rounded border border-gray-800 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">{device.hostname || "Unknown Device"}</span>
                                      </div>
                                      <div className="text-gray-400 font-mono text-xs mt-1">
                                        IP: {device.ip} • MAC: {device.mac}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {scan.results && scan.results.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Server className="h-4 w-4 text-green-400" />
                                    Open Ports
                                  </h4>
                                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                    {scan.results
                                      .filter((result: any) => result.open_ports && result.open_ports.length > 0)
                                      .map((result: any, i: number) => (
                                        <div key={i} className="bg-black/30 p-2 rounded border border-gray-800 text-sm">
                                          <div className="font-medium mb-1">{result.ip}</div>
                                          <div className="flex flex-wrap gap-1">
                                            {result.open_ports.map((port: any, j: number) => (
                                              <Badge key={j} variant="outline" className="text-xs">
                                                {port.port}/{port.service}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
