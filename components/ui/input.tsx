import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "h-12 w-full min-w-0 rounded-xl px-4 py-3 text-sm font-medium",
        // Colors
        "bg-white border border-[#E7E7E7] text-[#111827] placeholder:text-[#9CA3AF]",
        // Transition
        "transition-all duration-200 outline-none",
        // Focus
        "focus-visible:border-[#FF4D4F] focus-visible:ring-3 focus-visible:ring-[#FF4D4F]/15 focus-visible:shadow-[0_0_0_4px_rgba(255,77,79,0.08)]",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F5F6F8]",
        // File input
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
