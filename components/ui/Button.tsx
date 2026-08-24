import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[var(--color-primary)] text-white hover:opacity-90 shadow-sm",
      secondary: "bg-[var(--color-base)] text-[var(--color-text-primary)] hover:bg-slate-200 shadow-sm",
      outline: "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-base)] shadow-sm",
      ghost: "hover:bg-[var(--color-base)] text-[var(--color-text-primary)]",
      destructive: "bg-[var(--color-danger)] text-white hover:opacity-90 shadow-sm"
    }
    
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-10 px-8",
      icon: "h-9 w-9"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
