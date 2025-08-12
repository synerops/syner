"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@syner/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Context, ReactNode } from "react";

type WindowContextProps = {
  isActive: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>

  isMaximized: boolean
  setMaximized: React.Dispatch<React.SetStateAction<boolean>>

  isMinimized: boolean
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>
}

const WindowContext: Context<WindowContextProps> = React.createContext<WindowContextProps | null>(null)

function useWindow() {
  const context = React.useContext(WindowContext)
  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider')
  }
  return context
}

const windowVariants = cva(
  'relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-lg',
  {
    variants: {
      size: {
        default: "w-full max-w-3xl",
        sm: "w-sm max-w-md",
        lg: "w-full max-w-5xl",
        full: "w-full h-full",
      },
      variant: {
        default: "border-border",
        destructive: "border-destructive",
        ghost: "border-transparent shadow-none",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
)

interface WindowProviderProps extends React.ComponentProps<"div"> {
  defaultActive?: boolean
  defaultMaximized?: boolean
  defaultMinimized?: boolean
  active?: boolean
  onActiveChange?: (active: boolean) => void
}

function WindowProvider({
  defaultActive = true,
  defaultMaximized = false,
  defaultMinimized = false,
  active: activeProp,
  onActiveChange: setActiveProp,
  children,
  ...props
}: WindowProviderProps) {
  const [_active, _setActive] = React.useState(defaultActive)
  const [isMaximized, setMaximized] = React.useState(defaultMaximized)
  const [isMinimized, setMinimized] = React.useState(defaultMinimized)

  const active = activeProp ?? _active
  const setActive: React.Dispatch<React.SetStateAction<boolean>> = React.useCallback(
    (value) => {

      const newValue = typeof value === 'function' ? value(active) : value
      if (setActiveProp) {
        setActiveProp(newValue)
      } else {
        _setActive(newValue)
      }
    },
    [active, setActiveProp]
  )

  const contextValue = React.useMemo<WindowContextProps>(
    () => ({
      isActive: active,
      setActive,
      isMaximized,
      setMaximized,
      isMinimized,
      setMinimized,
    }),
    [active, setActive, isMaximized, isMinimized]
  )

  return (
    <WindowContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </WindowContext.Provider>
  )
}

interface WindowProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof windowVariants> {
  asChild?: boolean
  children: ReactNode
  title?: string
}

const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  ({ className, size, variant, children, title = "Window", asChild = false }, ref) => {
    const { isActive, isMaximized, isMinimized } = useWindow()
    const Comp = asChild ? Slot : "div"

    if (isMinimized) {
      return null
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          windowVariants({ size, variant }),
          "transition-all duration-200",
          isActive ? "shadow-lg" : "shadow-sm opacity-90",
          isMaximized ? "fixed inset-0 h-screen w-screen rounded-none" : "",
          className
        )}
      >
        {children}
      </Comp>
    )
  }
)
Window.displayName = "Window"

const WindowHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { setActive, setMaximized, setMinimized } = useWindow()

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center px-4 h-10 bg-secondary/50 border-b select-none ",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(true)}
            className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          />
          <button
            onClick={() => setMinimized(true)}
            className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
          />
          <button
            onClick={() => setMaximized((prev: boolean) => !prev)}
            className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          />
        </div>
        {children}
      </div>
    )
  }
)
WindowHeader.displayName = "WindowHeader"

const WindowTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex-1 text-center text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
WindowTitle.displayName = "WindowTitle"

const WindowContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto p-4", className)}
      {...props}
    />
  )
)
WindowContent.displayName = "WindowContent"

const WindowFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center border-t bg-muted/50 px-4 py-2",
        className
      )}
      {...props}
    />
  )
)
WindowFooter.displayName = "WindowFooter"

export {
  Window,
  WindowProvider,
  WindowHeader,
  WindowTitle,
  WindowContent,
  WindowFooter,
  useWindow,
}
