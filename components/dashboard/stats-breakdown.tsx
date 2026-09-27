"use client";

interface BreakdownItem {
  name: string;
  count: number;
  weight: number;
  color: string;
}

interface StatsBreakdownProps {
  title: string;
  subtitle: string;
  items: BreakdownItem[];
}

export function StatsBreakdown({ title, subtitle, items }: StatsBreakdownProps) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0) || 1;

  return (
    <div className="bg-white rounded-2xl border border-[#E7E7E7] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04),_0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>
      </div>

      {/* Stacked bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F5F6F8] flex mb-5">
        {items.map((item, idx) => {
          const percentage = (item.weight / totalWeight) * 100;
          if (percentage === 0) return null;
          return (
            <div
              key={idx}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
              title={`${item.name}: ${percentage.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const percentage = (item.weight / totalWeight) * 100;
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`h-3 w-3 rounded-full shrink-0 ${item.color}`} />
                <span className="text-sm font-medium text-[#374151]">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#111827]">
                    {item.weight.toFixed(1)} kg
                  </span>
                  <span className="text-xs text-[#9CA3AF] ml-1.5">
                    {item.count} laporan
                  </span>
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs font-semibold text-[#6B7280] bg-[#F5F6F8] rounded-full px-2 py-0.5">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {items.every(i => i.weight === 0) && (
          <div className="text-center py-6">
            <p className="text-sm text-[#9CA3AF]">Belum ada data laporan</p>
          </div>
        )}
      </div>
    </div>
  );
}
