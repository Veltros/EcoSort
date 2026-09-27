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
  // SEED JENIS SAMPAH
  // ============================================================
  const jenisSampahData = ["Organik", "Non-Organik", "B3"];

  const createdJenis = [];
  for (const namaJenis of jenisSampahData) {
    const jenis = await prisma.jenisSampah.upsert({
      where: { namaJenis },
      update: {},
      create: { namaJenis },
    });
    createdJenis.push(jenis);
  }

  console.log(`✅ Jenis Sampah seeded:`);
  createdJenis.forEach((j) => console.log(`   - ${j.namaJenis}`));
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
