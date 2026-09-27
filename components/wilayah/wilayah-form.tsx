"use client";

import { useState } from "react";
import { createWilayah, updateWilayah } from "@/actions/wilayah";
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

interface WilayahFormProps {
  mode: "create" | "edit";
  data?: {
    id: string;
    namaWilayah: string;
  };
}

export function WilayahForm({ mode, data }: WilayahFormProps) {
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
          ? await createWilayah(formData)
          : await updateWilayah(data!.id, formData);

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
            Tambah Wilayah
          </>
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Wilayah" : "Edit Wilayah"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Masukkan nama wilayah baru"
              : "Ubah nama wilayah"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="namaWilayah">Nama Wilayah</Label>
            <Input
              id="namaWilayah"
              name="namaWilayah"
              type="text"
              placeholder="Masukkan nama wilayah (cth: Jakarta Barat)"
              defaultValue={mode === "edit" ? data?.namaWilayah : ""}
              disabled={isLoading}
            />
            {errors.namaWilayah && (
              <p className="text-sm text-destructive">{errors.namaWilayah[0]}</p>
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
