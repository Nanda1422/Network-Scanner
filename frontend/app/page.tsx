"use client"

import { useState, useEffect } from "react"
import { ScanForm } from "@/components/scan-form"
import { ScanStatus } from "@/components/scan-status"
import { DeviceGrid } from "@/components/device-grid"
import { ScanHistory } from "@/components/scan-history"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { NetworkIcon, HistoryIcon, AlertCircleIcon } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"
import { SetupInstructions } from "@/components/setup-instructions"

export default function Home() {
  const [currentScan, setCurrentScan] = useState({
    status: "idle",
    progress: 0,
    devices: [],
    results: [],
  })
  const [scanHistory, setScanHistory] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  const [isBackendConnected, setIsBackendConnected] = useState(true)

  // Fetch scan status when scanning is active
  useEffect(() => {
    let interval

    if (isScanning) {
      interval = setInterval(async () => {
        try {
          const response = await fetch("http://localhost:5000/api/scan/status")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()

          setCurrentScan(data)

          if (data.status === "completed" || data.status === "error") {
            setIsScanning(false)

            if (data.status === "completed") {
              toast({
                title: "Scan completed",
                description: `Found ${data.devices.length} devices and ${data.results.reduce(
                  (acc, device) => acc + device.open_ports.length,
                  0,
                )} open ports`,
              })
            } else {
              toast({
                title: "Scan failed",
                description: data.error || "An unknown error occurred",
                variant: "destructive",
              })
            }

            // Refresh scan history
            fetchScanHistory()
          }
        } catch (error) {
          console.error("Error fetching scan status:", error)
          setIsScanning(false)
          toast({
            title: "Connection error",
            description: "Lost connection to backend server. Please check if the Flask server is running on port 5000.",
            variant: "destructive",
          })
        }
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning, toast])

  const fetchScanHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/scan/history")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setScanHistory(data)
      setIsBackendConnected(true)
    } catch (error) {
      console.error("Error fetching scan history:", error)
      setScanHistory([])
      setIsBackendConnected(false)
    }
  }

  // Update the useEffect for initial load
  useEffect(() => {
    // Only fetch scan history, don't show error if it fails
    fetchScanHistory()
  }, [])

  const startScan = async (target, ports) => {
    try {
      setIsScanning(true)

      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target, ports }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      toast({
        title: "Scan started",
        description: `Scanning network ${target} on ports ${ports}`,
      })
    } catch (error) {
      setIsScanning(false)
      console.error("Error starting scan:", error)

      if (error.message.includes("fetch")) {
        toast({
          title: "Connection error",
          description: "Cannot connect to backend server. Please ensure the Flask server is running on port 5000.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Failed to start scan",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                  Network Scanner
                </h1>
                <p className="text-gray-400">Discover devices and open ports on your network</p>
              </div>
              <ConnectionStatus />
            </div>
          </header>

          {!isBackendConnected && (
            <div className="mb-8">
              <SetupInstructions />
            </div>
          )}

          <div className="grid gap-8">
            <div className="backdrop-blur-sm bg-black/30 border border-gray-800 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
              <ScanForm onStartScan={startScan} isScanning={isScanning} />
              {(isScanning || currentScan.status !== "idle") && <ScanStatus scan={currentScan} />}
            </div>

            {currentScan.devices.length > 0 && (
              <div className="backdrop-blur-sm bg-black/30 border border-gray-800 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <NetworkIcon className="h-5 w-5 text-cyan-400" />
                  Discovered Devices
                </h2>
                <DeviceGrid
                  devices={currentScan.devices}
                  results={currentScan.results}
                  isScanning={isScanning || currentScan.status === "port_scanning"}
                />
              </div>
            )}

            {scanHistory.length > 0 && (
              <div className="backdrop-blur-sm bg-black/30 border border-gray-800 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5 text-cyan-400" />
                  Scan History
                </h2>
                <ScanHistory history={scanHistory} />
              </div>
            )}

            <div className="backdrop-blur-sm bg-black/30 border border-gray-800 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5 text-cyan-400" />
                Important Notes
              </h2>
              <div className="text-gray-400 space-y-2">
                <p>
                  • Network scanning may be prohibited in certain environments. Always ensure you have permission to
                  scan the target network.
                </p>
                <p>
                  • This tool is intended for educational purposes and legitimate network administration tasks only.
                </p>
                <p>• For best results, run this application on the network you wish to scan.</p>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </ThemeProvider>
  )
}
