import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";

export const dynamic = "force-dynamic";
import { StatsBreakdown } from "@/components/dashboard/stats-breakdown";
import { FileText, Weight, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "USER") {
    redirect("/login");
  }

  const userId = session.user.id;

  // Personal Stats
  const [totalLaporan, beratStats, personalJenisCounts] = await Promise.all([
    prisma.laporanSampah.count({
      where: { userId },
    }),
    prisma.laporanSampah.aggregate({
      where: { userId },
      _sum: { berat: true },
    }),
    prisma.laporanSampah.groupBy({
      by: ["jenisSampahId"],
      where: { userId },
      _count: { id: true },
      _sum: { berat: true },
    }),
  ]);

  const totalBerat = beratStats._sum.berat || 0;

  // Fetch recent 5 reports
  const recentLaporan = await prisma.laporanSampah.findMany({
    where: { userId },
    include: {
      jenisSampah: true,
      wilayah: true,
      fotoSampah: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Dynamic Lookup
  const jenisMap = await prisma.jenisSampah.findMany();
  const jenisColors: Record<string, string> = {
    Organik: "bg-green-500",
    "Non-Organik": "bg-cyan-500",
    B3: "bg-red-500",
  };

  const formattedPersonalJenis = jenisMap.map((j) => {
    const stat = personalJenisCounts.find((jc) => jc.jenisSampahId === j.id);
    return {
      name: j.namaJenis,
      count: stat?._count.id || 0,
      weight: stat?._sum.berat || 0,
      color: jenisColors[j.namaJenis] || "bg-gray-500",
    };
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Dashboard Saya
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Ringkasan riwayat kontribusi kebersihan Anda untuk Jakarta
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 stagger-children">
        <StatCard
          title="Total Laporan Saya"
          value={totalLaporan}
          icon={FileText}
          description="Laporan yang telah dikirimkan"
          iconColor="text-[#FF4D4F]"
          iconBgColor="bg-[#FFF1F1]"
        />
        <StatCard
          title="Total Berat Kontribusi"
          value={`${totalBerat.toFixed(1)} kg`}
          icon={Weight}
          description="Total berat sampah dilaporkan"
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Reports Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-[#111827]">Laporan Terbaru</h2>
          {recentLaporan.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-[#E7E7E7]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F6F8] mb-4">
                <FileText className="h-7 w-7 text-[#9CA3AF]" />
              </div>
              <h3 className="text-sm font-semibold text-[#111827]">Belum ada laporan</h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Kirim laporan pertamamu melalui menu Laporan Saya.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E7E7E7] bg-[#FAFAFB]">
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Foto</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Tanggal</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Jenis</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Wilayah</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F6F8]">
                    {recentLaporan.map((laporan) => (
                      <tr key={laporan.id} className="hover:bg-[#FAFAFB] transition-colors duration-150">
                        <td className="px-4 py-3">
                          {laporan.fotoSampah?.imageUrl ? (
                            <Dialog>
                              <DialogTrigger className="cursor-pointer group relative h-9 w-12 overflow-hidden rounded-lg border border-[#E7E7E7] block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={laporan.fotoSampah.imageUrl}
                                  alt="Bukti"
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </DialogTrigger>
                              <DialogContent className="max-w-xl p-2 rounded-2xl bg-white/95 border-[#E7E7E7]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={laporan.fotoSampah.imageUrl}
                                  alt="Detail"
                                  className="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-xl"
                                />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#F5F6F8] text-[#9CA3AF]">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#374151]">
                          {new Date(laporan.tanggalLapor).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#111827]">
                          {laporan.jenisSampah.namaJenis}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#374151]">
                          {laporan.wilayah.namaWilayah}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              laporan.status === "SELESAI"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : laporan.status === "DIPROSES"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-[#F5F6F8] text-[#6B7280] border border-[#E7E7E7]"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              laporan.status === "SELESAI" ? "bg-emerald-500" :
                              laporan.status === "DIPROSES" ? "bg-amber-500" : "bg-[#9CA3AF]"
                            }`} />
                            {laporan.status === "SELESAI" ? "Selesai" :
                             laporan.status === "DIPROSES" ? "Diproses" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Personal breakdown */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#111827]">Kontribusi Jenis Sampah</h2>
          <StatsBreakdown
            title="Breakdown Kontribusiku"
            subtitle="Distribusi berat sampah yang dilaporkan"
            items={formattedPersonalJenis}
          />
        </div>
      </div>
    </div>
  );
}

