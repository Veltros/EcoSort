"use client";

import { useState } from "react";
import { deleteJenisSampah } from "@/actions/jenis-sampah";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteJenisSampahDialogProps {
  id: string;
  namaJenis: string;
}

export function DeleteJenisSampahDialog({
  id,
  namaJenis,
}: DeleteJenisSampahDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);

    try {
      const result = await deleteJenisSampah(id);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal menghapus jenis sampah");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center justify-center rounded-md p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Jenis Sampah</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus jenis sampah{" "}
            <strong>&quot;{namaJenis}&quot;</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <DialogClose
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
