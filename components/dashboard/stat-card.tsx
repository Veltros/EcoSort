import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
  iconBgColor?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-[#FF4D4F]",
  iconBgColor = "bg-[#FFF1F1]",
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-[#E7E7E7] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04),_0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-default">
      <div className="flex items-start justify-between">
        {/* Value + title */}
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm font-medium text-[#6B7280]">{title}</p>
          <p className="text-3xl font-bold text-[#111827] tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-xs text-[#9CA3AF] mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-2",
              trendUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-[#E53935]"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-250 group-hover:scale-110",
            iconBgColor
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
