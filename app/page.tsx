import Link from "next/link";
import { Leaf, ArrowRight, BarChart3, MapPin, Recycle, Shield, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E7E7E7] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-[0_2px_8px_rgba(255,77,79,0.3)]">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#111827] tracking-tight">
                Eco<span className="text-[#FF4D4F]">Sort</span>
              </span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#374151] hover:text-[#111827] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF4D4F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#E53935] transition-all duration-200 shadow-[0_2px_8px_rgba(255,77,79,0.3)] hover:shadow-[0_4px_16px_rgba(255,77,79,0.4)]"
              >
                Mulai Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1F1] border border-red-200 px-4 py-1.5 text-sm font-semibold text-[#E53935]">
            <span className="h-2 w-2 rounded-full bg-[#FF4D4F] animate-pulse" />
            Platform Pengelolaan Sampah Jakarta
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111827] tracking-tight leading-tight">
            Kelola Sampah
            <br />
            Lebih{" "}
            <span className="relative text-[#FF4D4F]">
              Cerdas
              <svg
                className="absolute -bottom-2 left-0 right-0"
                viewBox="0 0 200 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 5 5 Q 100 0 195 5"
                  stroke="#FF4D4F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
            Platform modern untuk pelaporan dan monitoring sampah di wilayah Jakarta.
            Mudah digunakan, real-time, dan terhubung langsung ke petugas kebersihan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF4D4F] px-8 py-4 text-base font-semibold text-white hover:bg-[#E53935] transition-all duration-200 shadow-[0_4px_16px_rgba(255,77,79,0.3)] hover:shadow-[0_8px_32px_rgba(255,77,79,0.4)] hover:-translate-y-0.5"
            >
              Mulai Sekarang — Gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7E7E7] bg-white px-8 py-4 text-base font-semibold text-[#374151] hover:bg-[#F5F6F8] transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              Masuk ke Dashboard
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4 text-center">
            {[
              { value: "5+", label: "Wilayah Jakarta" },
              { value: "3", label: "Kategori Sampah" },
              { value: "100%", label: "Gratis & Terbuka" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold text-[#111827]">{stat.value}</p>
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E7E7E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold text-[#111827]">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Dirancang untuk kemudahan pelaporan dan pengawasan lingkungan yang efektif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                color: "bg-blue-50 text-blue-600",
                title: "Statistik Real-time",
                desc: "Pantau kondisi sampah di seluruh wilayah secara langsung melalui dashboard.",
              },
              {
                icon: MapPin,
                color: "bg-[#FFF1F1] text-[#FF4D4F]",
                title: "Cakupan 5 Wilayah",
                desc: "Meliputi Jakarta Pusat, Utara, Selatan, Timur, dan Barat.",
              },
              {
                icon: Recycle,
                color: "bg-emerald-50 text-emerald-600",
                title: "3 Kategori Sampah",
                desc: "Organik, non-organik, dan B3 dengan penanganan khusus.",
              },
              {
                icon: Shield,
                color: "bg-violet-50 text-violet-600",
                title: "Keamanan Data",
                desc: "Sistem autentikasi aman dengan pembagian peran Admin dan User.",
              },
              {
                icon: Zap,
                color: "bg-amber-50 text-amber-600",
                title: "Respons Cepat",
                desc: "Laporan langsung terlihat oleh admin untuk tindak lanjut segera.",
              },
              {
                icon: Users,
                color: "bg-pink-50 text-pink-600",
                title: "Partisipasi Warga",
                desc: "Mudah digunakan oleh semua lapisan masyarakat Jakarta.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl border border-[#E7E7E7] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-250 group"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.color} mb-4`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-2">{feat.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#FF4D4F] to-[#E53935] rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold">
                Siap Berkontribusi?
              </h2>
              <p className="text-white/80 text-lg max-w-md mx-auto">
                Bergabunglah dan mulai laporkan tumpukan sampah di sekitar Anda sekarang.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#E53935] hover:bg-white/90 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                >
                  Daftar Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
                >
                  Sudah punya akun? Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E7E7] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4D4F] to-[#E53935]">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#111827]">
              Eco<span className="text-[#FF4D4F]">Sort</span>
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF]">
            © 2025 EcoSort. Platform pengelolaan sampah terpadu untuk Jakarta.
          </p>
        </div>
      </footer>
    </div>
  );
}
