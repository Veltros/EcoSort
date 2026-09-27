import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#FF4D4F] text-white",
        secondary: "bg-[#F5F6F8] text-[#374151] border border-[#E7E7E7]",
        destructive: "bg-red-50 text-[#E53935] border border-red-200",
        outline: "border border-[#E7E7E7] text-[#374151] bg-white",
        ghost: "text-[#6B7280] hover:bg-[#F5F6F8]",
        link: "text-[#FF4D4F] underline-offset-4 hover:underline",
        // Status badges
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        pending: "bg-slate-100 text-slate-600 border border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
