"use client";

import { useState } from "react";
import { createLaporanSampah } from "@/actions/laporan-sampah";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OptionItem {
  id: string;
  nama: string;
}

interface LaporanFormProps {
  jenisSampahList: OptionItem[];
  wilayahList: OptionItem[];
}

export function LaporanForm({ jenisSampahList, wilayahList }: LaporanFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createLaporanSampah(formData);

      if (result.success) {
        toast.success(result.message);
        setImagePreview(null);
        setOpen(false);
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setImagePreview(null);
          setErrors({});
        }
      }}
    >
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4D4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E53935] transition-all duration-200 shadow-[0_2px_8px_rgba(255,77,79,0.3)] hover:shadow-[0_4px_16px_rgba(255,77,79,0.4)] active:scale-[0.98] cursor-pointer">
        <Plus className="h-4 w-4" />
        Buat Laporan
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border-[#E7E7E7] shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#111827]">
            Buat Laporan Sampah
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            Laporkan tumpukan sampah untuk diproses oleh petugas kebersihan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Berat */}
          <div className="space-y-2">
            <Label htmlFor="berat" className="text-sm font-semibold text-[#374151]">
              Berat Sampah (kg)
            </Label>
            <Input
              id="berat"
              name="berat"
              type="number"
              step="0.01"
              placeholder="Contoh: 2.5"
              disabled={isLoading}
            />
            {errors.berat && (
              <p className="text-xs text-[#E53935]">{errors.berat[0]}</p>
            )}
          </div>

          {/* Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="tanggalLapor" className="text-sm font-semibold text-[#374151]">
              Tanggal Lapor
            </Label>
            <Input
              id="tanggalLapor"
              name="tanggalLapor"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              disabled={isLoading}
            />
            {errors.tanggalLapor && (
              <p className="text-xs text-[#E53935]">{errors.tanggalLapor[0]}</p>
            )}
          </div>

          {/* Jenis Sampah */}
          <div className="space-y-2">
            <Label htmlFor="jenisSampahId" className="text-sm font-semibold text-[#374151]">
              Jenis Sampah
            </Label>
            <Select name="jenisSampahId" disabled={isLoading}>
              <SelectTrigger className="h-12 rounded-xl border-[#E7E7E7]">
                <SelectValue placeholder="Pilih jenis sampah" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#E7E7E7]">
                {jenisSampahList.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jenisSampahId && (
              <p className="text-xs text-[#E53935]">{errors.jenisSampahId[0]}</p>
            )}
          </div>

          {/* Wilayah */}
          <div className="space-y-2">
            <Label htmlFor="wilayahId" className="text-sm font-semibold text-[#374151]">
              Wilayah Lokasi
            </Label>
            <Select name="wilayahId" disabled={isLoading}>
              <SelectTrigger className="h-12 rounded-xl border-[#E7E7E7]">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#E7E7E7]">
                {wilayahList.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wilayahId && (
              <p className="text-xs text-[#E53935]">{errors.wilayahId[0]}</p>
            )}
          </div>

          {/* Upload Foto */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#374151]">
              Foto Bukti Sampah
            </Label>
            <label
              htmlFor="foto"
              className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-[#E7E7E7] bg-[#FAFAFB] cursor-pointer hover:border-[#FF4D4F] hover:bg-[#FFF1F1] transition-all duration-200 group"
            >
              <Upload className="h-6 w-6 text-[#9CA3AF] mb-1.5 group-hover:text-[#FF4D4F] transition-colors" />
              <span className="text-xs text-[#9CA3AF] group-hover:text-[#FF4D4F] transition-colors">
                Klik untuk upload foto
              </span>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
            {errors.foto && (
              <p className="text-xs text-[#E53935]">{errors.foto[0]}</p>
            )}
            {imagePreview && (
              <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-xl border border-[#E7E7E7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose className="inline-flex items-center justify-center rounded-xl border border-[#E7E7E7] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F5F6F8] transition-all duration-200 cursor-pointer">
              Batal
            </DialogClose>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4D4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E53935] transition-all duration-200 shadow-[0_2px_8px_rgba(255,77,79,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Laporan"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
