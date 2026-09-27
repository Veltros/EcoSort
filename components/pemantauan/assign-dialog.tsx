"use client";

import { useState } from "react";
import { assignUserToWilayah } from "@/actions/pemantauan";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  nama: string;
  email: string;
}

interface AssignUserDialogProps {
  wilayahId: string;
  namaWilayah: string;
  users: User[];
  assignedUserIds: string[];
}

export function AssignUserDialog({
  wilayahId,
  namaWilayah,
  users,
  assignedUserIds,
}: AssignUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const availableUsers = users.filter((u) => !assignedUserIds.includes(u.id));

  async function handleAssign() {
    if (!selectedUserId) {
      toast.error("Pilih user terlebih dahulu");
      return;
    }
    setIsLoading(true);
    try {
      const result = await assignUserToWilayah(selectedUserId, wilayahId);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setSelectedUserId("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={availableUsers.length === 0}
        className="gap-2 rounded-lg border-[#E7E7E7] text-xs h-8"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Tambah Pemantau
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E7E7E7] p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-bold text-[#111827] mb-1">
              Tambah Pemantau Wilayah
            </h3>
            <p className="text-sm text-[#6B7280] mb-5">
              Pilih user untuk memantau <span className="font-semibold text-[#FF4D4F]">{namaWilayah}</span>
            </p>

            <div className="relative mb-5">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E7E7E7] bg-[#FAFAFB] px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF4D4F]/20 focus:border-[#FF4D4F] transition-all"
              >
                <option value="">-- Pilih User --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                className="flex-1 rounded-xl bg-[#FF4D4F] hover:bg-[#E53935] text-white"
                onClick={handleAssign}
                disabled={isLoading || !selectedUserId}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Menyimpan...</>
                ) : (
                  "Tambahkan"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
