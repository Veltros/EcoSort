"use client";

import { useState } from "react";
import { removeUserFromWilayah } from "@/actions/pemantauan";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RemoveUserButtonProps {
  userId: string;
  wilayahId: string;
  namaUser: string;
}

export function RemoveUserButton({ userId, wilayahId, namaUser }: RemoveUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    if (!confirm(`Hapus ${namaUser} dari wilayah ini?`)) return;
    setIsLoading(true);
    try {
      const result = await removeUserFromWilayah(userId, wilayahId);
      if (result.success) {
        toast.success(result.message);
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
    <button
      onClick={handleRemove}
      disabled={isLoading}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-[#E53935] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Hapus ${namaUser}`}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
