"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useTransition, useState, useEffect, useRef } from "react";

interface OptionItem {
  id: string;
  nama: string;
}

interface FiltersProps {
  showSearch?: boolean;
  jenisList: OptionItem[];
  wilayahList: OptionItem[];
  totalPages: number;
  currentPage: number;
}

export function Filters({
  showSearch = false,
  jenisList,
  wilayahList,
  totalPages,
  currentPage,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const currentSearchParam = searchParams.get("search") || "";

  // Sync local input state with URL parameter (e.g. when resetting filters)
  useEffect(() => {
    if (searchValue !== currentSearchParam) {
      setSearchValue(currentSearchParam);
    }
  }, [currentSearchParam]);

  // Debounce search state to URL query
  useEffect(() => {
    if (searchValue === currentSearchParam) return;

    const handler = setTimeout(() => {
      updateQuery("search", searchValue || null);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchValue, currentSearchParam]);

  function updateQuery(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.delete("page");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleReset() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("jenis") ||
    searchParams.get("wilayah") ||
    searchParams.get("status");

  return (
    <div className="bg-white rounded-2xl border border-[#E7E7E7] shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Cari nama pelapor..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-11"
              disabled={isPending}
            />
          </div>
        )}

        {/* Filter Jenis */}
        <div className="w-full md:w-44">
          <Select
            value={searchParams.get("jenis") || "ALL"}
            onValueChange={(val) =>
              updateQuery("jenis", val === "ALL" ? null : val)
            }
            disabled={isPending}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#E7E7E7]">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E7E7E7]">
              <SelectItem value="ALL">Semua Jenis</SelectItem>
              {jenisList.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Wilayah */}
        <div className="w-full md:w-44">
          <Select
            value={searchParams.get("wilayah") || "ALL"}
            onValueChange={(val) =>
              updateQuery("wilayah", val === "ALL" ? null : val)
            }
            disabled={isPending}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#E7E7E7]">
              <SelectValue placeholder="Semua Wilayah" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E7E7E7]">
              <SelectItem value="ALL">Semua Wilayah</SelectItem>
              {wilayahList.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Status */}
        <div className="w-full md:w-44">
          <Select
            value={searchParams.get("status") || "ALL"}
            onValueChange={(val) =>
              updateQuery("status", val === "ALL" ? null : val)
            }
            disabled={isPending}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#E7E7E7]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E7E7E7]">
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DIPROSES">Diproses</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E7E7E7] bg-white px-4 h-12 text-sm font-medium text-[#6B7280] hover:bg-[#F5F6F8] hover:text-[#374151] transition-all duration-200 md:ml-auto cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E7E7]">
          <span className="text-xs font-medium text-[#9CA3AF]">
            Halaman{" "}
            <span className="text-[#374151] font-semibold">{currentPage}</span>{" "}
            dari{" "}
            <span className="text-[#374151] font-semibold">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuery("page", String(currentPage - 1))}
              disabled={currentPage <= 1 || isPending}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[#E7E7E7] bg-white text-[#374151] hover:bg-[#F5F6F8] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateQuery("page", String(currentPage + 1))}
              disabled={currentPage >= totalPages || isPending}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[#E7E7E7] bg-white text-[#374151] hover:bg-[#F5F6F8] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="absolute inset-0 bg-white/60 rounded-2xl" />
      )}
    </div>
  );
}
