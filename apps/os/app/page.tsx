"use client"

import { useState } from "react"
import { Button } from "@syner/ui/components/button"
import { activateOS } from "@/lib/actions"

export default function Page() {
  const [isActivating, setIsActivating] = useState(false)
  const [activationResult, setActivationResult] = useState<string | null>(null)

  const handleActivate = async () => {
    setIsActivating(true)
    setActivationResult(null)
    
    try {
      const result = await activateOS()
      setActivationResult(result.message)
    } catch (error) {
      setActivationResult("Error activating Syner OS. Please try again.")
      console.error("Activation error:", error)
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Syner OS - a web OS with AI</h1>
        <Button 
          size="sm" 
          onClick={handleActivate}
          disabled={isActivating}
        >
          {isActivating ? "Activating..." : "Activate"}
        </Button>
        {activationResult && (
          <p className="text-sm text-green-600 mt-2">{activationResult}</p>
        )}
      </div>
    </div>
  )
}
