import "dotenv/config";
import { PrismaClient, Role } from "../app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding...\n");

  // ============================================================
  // SEED USERS
  // ============================================================
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const userPasswordHash = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecosort.com" },
    update: {},
    create: {
      nama: "Admin EcoSort",
      email: "admin@ecosort.com",
      noHp: "081200000001",
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const userTest = await prisma.user.upsert({
    where: { email: "user@ecosort.com" },
    update: {},
    create: {
      nama: "Budi Santoso",
      email: "user@ecosort.com",
      noHp: "081200000002",
      password: userPasswordHash,
      role: Role.USER,
    },
  });

  console.log(`✅ Users seeded:`);
  console.log(`   - ${admin.nama} (${admin.email}) | Role: ${admin.role}`);
  console.log(`   - ${userTest.nama} (${userTest.email}) | Role: ${userTest.role}\n`);

  // ============================================================
  // SEED JENIS SAMPAH (dengan Nilai Tukar Poin / kg)
  // ============================================================
  const jenisSampahData = [
    { namaJenis: "Organik", poinPerKg: 1000 },
    { namaJenis: "Non-Organik", poinPerKg: 3000 },
    { namaJenis: "B3", poinPerKg: 5000 },
  ];

  const createdJenis = [];
  for (const item of jenisSampahData) {
    const jenis = await prisma.jenisSampah.upsert({
      where: { namaJenis: item.namaJenis },
      update: { poinPerKg: item.poinPerKg },
      create: { namaJenis: item.namaJenis, poinPerKg: item.poinPerKg },
    });
    createdJenis.push(jenis);
  }

  console.log(`✅ Jenis Sampah & Tarif Poin seeded:`);
  createdJenis.forEach((j) =>
    console.log(`   - ${j.namaJenis} (Rp ${j.poinPerKg.toLocaleString("id-ID")}/kg)`)
  );
  console.log("");

  // ============================================================
  // SEED WILAYAH
  // ============================================================
  const wilayahData = [
    "Jakarta Utara",
    "Jakarta Barat",
    "Jakarta Timur",
    "Jakarta Selatan",
    "Jakarta Pusat",
  ];

  const createdWilayah = [];
  for (const namaWilayah of wilayahData) {
    const wilayah = await prisma.wilayah.upsert({
      where: { namaWilayah },
      update: {},
      create: { namaWilayah },
    });
    createdWilayah.push(wilayah);
  }

  console.log(`✅ Wilayah seeded:`);
  createdWilayah.forEach((w) => console.log(`   - ${w.namaWilayah}`));
  console.log("");

  // ============================================================
  // SEED SAMPLE LAPORAN (opsional - untuk testing)
  // ============================================================
  const jenis = createdJenis[0]; // Organik
  const wilayah = createdWilayah[0]; // Jakarta Utara

  await prisma.laporanSampah.create({
    data: {
      berat: 5.5,
      tanggalLapor: new Date("2024-01-15"),
      status: "SELESAI",
      userId: userTest.id,
      jenisSampahId: jenis.id,
      wilayahId: wilayah.id,
    },
  });

  await prisma.laporanSampah.create({
    data: {
      berat: 2.0,
      tanggalLapor: new Date("2024-01-20"),
      status: "DIPROSES",
      userId: userTest.id,
      jenisSampahId: createdJenis[1].id, // Non-Organik
      wilayahId: createdWilayah[1].id,   // Jakarta Barat
    },
  });

  await prisma.laporanSampah.create({
    data: {
      berat: 0.75,
      tanggalLapor: new Date("2024-01-25"),
      status: "PENDING",
      userId: userTest.id,
      jenisSampahId: createdJenis[2].id, // B3
      wilayahId: createdWilayah[2].id,   // Jakarta Timur
    },
  });

  console.log(`✅ Sample laporan sampah (3 data) seeded\n`);

  // ============================================================
  // SEED USER WILAYAH (Many-to-Many)
  // ============================================================
  const userWilayahData = [
    // Budi memantau Jakarta Utara, Jakarta Barat, Jakarta Timur
    { userId: userTest.id, wilayahId: createdWilayah[0].id }, // Jakarta Utara
    { userId: userTest.id, wilayahId: createdWilayah[1].id }, // Jakarta Barat
    { userId: userTest.id, wilayahId: createdWilayah[2].id }, // Jakarta Timur
  ];

  for (const data of userWilayahData) {
    await prisma.userWilayah.upsert({
      where: { userId_wilayahId: { userId: data.userId, wilayahId: data.wilayahId } },
      update: {},
      create: data,
    });
  }

  console.log(`✅ UserWilayah (Many-to-Many) seeded:`);
  console.log(`   - ${userTest.nama} → Jakarta Utara, Jakarta Barat, Jakarta Timur`);
  console.log(`   (demonstrasi relasi Many-to-Many User ↔ Wilayah)\n`);

  // ============================================================
  // SEED TRANSAKSI POIN (Bank Sampah Reward & E-Wallet)
  // ============================================================
  await prisma.user.update({
    where: { id: userTest.id },
    data: { poin: 22000 },
  });

  // Hapus transaksi lama jika ada
  await prisma.transaksiPoin.deleteMany({
    where: { userId: userTest.id },
  });

  await prisma.transaksiPoin.createMany({
    data: [
      {
        userId: userTest.id,
        tipe: "REWARD",
        jumlahPoin: 16500,
        nominalRupiah: 16500,
        keterangan: "Reward Laporan: 5.5 kg Organik di Jakarta Utara",
        status: "BERHASIL",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: userTest.id,
        tipe: "REWARD",
        jumlahPoin: 15500,
        nominalRupiah: 15500,
        keterangan: "Reward Laporan: Penyetoran sampah daur ulang",
        status: "BERHASIL",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: userTest.id,
        tipe: "PENUKARAN",
        jumlahPoin: 10000,
        nominalRupiah: 10000,
        keterangan: "Pencairan Saldo ke DANA (081234567890)",
        metode: "DANA",
        nomorTujuan: "081234567890",
        status: "BERHASIL",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log(`✅ Transaksi Bank Sampah seeded:`);
  console.log(`   - Saldo Poin ${userTest.nama}: Rp 22.000 (22.000 Poin)`);
  console.log(`   - Riwayat mutasi transaksi: 2 Reward (+), 1 Penukaran DANA (-)\n`);

  console.log("🎉 Seeding selesai!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Akun untuk testing:");
  console.log("   ADMIN  → admin@ecosort.com / admin123");
  console.log("   USER   → user@ecosort.com  / user123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
