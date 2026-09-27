import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllTransaksiAdmin } from "@/actions/transaksi";
import {
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTransaksiPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { transaksi, totalRewardKota, totalPencairanKota } =
    await getAllTransaksiAdmin();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
          Laporan Transaksi Bank Sampah
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Monitoring perputaran reward poin sampah dan penarikan saldo e-wallet seluruh warga DKI Jakarta.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Transaksi */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Total Transaksi
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#111827]">
              {transaksi.length}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Mutasi reward & penukaran
            </p>
          </div>
        </div>

        {/* Total Reward Diberikan */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Total Reward Disalurkan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-emerald-600">
              Rp {totalRewardKota.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Diberikan kepada warga yang melapor
            </p>
          </div>
        </div>

        {/* Total Saldo Dicairkan */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Total Saldo Dicairkan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-purple-600">
              Rp {totalPencairanKota.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Tercairkan ke E-Wallet warga
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Transaksi Seluruh Kota */}
      <div className="rounded-2xl border border-[#E7E7E7] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F5F6F8]">
          <h2 className="text-sm font-bold text-[#111827]">
            Daftar Seluruh Transaksi
          </h2>
        </div>

        {transaksi.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#9CA3AF]">
            Belum ada data transaksi tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAFB] text-xs font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E7E7E7]">
                <tr>
                  <th className="px-6 py-3.5">Warga / Pelapor</th>
                  <th className="px-6 py-3.5">Tipe</th>
                  <th className="px-6 py-3.5">Keterangan & Tujuan</th>
                  <th className="px-6 py-3.5">Nominal</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F6F8]">
                {transaksi.map((t) => {
                  const isReward = t.tipe === "REWARD";

                  return (
                    <tr key={t.id} className="hover:bg-[#FAFAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[#374151]">
                            {t.user.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#111827]">{t.user.nama}</p>
                            <p className="text-xs text-[#9CA3AF]">{t.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isReward
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {isReward ? (
                            <ArrowDownLeft className="h-3 w-3" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3" />
                          )}
                          {t.tipe}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#374151]">
                        <p className="font-medium text-xs sm:text-sm">{t.keterangan}</p>
                        {t.nomorTujuan && (
                          <p className="text-xs text-[#9CA3AF]">
                            No. Tujuan: {t.nomorTujuan}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${
                            isReward ? "text-emerald-600" : "text-[#111827]"
                          }`}
                        >
                          {isReward ? "+" : "-"}Rp {t.nominalRupiah.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#9CA3AF]">
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
