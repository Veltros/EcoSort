# 🌿 EcoSort — Sistem Informasi Pengelolaan Sampah DKI Jakarta

> Platform digital modern berbasis web untuk pelaporan, pemantauan wilayah, dan transaksi Bank Sampah (Reward Poin & E-Wallet) terpadu di wilayah DKI Jakarta.

---

## 🚀 Fitur Utama

1. **Autentikasi Multi-Peran (Multi-Role Auth):**
   - **Warga (User):** Pelaporan sampah, upload foto bukti, dompet Bank Sampah (Reward Poin & Penarikan Saldo E-Wallet).
   - **Administrator (Admin):** Dashboard statistik kota, verifikasi dan approval laporan, manajemen master data (Wilayah & Jenis Sampah), penugasan pemantauan wilayah.

2. **Transaksi Bank Sampah & E-Wallet (Ekonomi Sirkular):**
   - **Reward Otomatis:** Perhitungan poin otomatis saat laporan selesai diverifikasi ($Poin = Berat \times Tarif\ Jenis\ Sampah$).
   - **Pencairan Saldo:** Penukaran poin ke dompet digital (DANA, GoPay, OVO, ShopeePay) dengan riwayat mutasi lengkap.

3. **Pemantauan Wilayah (Relasi Many-to-Many):**
   - Penugasan petugas/warga pemantau ke berbagai wilayah administratif di DKI Jakarta melalui tabel pivot relasional `UserWilayah`.

4. **Desain Database RDBMS PostgreSQL & Relasi Lengkap:**
   - **One-to-One (1:1):** `LaporanSampah` ↔ `FotoSampah`
   - **One-to-Many (1:N):** `User` → `LaporanSampah`, `Wilayah` → `LaporanSampah`, `JenisSampah` → `LaporanSampah`
   - **Many-to-Many (N:N):** `User` ↔ `Wilayah` (via `UserWilayah`)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router & Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (Cloud Neon Serverless)
- **ORM:** Prisma 6
- **Autentikasi:** NextAuth.js v5 (Auth.js) dengan Enkripsi Bcrypt
- **Styling & UI:** TailwindCSS, Shadcn UI, Lucide Icons, Sonner Toast
- **Deployment:** Vercel (Production Cloud)

---

## 📂 Struktur Direktori Proyek

```text
ecosort/
├── actions/              # Server Actions (Auth, Laporan, Wilayah, Transaksi, Pemantauan)
├── app/                  # App Router Next.js (Dashboard Admin, Dashboard User, Auth, API)
├── components/           # Komponen UI (Formulir, Dialog, Tabel, Filter, Navbar, Sidebar)
├── lib/                  # Utilitas (Prisma Client, NextAuth Config, Validasi Zod)
├── prisma/               # Skema Database & Migrasi SQL PostgreSQL
│   ├── migrations/       # Riwayat Migrasi SQL
│   ├── schema.prisma     # Definisi Skema RDBMS
│   └── seed.ts           # Seeder Data Awal & Demo
└── public/               # Aset statis & logo
```

---

## 📋 Akun Demo untuk Pengujian

| Peran (Role) | Email | Password |
|---|---|---|
| **Administrator** | `admin@ecosort.com` | `admin123` |
| **Warga (User)** | `user@ecosort.com` | `user123` |

---

© 2026 EcoSort. Diciptakan untuk Lingkungan Jakarta yang Lebih Bersih, Tertib, dan Berkelanjutan.