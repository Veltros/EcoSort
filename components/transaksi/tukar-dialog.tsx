"use client";

import { useState } from "react";
import { tukarPoinAction } from "@/actions/transaksi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Loader2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TukarPoinDialogProps {
  saldoPoin: number;
}

const ewalletOptions = [
  { id: "DANA", name: "DANA", color: "border-sky-500 bg-sky-50/50 text-sky-700" },
  { id: "GOPAY", name: "GoPay", color: "border-emerald-500 bg-emerald-50/50 text-emerald-700" },
  { id: "OVO", name: "OVO", color: "border-purple-500 bg-purple-50/50 text-purple-700" },
  { id: "SHOPEEPAY", name: "ShopeePay", color: "border-orange-500 bg-orange-50/50 text-orange-700" },
];

const quickNominals = [10000, 20000, 50000];

export function TukarPoinDialog({ saldoPoin }: TukarPoinDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedMetode, setSelectedMetode] = useState("DANA");
  const [nominal, setNominal] = useState<string>("10000");
  const [nomorTujuan, setNomorTujuan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleTukar(e: React.FormEvent) {
    e.preventDefault();
    const jumlahPoin = parseFloat(nominal);

    if (isNaN(jumlahPoin) || jumlahPoin < 5000) {
      toast.error("Minimal penukaran Rp 5.000 (5.000 Poin)");
      return;
    }

    if (jumlahPoin > saldoPoin) {
      toast.error("Saldo poin tidak mencukupi!");
      return;
    }

    if (!nomorTujuan || nomorTujuan.length < 10) {
      toast.error("Nomor HP E-Wallet harus valid (minimal 10 digit)");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("jumlahPoin", jumlahPoin.toString());
    formData.append("metode", selectedMetode);
    formData.append("nomorTujuan", nomorTujuan);

    try {
      const res = await tukarPoinAction(formData);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
        setNomorTujuan("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat memproses penukaran");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 rounded-xl bg-gradient-to-r from-[#FF4D4F] to-[#E53935] px-5 py-2.5 font-semibold text-white shadow-[0_2px_8px_rgba(255,77,79,0.3)] hover:shadow-[0_4px_16px_rgba(255,77,79,0.4)]"
      >
        <Wallet className="h-4 w-4" />
        Tarik Saldo ke E-Wallet
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isLoading && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-[#E7E7E7] bg-white p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827]">
                Pencairan Saldo Bank Sampah
              </h3>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                1 Poin = Rp 1
              </span>
            </div>

            <div className="mb-5 rounded-xl bg-[#FAFAFB] border border-[#E7E7E7] p-3 text-sm">
              <span className="text-[#6B7280]">Saldo Tersedia:</span>
              <p className="text-xl font-bold text-[#111827]">
                Rp {saldoPoin.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-medium text-[#6B7280]">({saldoPoin.toLocaleString("id-ID")} Poin)</span>
              </p>
            </div>

            <form onSubmit={handleTukar} className="space-y-4">
              {/* Pilihan E-Wallet */}
              <div>
                <Label className="text-xs font-semibold text-[#374151] mb-2 block">
                  Pilih E-Wallet Tujuan
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ewalletOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setSelectedMetode(opt.id)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all ${
                        selectedMetode === opt.id
                          ? opt.color + " ring-2 ring-[#FF4D4F]"
                          : "border-[#E7E7E7] bg-white text-[#6B7280] hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.name}</span>
                      {selectedMetode === opt.id && (
                        <CheckCircle2 className="h-4 w-4 text-[#FF4D4F]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nomor HP E-Wallet */}
              <div>
                <Label htmlFor="nomorTujuan" className="text-xs font-semibold text-[#374151] mb-1.5 block">
                  Nomor HP Akun {selectedMetode}
                </Label>
                <Input
                  id="nomorTujuan"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={nomorTujuan}
                  onChange={(e) => setNomorTujuan(e.target.value)}
                  className="rounded-xl border-[#E7E7E7]"
                  required
                />
              </div>

              {/* Nominal Penukaran */}
              <div>
                <Label className="text-xs font-semibold text-[#374151] mb-1.5 block">
                  Nominal Penarikan (Rp)
                </Label>
                <div className="flex gap-2 mb-2">
                  {quickNominals.map((nom) => (
                    <button
                      type="button"
                      key={nom}
                      onClick={() => setNominal(nom.toString())}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                        nominal === nom.toString()
                          ? "border-[#FF4D4F] bg-[#FFF1F1] text-[#E53935]"
                          : "border-[#E7E7E7] bg-white text-[#6B7280] hover:bg-gray-50"
                      }`}
                    >
                      Rp {nom.toLocaleString("id-ID")}
                    </button>
                  ))}
                  {saldoPoin >= 5000 && (
                    <button
                      type="button"
                      onClick={() => setNominal(saldoPoin.toString())}
                      className="rounded-lg border border-[#E7E7E7] px-2 py-1.5 text-xs font-medium text-[#6B7280] hover:bg-gray-50"
                    >
                      Semua
                    </button>
                  )}
                </div>
                <Input
                  type="number"
                  min="5000"
                  step="1000"
                  placeholder="Minimal Rp 5.000"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="rounded-xl border-[#E7E7E7]"
                  required
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FF4D4F] hover:bg-[#E53935] text-white"
                  disabled={isLoading || saldoPoin < 5000}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-1.5 h-4 w-4" />
                      Konfirmasi Tarik
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
