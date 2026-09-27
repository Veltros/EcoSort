import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { UpdateStatusDialog } from "@/components/laporan/status-dialog";
import { DeleteLaporanDialog } from "@/components/laporan/delete-dialog";
import { Filters } from "@/components/laporan/filters";
import { FileText, Image as ImageIcon, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Prisma } from "@/app/generated/prisma";

const ITEMS_PER_PAGE = 5;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    jenis?: string;
    wilayah?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminLaporanPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Resolve async searchParams
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const jenis = resolvedParams.jenis || "";
  const wilayah = resolvedParams.wilayah || "";
  const status = resolvedParams.status || "";
  const currentPage = Number(resolvedParams.page) || 1;

  // Build prisma dynamic filters
  const where: Prisma.LaporanSampahWhereInput = {};

  if (search) {
    where.user = {
      nama: {
        contains: search,
        mode: "insensitive",
      },
    };
  }

  if (jenis) {
    where.jenisSampahId = jenis;
  }

  if (wilayah) {
    where.wilayahId = wilayah;
  }

  if (status) {
    where.status = status as Prisma.EnumStatusLaporanFilter;
  }

  // Pagination count and fetch query
  const [totalItems, laporanList, jenisList, wilayahList] = await Promise.all([
    prisma.laporanSampah.count({ where }),
    prisma.laporanSampah.findMany({
      where,
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.jenisSampah.findMany({ select: { id: true, namaJenis: true } }),
    prisma.wilayah.findMany({ select: { id: true, namaWilayah: true } }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const mappedJenis = jenisList.map((j) => ({ id: j.id, nama: j.namaJenis }));
  const mappedWilayah = wilayahList.map((w) => ({ id: w.id, nama: w.namaWilayah }));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Semua Laporan Sampah
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Pantau, saring, dan perbarui status laporan dari masyarakat.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E7E7E7] px-3 py-2 text-xs font-medium text-[#6B7280] shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-fit">
          <span className="font-semibold text-[#111827]">{totalItems}</span>
          laporan ditemukan
        </div>
      </div>

      {/* Filters */}
      <Filters
        showSearch
        jenisList={mappedJenis}
        wilayahList={mappedWilayah}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      {/* Table or Empty State */}
      {laporanList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-[#E7E7E7]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F6F8] mb-4">
            <FileText className="h-8 w-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-base font-semibold text-[#111827]">
            Tidak ada laporan ditemukan
          </h3>
          <p className="text-sm text-[#6B7280] mt-1 max-w-xs">
            Coba ubah filter pencarian atau reset untuk melihat semua laporan.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E7E7E7] bg-[#FAFAFB]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Pelapor
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Jenis / Wilayah
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Berat
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F6F8]">
                {laporanList.map((laporan) => (
                  <tr
                    key={laporan.id}
                    className="hover:bg-[#FAFAFB] transition-colors duration-150"
                  >
                    {/* Foto */}
                    <td className="px-6 py-4">
                      {laporan.fotoSampah?.imageUrl ? (
                        <Dialog>
                          <DialogTrigger className="cursor-pointer group relative h-12 w-16 overflow-hidden rounded-xl border border-[#E7E7E7] block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={laporan.fotoSampah.imageUrl}
                              alt="Bukti"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-2 rounded-2xl bg-white/95 border-[#E7E7E7]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={laporan.fotoSampah.imageUrl}
                              alt="Bukti detail"
                              className="w-full h-auto max-h-[80vh] object-contain mx-auto rounded-xl"
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-[#F5F6F8] text-[#9CA3AF]">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    {/* Pelapor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-xs font-bold text-[#FF4D4F]">
                          {laporan.user.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">
                            {laporan.user.nama}
                          </p>
                          <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {laporan.user.noHp}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Tanggal */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#374151]">
                        {new Date(laporan.tanggalLapor).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    {/* Jenis / Wilayah */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#111827]">
                        {laporan.jenisSampah.namaJenis}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {laporan.wilayah.namaWilayah}
                      </p>
                    </td>
                    {/* Berat */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#111827]">
                        {laporan.berat.toFixed(2)}
                        <span className="text-xs font-normal text-[#9CA3AF] ml-1">kg</span>
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
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
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <UpdateStatusDialog
                          id={laporan.id}
                          currentStatus={laporan.status}
                        />
                        <DeleteLaporanDialog id={laporan.id} />
                      </div>
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
