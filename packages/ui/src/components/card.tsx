import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@syner/ui/lib/utils"

const cardVariants = cva("text-card-foreground", {
  variants: {
    variant: {
      default:
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg bg-card py-(--card-spacing) text-sm shadow-sm ring-1 ring-foreground/5 [--card-spacing:--spacing(8)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(5)] *:[img:first-child]:rounded-lg *:[img:last-child]:rounded-lg",
      bracket:
        "group relative flex min-h-[214px] cursor-pointer flex-col justify-between overflow-hidden border p-6 transition-colors hover:border-foreground/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Card({
  className,
  variant,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {/* Corner brackets for bracket variant */}
      {variant === "bracket" && (
        <>
          <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-foreground/10 transition-colors duration-300 group-hover:border-foreground/20" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-foreground/10 transition-colors duration-300 group-hover:border-foreground/20" />
          <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-foreground/10 transition-colors duration-300 group-hover:border-foreground/20" />
          <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-foreground/10 transition-colors duration-300 group-hover:border-foreground/20" />
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
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-lg px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
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
      className={cn(
        "text-lg font-semibold",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
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
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
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
