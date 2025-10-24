import * as React from "react"

import { cn } from "~/lib/utils"

const Card = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
)
Card.displayName = "Card"

const CardHeader = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
CardHeader.displayName = "CardHeader"

const CardTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
CardTitle.displayName = "CardTitle"

const CardDescription = ({ className, ...props }: React.ComponentPropsWithoutRef<"p">) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
CardDescription.displayName = "CardDescription"

const CardContent = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => <div className={cn("p-6 pt-0", className)} {...props} />
CardContent.displayName = "CardContent"

const CardFooter = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
CardFooter.displayName = "CardFooter"

export { Card, CardContent,CardDescription, CardFooter, CardHeader, CardTitle }
