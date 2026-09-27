import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatsBreakdown } from "@/components/dashboard/stats-breakdown";

export const dynamic = "force-dynamic";

import {
  Users,
  FileText,
  Weight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [
    totalUsers,
    totalLaporan,
    beratStats,
    jenisCounts,
    wilayahCounts,
    laporanSelesai,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.laporanSampah.count(),
    prisma.laporanSampah.aggregate({
      _sum: { berat: true },
    }),
    prisma.laporanSampah.groupBy({
      by: ["jenisSampahId"],
      _count: { id: true },
      _sum: { berat: true },
    }),
    prisma.laporanSampah.groupBy({
      by: ["wilayahId"],
      _count: { id: true },
      _sum: { berat: true },
    }),
    prisma.laporanSampah.count({ where: { status: "SELESAI" } }),
  ]);

  const [jenisMap, wilayahMap] = await Promise.all([
    prisma.jenisSampah.findMany(),
    prisma.wilayah.findMany(),
  ]);

  const totalBerat = beratStats._sum.berat || 0;
  const completionRate = totalLaporan > 0 ? Math.round((laporanSelesai / totalLaporan) * 100) : 0;

  const jenisColors: Record<string, string> = {
    Organik: "bg-emerald-500",
    "Non-Organik": "bg-sky-500",
    B3: "bg-[#FF4D4F]",
  };

  const formattedJenis = jenisMap.map((j) => {
    const stat = jenisCounts.find((jc) => jc.jenisSampahId === j.id);
    return {
      name: j.namaJenis,
      count: stat?._count.id || 0,
      weight: stat?._sum.berat || 0,
      color: jenisColors[j.namaJenis] || "bg-gray-400",
    };
  });

  const wilayahPalette = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-amber-500",
  ];

  const formattedWilayah = wilayahMap.map((w, idx) => {
    const stat = wilayahCounts.find((wc) => wc.wilayahId === w.id);
    return {
      name: w.namaWilayah,
      count: stat?._count.id || 0,
      weight: stat?._sum.berat || 0,
      color: wilayahPalette[idx % wilayahPalette.length],
    };
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Dashboard Statistik
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Monitoring real-time volume dan kebersihan wilayah kota Jakarta
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl border border-[#E7E7E7] px-3 py-2 text-xs font-medium text-[#6B7280] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live · Realtime
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          title="Total Pengguna"
          value={totalUsers}
          icon={Users}
          description="Masyarakat terdaftar"
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Total Laporan"
          value={totalLaporan}
          icon={FileText}
          description="Laporan masuk"
          iconColor="text-violet-600"
          iconBgColor="bg-violet-50"
        />
        <StatCard
          title="Total Berat Sampah"
          value={`${totalBerat.toFixed(1)} kg`}
          icon={Weight}
          description="Beban total tercatat"
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
        <StatCard
          title="Tingkat Penyelesaian"
          value={`${completionRate}%`}
          icon={TrendingUp}
          description={`${laporanSelesai} laporan selesai`}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* Breakdown charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatsBreakdown
          title="Kategori Sampah"
          subtitle="Distribusi volume berdasarkan jenis sampah"
          items={formattedJenis}
        />
        <StatsBreakdown
          title="Sebaran Wilayah"
          subtitle="Distribusi laporan berdasarkan wilayah cakupan"
          items={formattedWilayah}
        />
      </div>
    </div>
  );
}
