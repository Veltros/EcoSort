# EcoSort

Website EcoSort merupakan project aplikasi web untuk membantu proses pengelolaan, pelaporan, dan Bank Sampah wilayah DKI Jakarta.

## Preview Web

🌐 [Buka Website EcoSort](https://eco-sort-ob4pnp0gb-veltros-projects.vercel.app)

## Teknologi

- Next.js 16 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon Serverless)
- NextAuth.js v5
- TailwindCSS & Shadcn UI

## Fitur Utama

- **Multi-Role User & Admin:** Hak akses terpisah untuk Warga dan Administrator.
- **Pelaporan Sampah:** Pelaporan tumpukan sampah dilengkapi upload bukti foto fisik.
- **Bank Sampah (Transaksi Poin):** Perhitungan reward poin otomatis per kg sampah dan penarikan saldo ke E-Wallet (DANA, GoPay, OVO, ShopeePay).
- **Pemantauan Wilayah:** Relasi Many-to-Many penugasan petugas pemantau ke berbagai wilayah DKI Jakarta.
- **Validasi & Keamanan:** Enkripsi password Bcrypt, validasi Zod, dan perlindungan integritas referensial database.

## Cara Menjalankan Project

1. **Install dependency:**
   ```bash
   npm install
   ```

2. **Setup Environment (.env):**
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
   NEXTAUTH_SECRET="secret-key-kamu"
   ```

3. **Migrasi & Seed Database:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. **Jalankan server development:**
   ```bash
   npm run dev
   ```

## Akun Demo untuk Testing

- **Administrator:** `admin@ecosort.com` / `admin123`
- **Warga (User):** `user@ecosort.com` / `user123`