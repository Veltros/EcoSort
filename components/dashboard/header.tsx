"use client";

import { useSession } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Bell, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  async function handleLogout() {
    try {
      await logoutAction();
      toast.success("Berhasil logout");
      window.location.href = "/login";
    } catch {
      toast.error("Gagal logout");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E7E7E7] bg-white/90 backdrop-blur-md px-4 sm:px-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[#111827]">
            Selamat Datang,{" "}
            <span className="text-[#FF4D4F]">
              {session?.user?.name?.split(" ")[0] || "User"}
            </span>{" "}
            👋
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {session?.user?.role === "ADMIN" ? "Administrator" : "Pengguna"} · EcoSort
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell (decorative for now) */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-4 w-4 text-[#6B7280]" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FF4D4F]" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[#F5F6F8] transition-colors duration-200 cursor-pointer outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-[0_2px_6px_rgba(255,77,79,0.25)]">
              <span className="text-xs font-bold text-white">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[#111827] leading-none mb-0.5">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-[#9CA3AF] leading-none">
                {session?.user?.role === "ADMIN" ? "Admin" : "User"}
              </p>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-[#9CA3AF]" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl border-[#E7E7E7] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5">
            <DropdownMenuLabel className="px-2 py-2">
              <p className="text-sm font-semibold text-[#111827]">
                {session?.user?.name}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{session?.user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E7E7E7] my-1" />
            <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer text-sm text-[#374151] hover:bg-[#F5F6F8]">
              <User className="mr-2 h-4 w-4 text-[#9CA3AF]" />
              <span>Profil Saya</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E7E7E7] my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-2 py-2 cursor-pointer text-sm text-[#E53935] hover:bg-red-50 focus:text-[#E53935] focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
