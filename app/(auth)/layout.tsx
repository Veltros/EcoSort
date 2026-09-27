import { Leaf, Recycle, MapPin, BarChart3 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#FAFAFB]">
      {/* Left side — Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FF4D4F] via-[#E53935] to-[#C62828]">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute bottom-0 -left-12 w-80 h-80 rounded-full bg-black/10" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-white/5" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EcoSort</span>
          </div>

          {/* Main copy */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Kelola Sampah<br />
                Lebih{" "}
                <span className="relative inline-block">
                  Cerdas
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/60 rounded-full" />
                </span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed max-w-sm">
                Platform pengelolaan sampah modern untuk pelaporan dan monitoring
                lingkungan di wilayah Jakarta.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 gap-3 max-w-sm">
              {[
                { icon: BarChart3, label: "Statistik real-time", desc: "Monitor kondisi sampah secara langsung" },
                { icon: MapPin, label: "5 Wilayah Jakarta", desc: "Cakupan seluruh area DKI Jakarta" },
                { icon: Recycle, label: "3 Kategori Sampah", desc: "Organik, non-organik, dan B3" },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <feat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{feat.label}</p>
                    <p className="text-xs text-white/60">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/40 text-xs">© 2025 EcoSort. Platform pengelolaan sampah terpadu.</p>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#E53935] shadow-[0_2px_8px_rgba(255,77,79,0.3)]">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111827]">
              Eco<span className="text-[#FF4D4F]">Sort</span>
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
