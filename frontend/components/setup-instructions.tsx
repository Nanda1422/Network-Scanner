"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal, Server, Play, AlertCircle } from "lucide-react"

export function SetupInstructions() {
  return (
    <Card className="bg-black/30 border border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          Backend Server Not Running
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">
          The Flask backend server needs to be running for the network scanner to work. Follow these steps:
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-black/30 rounded border border-gray-800">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mt-0.5">1</Badge>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Install Python Dependencies</span>
              </div>
              <code className="text-sm bg-black/50 px-2 py-1 rounded text-green-400">pip install Flask Flask-CORS</code>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-black/30 rounded border border-gray-800">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mt-0.5">2</Badge>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Create Backend Files</span>
              </div>
              <p className="text-sm text-gray-400">
                Save the provided <code className="bg-black/50 px-1 rounded">app.py</code> and{" "}
                <code className="bg-black/50 px-1 rounded">scanner.py</code> files
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-black/30 rounded border border-gray-800">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mt-0.5">3</Badge>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Play className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Start Flask Server</span>
              </div>
              <code className="text-sm bg-black/50 px-2 py-1 rounded text-green-400">python app.py</code>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> The Flask server should run on{" "}
            <code className="bg-black/50 px-1 rounded">http://localhost:5000</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
