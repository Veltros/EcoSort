"use client";

import { useState } from "react";
import { updateLaporanStatus } from "@/actions/laporan-sampah";
import { Button } from "@/components/ui/button";
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
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StatusDialogProps {
  id: string;
  currentStatus: "PENDING" | "DIPROSES" | "SELESAI";
}

export function UpdateStatusDialog({ id, currentStatus }: StatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState<"PENDING" | "DIPROSES" | "SELESAI">(currentStatus);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("status", status); // Ensure the latest state is captured

    try {
      const result = await updateLaporanStatus(id, formData);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
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
        if (val) {
          setStatus(currentStatus); // Sync with latest status on open
        }
      }}
    >
      <DialogTrigger
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status Laporan</DialogTitle>
          <DialogDescription>
            Ubah status pemrosesan untuk laporan sampah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status Laporan</Label>
            <input type="hidden" name="status" value={status} />
            <Select value={status} onValueChange={(val) => setStatus(val as any)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="DIPROSES">DIPROSES</SelectItem>
                <SelectItem value="SELESAI">SELESAI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
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
                  Memperbarui...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
