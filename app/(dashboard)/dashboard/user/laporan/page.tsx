import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { LaporanForm } from "@/components/laporan/laporan-form";
import { Filters } from "@/components/laporan/filters";
import { FileText, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Prisma } from "@/app/generated/prisma";

const ITEMS_PER_PAGE = 5;

interface PageProps {
  searchParams: Promise<{
    jenis?: string;
    wilayah?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function UserLaporanPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "USER") {
    redirect("/login");
  }

  // Resolve searchParams
  const resolvedParams = await searchParams;
  const jenis = resolvedParams.jenis || "";
  const wilayah = resolvedParams.wilayah || "";
  const status = resolvedParams.status || "";
  const currentPage = Number(resolvedParams.page) || 1;

  // Build filter object (Specific to current user)
  const where: Prisma.LaporanSampahWhereInput = {
    userId: session.user.id,
  };

  if (jenis) {
    where.jenisSampahId = jenis;
  }

  if (wilayah) {
    where.wilayahId = wilayah;
  }

  if (status) {
    where.status = status as Prisma.EnumStatusLaporanFilter;
  }

  // Fetch dropdown data & items
  const [totalItems, jenisSampahList, wilayahList, laporanList] = await Promise.all([
    prisma.laporanSampah.count({ where }),
    prisma.jenisSampah.findMany({ select: { id: true, namaJenis: true } }),
    prisma.wilayah.findMany({ select: { id: true, namaWilayah: true } }),
    prisma.laporanSampah.findMany({
      where,
      include: {
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const mappedJenis = jenisSampahList.map((j) => ({ id: j.id, nama: j.namaJenis }));
  const mappedWilayah = wilayahList.map((w) => ({ id: w.id, nama: w.namaWilayah }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Laporan Saya</h1>
          <p className="text-muted-foreground mt-1">
            Pantau status laporan pembuangan sampah Anda
          </p>
        </div>
        <LaporanForm jenisSampahList={mappedJenis} wilayahList={mappedWilayah} />
      </div>

      {/* Filters Panel */}
      <Filters
        jenisList={mappedJenis}
        wilayahList={mappedWilayah}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      {/* List */}
      {laporanList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Laporan tidak ditemukan
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tidak ada laporan yang sesuai dengan filter pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Foto Bukti
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal Lapor
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jenis Sampah
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Wilayah
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Berat (kg)
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {laporanList.map((laporan) => (
                  <tr
                    key={laporan.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {laporan.fotoSampah?.imageUrl ? (
                        <Dialog>
                          <DialogTrigger className="cursor-pointer group relative h-12 w-16 overflow-hidden rounded-md border border-gray-100 block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={laporan.fotoSampah.imageUrl}
                              alt="Bukti sampah"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-1 bg-black/90">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={laporan.fotoSampah.imageUrl}
                              alt="Bukti sampah detail"
                              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(laporan.tanggalLapor).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {laporan.jenisSampah.namaJenis}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {laporan.wilayah.namaWilayah}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {laporan.berat.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          laporan.status === "SELESAI"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : laporan.status === "DIPROSES"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {laporan.status}
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
  );
}
