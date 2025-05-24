import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { toTitleCase } from "@/utils/funcs"

import { cn } from "@/utils/tw"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/80 text-primary-foreground",
        vegetarian:
          "bg-emerald-700 hover:bg-emerald-700/80 text-primary-foreground",
        vegan:
          "bg-lime-700 hover:bg-lime-700/80 text-primary-foreground",
        gluten_free:
          "bg-orange-700 hover:bg-orange-700/80 text-primary-foreground",
        kosher:
          "bg-sky-700 hover:bg-sky-700/80 text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function AllergenBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {toTitleCase((variant?.replace("_", "-"))!)}
    </div>
  )
}

export { AllergenBadge, badgeVariants }
