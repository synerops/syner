import { 
  Window, 
  WindowHeader, 
  WindowTitle,
  WindowProvider,
  WindowContent
} from "@syner/ui/components/window"
import { Button } from "@syner/ui/components/button"

export default function Home() {
  return (
    <WindowProvider>
      <Window size="sm">
        <WindowHeader>
          <WindowTitle>Syner OS</WindowTitle>
        </WindowHeader>
        <WindowContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Welcome to Syner OS - a web OS with AI</h1>
            <Button variant="outline" size="sm">Activate</Button>
          </div>
        </WindowContent>
      </Window>
    </WindowProvider>
  )
}
