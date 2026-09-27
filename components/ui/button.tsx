import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF4D4F] text-white shadow-[0_2px_8px_rgba(255,77,79,0.3)] hover:bg-[#E53935] hover:shadow-[0_4px_16px_rgba(255,77,79,0.4)]",
        outline:
          "border-[#E7E7E7] bg-white text-[#374151] hover:bg-[#F5F6F8] hover:border-[#d1d5db] shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        secondary:
          "bg-[#F5F6F8] text-[#374151] hover:bg-[#ECEEF1] border-[#E7E7E7]",
        ghost:
          "text-[#6B7280] hover:bg-[#F5F6F8] hover:text-[#111827]",
        destructive:
          "bg-red-50 text-[#E53935] hover:bg-red-100 border border-red-200",
        link: "text-[#FF4D4F] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        xs: "h-7 px-3 text-xs rounded-lg",
        sm: "h-8 px-4 text-sm rounded-xl",
        lg: "h-12 px-7 text-base rounded-xl",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-8 rounded-xl",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
