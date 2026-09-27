"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAction(formData);

      if (result.success) {
        toast.success(result.message);
        const target = (result.data as { redirectUrl?: string })?.redirectUrl || "/dashboard/user";
        window.location.href = target;
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header text */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-[#6B7280] leading-relaxed">
          Masuk ke akun EcoSort Anda untuk mulai memantau dan melaporkan sampah.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#E7E7E7] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#374151]">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                className="pl-11"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-[#E53935]">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-[#374151]">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                className="pl-11"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-[#E53935]">{errors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#FF4D4F] hover:bg-[#E53935] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_2px_8px_rgba(255,77,79,0.3)] hover:shadow-[0_4px_16px_rgba(255,77,79,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#FF4D4F] hover:text-[#E53935] transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
