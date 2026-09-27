import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPoinDanTransaksi } from "@/actions/transaksi";
import { TukarPoinDialog } from "@/components/transaksi/tukar-dialog";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Coins,
  History,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserTransaksiPage() {
  const session = await auth();

  if (!session || session.user.role !== "USER") {
    redirect("/login");
  }

  const { saldoPoin, totalReward, totalPenukaran, riwayat } =
    await getUserPoinDanTransaksi();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Dompet & Bank Sampah
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Kumpulkan poin dari laporan sampah Anda dan cairkan ke Saldo E-Wallet.
          </p>
        </div>
        <TukarPoinDialog saldoPoin={saldoPoin} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saldo Aktif */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-gradient-to-br from-white to-[#FFF9F9] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Saldo Poin Aktif
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F1] text-[#FF4D4F]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Rp {saldoPoin.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-[#FF4D4F]" />
              Setara {saldoPoin.toLocaleString("id-ID")} Poin
            </p>
          </div>
        </div>

        {/* Total Reward Masuk */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Total Reward Masuk
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827]">
              +Rp {totalReward.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              Dari laporan sampah yang terverifikasi
            </p>
          </div>
        </div>

        {/* Total Ditarik */}
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Total Saldo Ditarik
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827]">
              Rp {totalPenukaran.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Ditransfer ke E-Wallet pribadi
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Mutasi Transaksi */}
      <div className="rounded-2xl border border-[#E7E7E7] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F5F6F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#FF4D4F]" />
            <h2 className="text-sm font-bold text-[#111827]">
              Riwayat Mutasi Transaksi
            </h2>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            {riwayat.length} transaksi tercatat
          </span>
        </div>

        {riwayat.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#9CA3AF]">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            Belum ada transaksi poin. Laporkan sampah di sekitar Anda untuk mulai mendapatkan reward!
          </div>
        ) : (
          <div className="divide-y divide-[#F5F6F8]">
            {riwayat.map((t) => {
              const isReward = t.tipe === "REWARD";

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isReward
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-[#FF4D4F]"
                      }`}
                    >
                      {isReward ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        {t.keterangan}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {new Date(t.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {t.metode ? " - " + t.metode : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        isReward ? "text-emerald-600" : "text-[#111827]"
                      }`}
                    >
                      {isReward ? "+" : "-"}Rp {t.nominalRupiah.toLocaleString("id-ID")}
                    </p>
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}