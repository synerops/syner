import { Button } from "@syner/ui/components/button"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Syner OS - a web OS with AI</h1>
        <Button size="sm">Activate</Button>
      </div>
    </div>
  )
}
