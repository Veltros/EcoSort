"use client";

import { useState } from "react";
import { createJenisSampah, updateJenisSampah } from "@/actions/jenis-sampah";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JenisSampahFormProps {
  mode: "create" | "edit";
  data?: {
    id: string;
    namaJenis: string;
  };
}

export function JenisSampahForm({ mode, data }: JenisSampahFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result =
        mode === "create"
          ? await createJenisSampah(formData)
          : await updateJenisSampah(data!.id, formData);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          mode === "create"
            ? "inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
            : "inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
        }
      >
        {mode === "create" ? (
          <>
            <Plus className="h-4 w-4" />
            Tambah Jenis Sampah
          </>
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Tambah Jenis Sampah"
              : "Edit Jenis Sampah"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Masukkan nama jenis sampah baru"
              : "Ubah nama jenis sampah"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="namaJenis">Nama Jenis Sampah</Label>
            <Input
              id="namaJenis"
              name="namaJenis"
              type="text"
              placeholder="Masukkan nama jenis sampah"
              defaultValue={mode === "edit" ? data?.namaJenis : ""}
              disabled={isLoading}
            />
            {errors.namaJenis && (
              <p className="text-sm text-destructive">{errors.namaJenis[0]}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Batal
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : mode === "create" ? (
                "Tambah"
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
