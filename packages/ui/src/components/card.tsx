import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@syner/ui/lib/utils"

const cardVariants = cva(
  "relative overflow-hidden border text-card-foreground",
  {
    variants: {
      variant: {
        default: "flex flex-col gap-6 rounded-xl bg-card py-6 shadow-sm",
        bracket: "group cursor-pointer transition-colors hover:border-foreground/20 p-6 min-h-[214px] flex flex-col justify-between",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {/* Corner brackets for bracket variant */}
      {variant === "bracket" && (
        <>
          <span className="absolute h-3 w-3 border-foreground/10 group-hover:border-foreground/20 border-b border-r bottom-0 right-0 transition-colors duration-300" />
          <span className="absolute h-3 w-3 border-foreground/10 group-hover:border-foreground/20 border-b border-l bottom-0 left-0 transition-colors duration-300" />
          <span className="absolute h-3 w-3 border-foreground/10 group-hover:border-foreground/20 border-t border-r top-0 right-0 transition-colors duration-300" />
          <span className="absolute h-3 w-3 border-foreground/10 group-hover:border-foreground/20 border-t border-l top-0 left-0 transition-colors duration-300" />
        </>
      )}
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
