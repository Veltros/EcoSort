"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Layers,
  Map,
  FileText,
  Leaf,
  X,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Jenis Sampah",
    href: "/dashboard/admin/jenis-sampah",
    icon: Layers,
  },
  {
    label: "Wilayah",
    href: "/dashboard/admin/wilayah",
    icon: Map,
  },
  {
    label: "Laporan Sampah",
    href: "/dashboard/admin/laporan",
    icon: FileText,
  },
  {
    label: "Pemantauan Wilayah",
    href: "/dashboard/admin/pemantauan",
    icon: Users,
  },
];

const userNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    label: "Laporan Saya",
    href: "/dashboard/user/laporan",
    icon: FileText,
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-[#E7E7E7]",
          "shadow-[4px_0_24px_rgba(0,0,0,0.04)]",
          "transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#E7E7E7]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-[0_2px_8px_rgba(255,77,79,0.35)] transition-transform duration-200 group-hover:scale-105">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111827] tracking-tight">
              Eco<span className="text-[#FF4D4F]">Sort</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
          <p className="px-3 mb-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em]">
            {isAdmin ? "Menu Admin" : "Menu Utama"}
          </p>

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/admin" &&
                item.href !== "/dashboard/user" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-[#FFF1F1] text-[#FF4D4F] font-semibold"
                    : "text-[#6B7280] hover:bg-[#F5F6F8] hover:text-[#111827]"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#FF4D4F] shadow-[0_2px_6px_rgba(255,77,79,0.3)]"
                      : "bg-[#F5F6F8] group-hover:bg-[#ECEEF1]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-white" : "text-[#9CA3AF] group-hover:text-[#374151]"
                    )}
                  />
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-[#FF4D4F] opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t border-[#E7E7E7]">
          <div className="flex items-center gap-3 rounded-xl bg-[#FAFAFB] border border-[#E7E7E7] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-[0_2px_6px_rgba(255,77,79,0.25)]">
              <span className="text-xs font-bold text-white">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate">
                {isAdmin ? "Administrator" : "Pengguna"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
